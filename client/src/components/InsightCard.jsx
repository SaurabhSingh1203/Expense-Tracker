export default function InsightCard({ insight, loading, error, onGenerate }) {
  const formattedInsight = insight
    ? formatInsight(insight.content)
    : { spending: "", budget: "", emergency: "", suggestions: [] };

  return (
    <section className="panel insight-panel">
      <div className="panel-heading">
        <div>
          <h2>AI Financial Insights</h2>
          <p className="muted">Uses expenses, budget inputs, and emergency fund targets when generated.</p>
        </div>
        <button className="primary" onClick={onGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate AI Insights"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {insight ? (
        <div className="insight-copy">
          <div className="insight-grid">
            <InsightSection title="Spending Pattern" text={formattedInsight.spending} />
            <InsightSection title="Budget Status" text={formattedInsight.budget} />
            <InsightSection title="Emergency Fund" text={formattedInsight.emergency} />
          </div>

          {formattedInsight.suggestions.length > 0 && (
            <div className="suggestions-box">
              <span>Action Suggestions</span>
              <ol>
                {formattedInsight.suggestions.map((suggestion) => (
                  <li key={suggestion}>{renderBoldText(suggestion)}</li>
                ))}
              </ol>
            </div>
          )}

          <span className="insight-date">Last generated {new Date(insight.updatedAt).toLocaleString()}</span>
        </div>
      ) : (
        <p className="empty">No saved insight yet. Generate one after adding expenses.</p>
      )}
    </section>
  );
}

function InsightSection({ title, text }) {
  if (!text) return null;

  return (
    <article className="insight-section">
      <span>{title}</span>
      <p>{renderBoldText(text)}</p>
    </article>
  );
}

function formatInsight(content) {
  const normalized = content.replace(/\s+/g, " ").trim();
  const suggestionMatch = normalized.match(
    /(?:Action Suggestions?:|Two (?:simple|helpful|practical)? ?(?:ways|ideas|suggestions).*?:|2 practical saving suggestions?:|Saving suggestions?:)(.*)$/i
  );
  const mainText = stripSectionLabels(suggestionMatch ? normalized.slice(0, suggestionMatch.index).trim() : normalized);
  const suggestionsText = suggestionMatch ? suggestionMatch[1].trim() : "";
  const sentences = mainText.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) || [mainText];
  const suggestions = suggestionsText
    .split(/\s*\d+[.)]\s*/)
    .map((item) => item.replace(/^[\s:.-]+/, "").trim())
    .filter(Boolean);

  return {
    spending: sentences.filter(isSpendingSentence).join(" ") || sentences[0] || "",
    budget: sentences.filter(isBudgetSentence).join(" "),
    emergency: emphasizeEmergencyFund(sentences.filter(isEmergencySentence).join(" ")),
    suggestions
  };
}

function stripSectionLabels(text) {
  return text.replace(/(?:Spending Pattern|Budget Status|Emergency Fund|Action Suggestions):/gi, "");
}

function isSpendingSentence(sentence) {
  return /spending|category|monthly trend|total/i.test(sentence) && !isBudgetSentence(sentence) && !isEmergencySentence(sentence);
}

function isBudgetSentence(sentence) {
  return /budget|income|savings goal|overspending|left after|remaining after|expenses/i.test(sentence) && !isEmergencySentence(sentence);
}

function isEmergencySentence(sentence) {
  return /emergency fund|emergency|saved toward|target|months to|way there|progress/i.test(sentence);
}

function emphasizeEmergencyFund(text) {
  return text.replace(/\bemergency fund\b/gi, "**Emergency Fund**");
}

function renderBoldText(text) {
  const highlightedText = text
    .replace(/\$(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})?/g, (match) => `**${match}**`)
    .replace(/\b\d+(?:\.\d+)?%/g, (match) => `**${match}**`)
    .replace(/\b\d+\s*(?:months?|mo)\b/gi, (match) => `**${match}**`)
    .replace(/\b(Food|Housing|Transportation|Utilities|Health|Entertainment|Shopping|Other)\b/g, "**$1**")
    .replace(
      /\b(biggest spending category|highest category|monthly income|monthly spending|savings goal|remaining after expenses|remaining after savings goal|emergency fund|target fund|current savings|monthly contribution|overspending)\b/gi,
      (match) => `**${match}**`
    );

  return highlightedText.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}
