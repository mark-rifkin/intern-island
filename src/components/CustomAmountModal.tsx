import { useEffect, useRef, useState, type RefObject } from "react";
import { formatCurrency } from "../utils/currency";
import { positionToAmountCents, snapCustomAmountCents, CUSTOM_MAX_CENTS } from "../utils/sliderScale";

interface Props { triggerRef: RefObject<HTMLButtonElement | null>; initialSelected: number | null; onClose: () => void; onConfirm: (value: number) => void; }
export function CustomAmountModal({ triggerRef, initialSelected, onClose, onConfirm }: Props) {
  const [position, setPosition] = useState(1000);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const amount = snapCustomAmountCents(positionToAmountCents(position));
  useEffect(() => { closeRef.current?.focus(); const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); if (event.key === "Tab" && dialogRef.current) { const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, input"); const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="custom-title" ref={dialogRef}><button className="icon-button modal-close" aria-label="Close custom amount" ref={closeRef} onClick={onClose}>&#10005;</button><h2 id="custom-title">Choose a custom amount</h2><output className="custom-amount" aria-live="polite">{formatCurrency(amount)}</output><input className="custom-slider" aria-label="Custom tip amount" type="range" min="0" max="1000" step="1" value={position} onChange={(event) => setPosition(Number(event.target.value))} /><div className="scale-labels"><span>$0</span><span>$10</span><span>$100</span><span>$1K</span><span>$10K</span><span>$100K</span><span>$1M</span></div><button className="confirm-button" aria-label={`Confirm ${formatCurrency(amount)}`} onClick={() => onConfirm(amount)}>&#10003;</button></div></div>;
}
