export function createEvenAllocation(totalCents: number, count: number): number[] {
  if (count <= 0) return [];
  const base = Math.floor(totalCents / count);
  const remainder = totalCents % count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

export function getAllocationStepCents(totalCents: number): number {
  if (totalCents < 25) return 1;
  const dollars = totalCents / 100;
  if (dollars < 100) return 25;
  if (dollars < 1000) return 100;
  if (dollars < 10000) return 500;
  if (dollars < 100000) return 2500;
  return 10000;
}

export function updateAllocation(allocations: number[], changedIndex: number, requestedValueCents: number, totalCents: number): number[] {
  if (changedIndex < 0 || changedIndex >= allocations.length) return [...allocations];
  const result = [...allocations];
  const next = Math.max(0, Math.min(requestedValueCents, totalCents));
  const delta = next - result[changedIndex];
  if (delta === 0) return result;
  const others = result.map((_, index) => index).filter((index) => index !== changedIndex);
  if (delta > 0) {
    let remaining = delta;
    let eligible = others.filter((index) => result[index] > 0);
    while (remaining > 0 && eligible.length) {
      const share = Math.floor(remaining / eligible.length);
      const remainder = remaining % eligible.length;
      let removed = 0;
      eligible.forEach((index, position) => {
        const amount = Math.min(result[index], share + (position < remainder ? 1 : 0));
        result[index] -= amount;
        removed += amount;
      });
      if (!removed) break;
      remaining -= removed;
      eligible = eligible.filter((index) => result[index] > 0);
    }
  } else {
    const released = -delta;
    const share = Math.floor(released / others.length);
    const remainder = released % others.length;
    others.forEach((index, position) => { result[index] += share + (position < remainder ? 1 : 0); });
  }
  result[changedIndex] = next;
  const difference = totalCents - result.reduce((sum, value) => sum + value, 0);
  if (difference) {
    const target = difference > 0 ? others.find((index) => index !== changedIndex) : others.find((index) => result[index] >= -difference);
    if (target !== undefined) result[target] += difference;
  }
  return result;
}
