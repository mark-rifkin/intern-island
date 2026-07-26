import { Intern, placeholderImageSrc } from "../data/interns";
import { formatCurrency } from "../utils/currency";
import { createEvenAllocation, updateAllocation } from "../utils/allocation";

interface Props { totalCents: number; order: Intern[]; allocations: number[]; onChange: (values: number[]) => void; onPay: () => void; }
export function AllocationScreen({ totalCents, order, allocations, onChange, onPay }: Props) {
  return <section className="screen allocation-screen" aria-labelledby="allocation-title"><header className="allocation-header"><div><h1 id="allocation-title">Allocate your tip</h1><p className="subtitle">Are some interns more equal than others?</p></div><div className="total-display">Total <strong>{formatCurrency(totalCents)}</strong></div></header><div className="allocation-list">{order.map((intern, index) => <div className="allocation-row" key={intern.id}><img className="intern-photo" src={intern.imageSrc} alt={intern.alt} onError={(event) => { event.currentTarget.src = placeholderImageSrc; }} /><input aria-label={`Allocation ${index + 1}`} type="range" min="0" max={totalCents} step="1" value={allocations[index] ?? 0} onChange={(event) => onChange(updateAllocation(allocations, index, Number(event.target.value), totalCents))} /><output>{formatCurrency(allocations[index] ?? 0)}</output></div>)}</div><footer className="screen-footer"><button className="secondary-button" onClick={() => onChange(createEvenAllocation(totalCents, order.length))}>Reset</button><button className="primary-button" onClick={onPay}>Pay</button></footer></section>;
}
