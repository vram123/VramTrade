import { useState } from "react";
import type { QuizQuestion } from "../data/quizQuestions";

export const PASS_RATIO = 0.7;

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
}

export function CertificationQuiz({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (result: QuizResult) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));

  const total = questions.length;
  const question = questions[index];
  const selected = answers[index];
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLast = index === total - 1;

  const selectAnswer = (choiceIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choiceIndex;
      return next;
    });
  };

  const submit = () => {
    const score = questions.reduce(
      (sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0),
      0,
    );
    onFinish({ score, total, passed: score / total >= PASS_RATIO });
  };

  return (
    <div className="quiz-embed">
      <div className="card quiz-progress-card">
        <div className="guides-progress-label">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="guides-progress-track">
          <div
            className="guides-progress-fill"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="card quiz-question-card">
        <h2>
          Q{index + 1}. {question.question}
        </h2>
        <div className="quiz-choices">
          {question.choices.map((choice, i) => (
            <button
              key={i}
              className={`quiz-choice ${selected === i ? "selected" : ""}`}
              onClick={() => selectAnswer(i)}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-nav">
        <button
          className="cancel-btn"
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
        >
          ← Previous
        </button>
        {isLast ? (
          <button className="submit-trade buy" onClick={submit} disabled={answeredCount < total}>
            Submit
          </button>
        ) : (
          <button className="submit-trade buy" onClick={() => setIndex((i) => Math.min(i + 1, total - 1))}>
            Next →
          </button>
        )}
      </div>
      {isLast && answeredCount < total && (
        <p className="settings-hint quiz-warning">
          Answer every question before submitting — {total - answeredCount} left.
        </p>
      )}
    </div>
  );
}
