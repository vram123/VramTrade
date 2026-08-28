import { useEffect, useState } from "react";
import { COURSE_CHAPTERS, TOTAL_COURSE_MINUTES } from "../data/courseContent";
import { QUIZ_QUESTIONS, type QuizQuestion } from "../data/quizQuestions";
import { EXTERNAL_RESOURCES } from "../data/resources";
import { CertificationQuiz, PASS_RATIO, type QuizResult } from "./CertificationQuiz";
import { Certificate } from "./Certificate";
import { useAuthStore } from "../store/authStore";

const PROGRESS_KEY = "vramtrade-course-progress";
const CERT_KEY = "vramtrade-course-certificate";
const QUESTIONS_PER_SECTION = 5;

interface ChapterProgress {
  passed: boolean;
  bestScore: number;
  bestTotal: number;
}

type CourseProgress = Record<string, ChapterProgress>;

interface CertificateRecord {
  name: string;
  date: string;
}

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
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [nameInput, setNameInput] = useState(username ?? "");

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

  const isUnlocked = (index: number) =>
    index === 0 || Boolean(progress[chapters[index - 1].id]?.passed);

  const openChapter = (index: number) => {
    setActiveChapterIndex(index);
    setStage("reading");
  };

  const handleQuizFinish = (result: QuizResult) => {
    setLastResult(result);
    setProgress((prev) => {
      const existing = prev[activeChapter.id];
      return {
        ...prev,
        [activeChapter.id]: {
          passed: result.passed || Boolean(existing?.passed),
          bestScore: Math.max(existing?.bestScore ?? 0, result.score),
          bestTotal: result.total,
        },
      };
    });
    setStage("result");
  };

  if (stage === "quiz") {
    return (
      <CertificationQuiz
        questions={sectionQuestions(activeChapter.id)}
        title={`${activeChapter.title} — quiz`}
        exitLabel="Exit quiz"
        onFinish={handleQuizFinish}
        onExit={() => setStage("reading")}
      />
    );
  }

  if (stage === "result" && lastResult) {
    const isLastChapter = activeChapterIndex === chapters.length - 1;
    const pct = Math.round((lastResult.score / lastResult.total) * 100);
    return (
      <div className="settings-page">
        <div className="settings-page-header">
          <button className="back-btn" onClick={() => setStage("overview")}>
            ← Back to overview
          </button>
          <h1>{activeChapter.title}</h1>
        </div>
        <div className={`card result-card ${lastResult.passed ? "passed" : "failed"}`}>
          <h2>{lastResult.passed ? "Section passed" : "Not quite — try again"}</h2>
          <p className="result-score">
            {lastResult.score} / {lastResult.total} ({pct}%)
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
                    onClick={() => openChapter(activeChapterIndex + 1)}
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
                <button className="cancel-btn" onClick={() => setStage("reading")}>
                  Review section
                </button>
              </>
            )}
          </div>
        </div>
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

  if (stage === "reading") {
    const chapterMinutes = activeChapter.topics.reduce((s, t) => s + t.minutes, 0);
    const quizSize = sectionQuestions(activeChapter.id).length;
    return (
      <div className="settings-page">
        <div className="settings-page-header">
          <button className="back-btn" onClick={() => setStage("overview")}>
            ← Back to overview
          </button>
          <h1>{activeChapter.title}</h1>
        </div>

        <div className="card">
          <p className="settings-hint">
            {activeChapter.intro} <span className="guides-chapter-time">~{chapterMinutes} min</span>
          </p>
        </div>

        {activeChapter.topics.map((topic) => (
          <div className="card" key={topic.id}>
            <h2>
              {topic.title} <span className="guides-topic-time">~{topic.minutes} min</span>
            </h2>
            {topic.body.map((paragraph, i) => (
              <p className="reading-paragraph" key={i}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}

        <div className="card">
          <p className="settings-hint">
            Ready? This section's quiz has {quizSize} questions — score{" "}
            {Math.round(PASS_RATIO * 100)}% or higher to unlock the next section.
          </p>
          <button className="submit-trade buy" onClick={() => setStage("quiz")}>
            Start section quiz
          </button>
        </div>
      </div>
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
          <span>
            {passedCount} of {chapters.length} sections passed
          </span>
        </div>
        <div className="guides-progress-track">
          <div
            className="guides-progress-fill"
            style={{ width: `${(passedCount / chapters.length) * 100}%` }}
          />
        </div>
        <p className="settings-hint">
          {courseComplete
            ? "You've completed every section — your certificate is ready below."
            : "Each section is a full lesson followed by a short quiz. Score 70% or higher to unlock the next section — a guided path, one section at a time."}
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
            const unlocked = isUnlocked(index);
            const chapterProgress = progress[chapter.id];
            const status = chapterProgress?.passed ? "completed" : unlocked ? "available" : "locked";
            return (
              <button
                key={chapter.id}
                className={`path-item ${status}`}
                disabled={!unlocked}
                onClick={() => openChapter(index)}
              >
                <span className="path-index">{index + 1}</span>
                <span className="path-body">
                  <span className="path-title">{chapter.title.replace(/^\d+\.\s*/, "")}</span>
                  <span className="path-meta">
                    {status === "completed"
                      ? `Passed — ${chapterProgress?.bestScore}/${chapterProgress?.bestTotal}`
                      : status === "available"
                        ? "Ready to start"
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
