import { useRef } from "react";
import { Intern, placeholderImageSrc } from "../data/interns";
import { formatCurrency } from "../utils/currency";
import { createEvenAllocation, updateAllocation } from "../utils/allocation";

interface Props { totalCents: number; order: Intern[]; allocations: number[]; onChange: (values: number[]) => void; onPay: () => void; }
export function AllocationScreen({ totalCents, order, allocations, onChange, onPay }: Props) {
  const interaction = useRef<{ index: number; allocations: number[] } | null>(null);
  const beginInteraction = (index: number, refresh = false) => {
    if (refresh || interaction.current?.index !== index) {
      interaction.current = { index, allocations: [...allocations] };
    }
  };
  const endInteraction = () => {
    interaction.current = null;
  };
  const changeAllocation = (index: number, value: number) => {
    const baseline = interaction.current?.index === index
      ? interaction.current.allocations
      : allocations;
    onChange(updateAllocation(baseline, index, value, totalCents));
  };
  const resetAllocations = () => {
    endInteraction();
    onChange(createEvenAllocation(totalCents, order.length));
  };

  return <section className="screen allocation-screen" aria-labelledby="allocation-title"><header className="allocation-header"><div><h1 id="allocation-title">Allocate your tip</h1><p className="subtitle">Are some interns more equal than others?</p></div><div className="total-display">Total <strong>{formatCurrency(totalCents)}</strong></div></header><div className="allocation-list">{order.map((intern, index) => <div className="allocation-row" key={intern.id}><img className="intern-photo" src={intern.imageSrc} alt={intern.alt} onError={(event) => { event.currentTarget.src = placeholderImageSrc; }} /><input aria-label={`Allocation ${index + 1}`} type="range" min="0" max={totalCents} step="1" value={allocations[index] ?? 0} onFocus={() => beginInteraction(index)} onPointerDown={() => beginInteraction(index, true)} onKeyDown={() => beginInteraction(index)} onBlur={endInteraction} onChange={(event) => changeAllocation(index, Number(event.target.value))} /><output>{formatCurrency(allocations[index] ?? 0)}</output></div>)}</div><footer className="screen-footer"><button className="secondary-button" onClick={resetAllocations}>Reset</button><button className="primary-button" onClick={onPay}>Pay</button></footer></section>;
}
