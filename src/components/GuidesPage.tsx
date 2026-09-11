import { useEffect, useRef, useState } from "react";
import { COURSE_CHAPTERS, TOTAL_COURSE_MINUTES } from "../data/courseContent";
import { QUIZ_QUESTIONS, type QuizQuestion } from "../data/quizQuestions";
import { EXTERNAL_RESOURCES } from "../data/resources";
import { CertificationQuiz, PASS_RATIO, type QuizResult } from "./CertificationQuiz";
import { Certificate } from "./Certificate";
import { CourseSidebar, type ChapterProgress } from "./CourseSidebar";
import { ReadingProgressRing } from "./ReadingProgressRing";
import { useAuthStore } from "../store/authStore";

const PROGRESS_KEY = "vramtrade-course-progress";
const CERT_KEY = "vramtrade-course-certificate";
const QUESTIONS_PER_SECTION = 5;

type CourseProgress = Record<string, ChapterProgress>;

interface CertificateRecord {
  name: string;
  date: string;
}

const EMPTY_PROGRESS: ChapterProgress = {
  passed: false,
  bestScore: 0,
  bestTotal: QUESTIONS_PER_SECTION,
  viewedTopicIds: [],
};

function loadProgress(): CourseProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function loadCertificate(): CertificateRecord | null {
  try {
    const saved = localStorage.getItem(CERT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function sectionQuestions(chapterId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.chapterId === chapterId).slice(0, QUESTIONS_PER_SECTION);
}

type Stage = "overview" | "reading" | "quiz" | "result" | "certificate";

export function GuidesPage({ onBack }: { onBack: () => void }) {
  const username = useAuthStore((s) => s.username);
  const [progress, setProgress] = useState<CourseProgress>(loadProgress);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(loadCertificate);
  const [stage, setStage] = useState<Stage>("overview");
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [nameInput, setNameInput] = useState(username ?? "");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });
  const [railOpen, setRailOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (certificate) localStorage.setItem(CERT_KEY, JSON.stringify(certificate));
  }, [certificate]);

  useEffect(() => {
    if (username) setNameInput(username);
  }, [username]);

  const chapters = COURSE_CHAPTERS;
  const activeChapter = chapters[activeChapterIndex];
  const passedCount = chapters.filter((c) => progress[c.id]?.passed).length;
  const courseComplete = passedCount === chapters.length;
  const courseHours = (TOTAL_COURSE_MINUTES / 60).toFixed(1).replace(/\.0$/, "");

  const totalScore = chapters.reduce((sum, c) => sum + (progress[c.id]?.bestScore ?? 0), 0);
  const totalPossible = chapters.reduce(
    (sum, c) => sum + (progress[c.id]?.bestTotal ?? QUESTIONS_PER_SECTION),
    0,
  );

  // Fine-grained completion, like IBM's "18% COMPLETE" ticking per lesson —
  // each chapter contributes up to 4 read lessons + 1 passed quiz out of 5 units.
  const totalUnits = chapters.length * (4 + 1);
  const completedUnits = chapters.reduce((sum, c) => {
    const p = progress[c.id];
    return sum + Math.min(4, p?.viewedTopicIds.length ?? 0) + (p?.passed ? 1 : 0);
  }, 0);
  const overallPct = totalUnits === 0 ? 0 : Math.round((completedUnits / totalUnits) * 100);

  // Mint the certificate record once, the moment every section is first passed —
  // so its date reflects completion, not whenever the page happens to be revisited.
  useEffect(() => {
    if (courseComplete && !certificate) {
      setCertificate({
        name: nameInput.trim() || "VramTrade Student",
        date: new Date().toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }
  }, [courseComplete, certificate, nameInput]);

  const isChapterUnlocked = (index: number) =>
    index === 0 || Boolean(progress[chapters[index - 1].id]?.passed);

  const markTopicViewed = (chapterId: string, topicId: string) => {
    setProgress((prev) => {
      const existing = prev[chapterId] ?? EMPTY_PROGRESS;
      if (existing.viewedTopicIds.includes(topicId)) return prev;
      return {
        ...prev,
        [chapterId]: { ...existing, viewedTopicIds: [...existing.viewedTopicIds, topicId] },
      };
    });
  };

  const measureScrollPct = () => {
    const el = contentRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollPct(max <= 0 ? 100 : Math.round(Math.min(100, Math.max(0, (el.scrollTop / max) * 100))));
  };

  // Visiting a topic marks it read immediately, the same way clicking into an
  // IBM course lesson checks it off without requiring you to scroll to the end.
  useEffect(() => {
    if (stage === "reading") {
      markTopicViewed(activeChapter.id, activeChapter.topics[activeTopicIndex].id);
    }
    if (contentRef.current) contentRef.current.scrollTop = 0;
    // Measure after the new content has actually painted, so a short lesson
    // that needs no scrolling reads as 100% instead of a stale 0%.
    const raf = requestAnimationFrame(measureScrollPct);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, activeChapterIndex, activeTopicIndex]);

  const openChapterAtTopic = (chapterIndex: number, topicIndex: number) => {
    setActiveChapterIndex(chapterIndex);
    setActiveTopicIndex(topicIndex);
    setStage("reading");
    setExpanded((prev) => ({ ...prev, [chapterIndex]: true }));
    setRailOpen(false);
  };

  const openQuiz = (chapterIndex: number) => {
    if (!isChapterUnlocked(chapterIndex)) return;
    setActiveChapterIndex(chapterIndex);
    setStage("quiz");
    setExpanded((prev) => ({ ...prev, [chapterIndex]: true }));
    setRailOpen(false);
  };

  const toggleChapter = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const nextTopic = () => {
    if (activeTopicIndex < activeChapter.topics.length - 1) {
      setActiveTopicIndex((i) => i + 1);
    } else {
      setStage("quiz");
    }
  };

  const prevTopic = () => {
    if (activeTopicIndex > 0) setActiveTopicIndex((i) => i - 1);
  };

  const handleQuizFinish = (result: QuizResult) => {
    setLastResult(result);
    setProgress((prev) => {
      const existing = prev[activeChapter.id] ?? EMPTY_PROGRESS;
      return {
        ...prev,
        [activeChapter.id]: {
          ...existing,
          passed: result.passed || existing.passed,
          bestScore: Math.max(existing.bestScore, result.score),
          bestTotal: result.total,
        },
      };
    });
    setStage("result");
  };

  const isImmersive = stage === "reading" || stage === "quiz" || stage === "result";

  if (isImmersive) {
    const isLastTopic = activeTopicIndex === activeChapter.topics.length - 1;
    const isLastChapter = activeChapterIndex === chapters.length - 1;

    return (
      <div className="course-player">
        <div className="course-topbar">
          <div className="course-topbar-track">
            <div className="course-topbar-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <div className="course-header">
            <button
              type="button"
              className="course-menu-btn"
              aria-label="Toggle course menu"
              onClick={() => setRailOpen((v) => !v)}
            >
              ☰
            </button>
            <div className="course-header-title">
              <span className="course-header-eyebrow">Fundamentals of Trading</span>
              <span className="course-header-chapter">{activeChapter.title}</span>
            </div>
            <button type="button" className="course-exit-btn" onClick={() => setStage("overview")}>
              Exit course
            </button>
          </div>
        </div>

        <div className="course-body">
          {railOpen && <div className="course-rail-backdrop" onClick={() => setRailOpen(false)} />}
          <div className={`course-rail-wrap ${railOpen ? "open" : ""}`}>
            <CourseSidebar
              chapters={chapters}
              progress={progress}
              activeChapterIndex={activeChapterIndex}
              activeTopicIndex={stage === "reading" ? activeTopicIndex : null}
              onQuizOrResult={stage === "quiz" || stage === "result"}
              expanded={expanded}
              onToggleChapter={toggleChapter}
              isChapterUnlocked={isChapterUnlocked}
              onSelectTopic={openChapterAtTopic}
              onSelectQuiz={openQuiz}
              overallPct={overallPct}
            />
          </div>

          <div className="course-content" ref={contentRef} onScroll={measureScrollPct}>
            {stage === "reading" && (
              <div className="card topic-card">
                <div className="topic-card-head">
                  <div>
                    <div className="topic-card-eyebrow">
                      Lesson {activeTopicIndex + 1} of {activeChapter.topics.length}
                    </div>
                    <h2>
                      {activeChapter.topics[activeTopicIndex].title}{" "}
                      <span className="guides-topic-time">
                        ~{activeChapter.topics[activeTopicIndex].minutes} min
                      </span>
                    </h2>
                  </div>
                  <ReadingProgressRing percent={scrollPct} />
                </div>
                {activeChapter.topics[activeTopicIndex].body.map((paragraph, i) => (
                  <p className="reading-paragraph" key={i}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {stage === "quiz" && (
              <CertificationQuiz questions={sectionQuestions(activeChapter.id)} onFinish={handleQuizFinish} />
            )}

            {stage === "result" && lastResult && (
              <div className={`card result-card ${lastResult.passed ? "passed" : "failed"}`}>
                <h2>{lastResult.passed ? "Section passed" : "Not quite — try again"}</h2>
                <p className="result-score">
                  {lastResult.score} / {lastResult.total} (
                  {Math.round((lastResult.score / lastResult.total) * 100)}%)
                </p>
                <p className="settings-hint">
                  {lastResult.passed
                    ? isLastChapter
                      ? "That's the final section — your certificate is ready."
                      : "You've unlocked the next section."
                    : `You need ${Math.round(PASS_RATIO * 100)}% or higher to pass this section's quiz.`}
                </p>
                <div className="exam-actions">
                  {lastResult.passed ? (
                    <>
                      {isLastChapter ? (
                        <button className="submit-trade buy" onClick={() => setStage("certificate")}>
                          View certificate
                        </button>
                      ) : (
                        <button
                          className="submit-trade buy"
                          onClick={() => openChapterAtTopic(activeChapterIndex + 1, 0)}
                        >
                          Continue to next section →
                        </button>
                      )}
                      <button className="cancel-btn" onClick={() => setStage("overview")}>
                        Back to overview
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="submit-trade buy" onClick={() => setStage("quiz")}>
                        Retry quiz
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => openChapterAtTopic(activeChapterIndex, 0)}
                      >
                        Review section
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {stage === "reading" && (
          <div className="course-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={prevTopic}
              disabled={activeTopicIndex === 0}
            >
              ← Previous
            </button>
            <span className="course-footer-status">
              Lesson {activeTopicIndex + 1} of {activeChapter.topics.length}
            </span>
            <button type="button" className="submit-trade buy" onClick={nextTopic}>
              {isLastTopic ? "Start section quiz →" : "Next →"}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (stage === "certificate" && certificate) {
    return (
      <Certificate
        name={certificate.name}
        score={totalScore}
        total={totalPossible}
        date={certificate.date}
        onBack={() => setStage("overview")}
      />
    );
  }

  return (
    <div className="settings-page guides-page">
      <div className="settings-page-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Trading guides</h1>
      </div>

      <div className="card guides-progress-card">
        <div className="guides-progress-label">
          <span>Fundamentals of Trading — a ~{courseHours} hour course</span>
          <span>{overallPct}% complete</span>
        </div>
        <div className="guides-progress-track">
          <div className="guides-progress-fill" style={{ width: `${overallPct}%` }} />
        </div>
        <p className="settings-hint">
          {courseComplete
            ? "You've completed every section — your certificate is ready below."
            : "Each section is a set of short lessons followed by a 5-question quiz. Score 70% or higher to unlock the next section — a guided path, one lesson at a time."}
        </p>
      </div>

      {!username && (
        <div className="card">
          <h2>Name for your certificate</h2>
          <div className="field">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Jane Trader"
            />
          </div>
        </div>
      )}

      <div className="card">
        <h2>Course path</h2>
        <div className="path-list">
          {chapters.map((chapter, index) => {
            const unlocked = isChapterUnlocked(index);
            const chapterProgress = progress[chapter.id];
            const viewedCount = chapterProgress?.viewedTopicIds.length ?? 0;
            const status = chapterProgress?.passed ? "completed" : unlocked ? "available" : "locked";
            return (
              <button
                key={chapter.id}
                className={`path-item ${status}`}
                disabled={!unlocked}
                onClick={() => openChapterAtTopic(index, 0)}
              >
                <span className="path-index">{index + 1}</span>
                <span className="path-body">
                  <span className="path-title">{chapter.title.replace(/^\d+\.\s*/, "")}</span>
                  <span className="path-meta">
                    {status === "completed"
                      ? `Passed — ${chapterProgress?.bestScore}/${chapterProgress?.bestTotal} · ${viewedCount}/${chapter.topics.length} lessons`
                      : status === "available"
                        ? `${viewedCount}/${chapter.topics.length} lessons read — ready to start`
                        : "Locked — finish the previous section first"}
                  </span>
                </span>
                <span className="path-status">
                  {status === "completed" ? "✓" : status === "locked" ? "🔒" : "→"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {courseComplete && (
        <div className="card exam-card">
          <h2>Your certificate</h2>
          <p className="settings-hint">
            Final score: {totalScore} / {totalPossible} (
            {Math.round((totalScore / totalPossible) * 100)}%)
          </p>
          <button className="submit-trade buy" onClick={() => setStage("certificate")}>
            View certificate
          </button>
        </div>
      )}

      <div className="card">
        <h2>Outside resources</h2>
        <p className="settings-hint">
          This course is a starting point, not the last word. These are places to go deeper —
          official sources first, then free courses, reference material, and a few books.
        </p>
        <div className="resource-groups">
          {EXTERNAL_RESOURCES.map((group) => (
            <div className="resource-group" key={group.category}>
              <h3>{group.category}</h3>
              {group.items.map((item) => (
                <div className="resource-item" key={item.title}>
                  <div className="resource-item-title">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                    <span className="resource-publisher"> — {item.publisher}</span>
                  </div>
                  <p>{item.note}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
