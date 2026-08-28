export function Certificate({
  name,
  score,
  total,
  date,
  onBack,
}: {
  name: string;
  score: number;
  total: number;
  date: string;
  onBack: () => void;
}) {
  const pct = Math.round((score / total) * 100);

  return (
    <div className="settings-page certificate-page">
      <div className="settings-page-header no-print">
        <button className="back-btn" onClick={onBack}>
          ← Back to guides
        </button>
        <h1>Certificate</h1>
      </div>

      <div className="certificate">
        <div className="certificate-border">
          <div className="certificate-kicker">VramTrade Trading Academy</div>
          <h2 className="certificate-title">Certificate of Completion</h2>
          <p className="certificate-lede">This certifies that</p>
          <p className="certificate-name">{name}</p>
          <p className="certificate-lede">
            has completed the Fundamentals of Trading course and passed the certification exam
            with a score of <strong>{score} / {total}</strong> ({pct}%).
          </p>
          <div className="certificate-footer">
            <div className="certificate-signoff">
              <div className="certificate-line" />
              <div className="certificate-caption">Date issued: {date}</div>
            </div>
            <div className="certificate-signoff">
              <div className="certificate-line" />
              <div className="certificate-caption">VramTrade Trading Academy</div>
            </div>
          </div>
        </div>
      </div>

      <div className="certificate-actions no-print">
        <button className="submit-trade buy" onClick={() => window.print()}>
          🖨 Print / save as PDF
        </button>
      </div>
    </div>
  );
}
