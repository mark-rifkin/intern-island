import { formatCurrency } from "../utils/currency";

interface Props { selectedTipCents: number | null; presetTips: number[]; onChoose: (value: number) => void; onCustom: (button: HTMLButtonElement) => void; onContinue: () => void; }
export function TipSelectionScreen({ selectedTipCents, presetTips, onChoose, onCustom, onContinue }: Props) {
  return <section className="screen tip-screen" aria-labelledby="tip-title">
    <header className="screen-header"><div><p className="eyebrow">Welcome to Intern Island!</p><h1 id="tip-title">Leave a tip?</h1></div><span className="security-label"><span aria-hidden="true">&#128274;</span> Secure payment</span></header>
    <div className="tip-options">{presetTips.map((tip) => { const button = <button key={tip} className={`tip-option ${selectedTipCents === tip ? "selected" : ""}`} aria-pressed={selectedTipCents === tip} onClick={() => onChoose(tip)}>{formatCurrency(tip)}{selectedTipCents === tip && <span className="check" aria-hidden="true">&#10003;</span>}</button>; return tip === 100000 ? <div className="tip-option-wrapper" key={tip}><span className="recommended-badge">Recommended</span>{button}</div> : button; })}<button className={`tip-option ${selectedTipCents !== null && !presetTips.includes(selectedTipCents) ? "selected" : ""}`} onClick={(event) => onCustom(event.currentTarget)}>Custom{selectedTipCents !== null && !presetTips.includes(selectedTipCents) && <span className="check" aria-hidden="true">&#10003;</span>}</button></div>
    <footer className="screen-footer"><button className="primary-button" disabled={selectedTipCents === null} onClick={onContinue}>Continue <span aria-hidden="true">&#8594;</span></button></footer>
  </section>;
}
