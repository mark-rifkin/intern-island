export function getDeclineMessage(selectedTipCents: number): string {
  return selectedTipCents > 5000 ? "Tip amount exceeds the approved intern appreciation budget." : "Your payment could not be authorized.";
}
