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
  const next = Math.max(0, Math.min(requestedValueCents, totalCents));
  const result = [...allocations];
  const oldValue = result[changedIndex];
  const delta = next - oldValue;

  if (delta === 0) return result;

  const otherIndexes = result
    .map((_, index) => index)
    .filter((index) => index !== changedIndex);

  if (delta > 0) {
    let remaining = delta;
    let eligible = otherIndexes.filter((index) => result[index] > 0);

    while (remaining > 0 && eligible.length > 0) {
      const baseShare = Math.floor(remaining / eligible.length);
      const remainder = remaining % eligible.length;
      let removedThisRound = 0;

      eligible.forEach((index, position) => {
        const desiredRemoval =
          baseShare + (position < remainder ? 1 : 0);
        const actualRemoval = Math.min(desiredRemoval, result[index]);
        result[index] -= actualRemoval;
        removedThisRound += actualRemoval;
      });

      if (removedThisRound === 0) break;
      remaining -= removedThisRound;
      eligible = eligible.filter((index) => result[index] > 0);
    }
  } else {
    const released = -delta;
    const baseShare = Math.floor(released / otherIndexes.length);
    const remainder = released % otherIndexes.length;

    otherIndexes.forEach((index, position) => {
      result[index] += baseShare + (position < remainder ? 1 : 0);
    });
  }

  result[changedIndex] = next;
  return result;
}
