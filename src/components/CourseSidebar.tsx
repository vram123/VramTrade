import type { CourseChapter } from "../data/courseContent";

export interface ChapterProgress {
  passed: boolean;
  bestScore: number;
  bestTotal: number;
  viewedTopicIds: string[];
}

type CourseProgress = Record<string, ChapterProgress>;

function StatusIcon({ status }: { status: "done" | "current" | "todo" | "locked" }) {
  if (status === "done") {
    return (
      <span className="rail-icon done" aria-hidden="true">
        ✓
      </span>
    );
  }
  if (status === "current") {
    return <span className="rail-icon current" aria-hidden="true" />;
  }
  if (status === "locked") {
    return (
      <span className="rail-icon locked" aria-hidden="true">
        🔒
      </span>
    );
  }
  return <span className="rail-icon todo" aria-hidden="true" />;
}

export function CourseSidebar({
  chapters,
  progress,
  activeChapterIndex,
  activeTopicIndex,
  onQuizOrResult,
  expanded,
  onToggleChapter,
  isChapterUnlocked,
  onSelectTopic,
  onSelectQuiz,
  overallPct,
}: {
  chapters: CourseChapter[];
  progress: CourseProgress;
  activeChapterIndex: number;
  activeTopicIndex: number | null;
  onQuizOrResult: boolean;
  expanded: Record<number, boolean>;
  onToggleChapter: (index: number) => void;
  isChapterUnlocked: (index: number) => boolean;
  onSelectTopic: (chapterIndex: number, topicIndex: number) => void;
  onSelectQuiz: (chapterIndex: number) => void;
  overallPct: number;
}) {
  return (
    <nav className="course-rail">
      <div className="course-rail-progress">
        <span className="course-rail-pct">{overallPct}% COMPLETE</span>
        <div className="course-rail-track">
          <div className="course-rail-fill" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      <div className="course-rail-list">
        {chapters.map((chapter, cIndex) => {
          const unlocked = isChapterUnlocked(cIndex);
          const chapterProgress = progress[chapter.id];
          const viewedCount = chapterProgress?.viewedTopicIds.length ?? 0;
          const isOpen = Boolean(expanded[cIndex]);
          const quizStatus: "done" | "current" | "todo" | "locked" = chapterProgress?.passed
            ? "done"
            : !unlocked
              ? "locked"
              : onQuizOrResult && activeChapterIndex === cIndex
                ? "current"
                : "todo";

          return (
            <div className="rail-chapter" key={chapter.id}>
              <button
                type="button"
                className={`rail-chapter-head ${isOpen ? "open" : ""}`}
                onClick={() => onToggleChapter(cIndex)}
              >
                <span className="rail-chapter-num">{cIndex + 1}</span>
                <span className="rail-chapter-title">
                  <span className="rail-chapter-name">{chapter.title.replace(/^\d+\.\s*/, "")}</span>
                  <span className="rail-chapter-meta">
                    {unlocked
                      ? `${viewedCount} of ${chapter.topics.length} lessons · quiz ${chapterProgress?.passed ? "passed" : "pending"}`
                      : "Locked — finish the previous section"}
                  </span>
                </span>
                <span className={`rail-chevron ${isOpen ? "open" : ""}`} aria-hidden="true">
                  ⌄
                </span>
              </button>

              {isOpen && (
                <div className="rail-items">
                  {chapter.topics.map((topic, tIndex) => {
                    const isCurrent =
                      !onQuizOrResult && activeChapterIndex === cIndex && activeTopicIndex === tIndex;
                    const isDone = chapterProgress?.viewedTopicIds.includes(topic.id) ?? false;
                    const status: "done" | "current" | "todo" = isCurrent
                      ? "current"
                      : isDone
                        ? "done"
                        : "todo";
                    return (
                      <button
                        type="button"
                        key={topic.id}
                        className={`rail-item ${status}`}
                        onClick={() => onSelectTopic(cIndex, tIndex)}
                      >
                        <StatusIcon status={status} />
                        <span className="rail-item-label">{topic.title}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className={`rail-item rail-item-quiz ${quizStatus}`}
                    disabled={!unlocked}
                    onClick={() => onSelectQuiz(cIndex)}
                  >
                    <StatusIcon status={quizStatus} />
                    <span className="rail-item-label">Section quiz · 5 questions</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
