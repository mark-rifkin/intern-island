import { useCallback, useEffect, useRef, useState } from "react";
import { AllocationScreen } from "./components/AllocationScreen";
import { AppreciationScreen } from "./components/AppreciationScreen";
import { CustomAmountModal } from "./components/CustomAmountModal";
import { DeclineScreen } from "./components/DeclineScreen";
import { ProcessingScreen } from "./components/ProcessingScreen";
import { TipSelectionScreen } from "./components/TipSelectionScreen";
import { interns, Intern } from "./data/interns";
import { shuffle } from "./utils/shuffle";
import { createEvenAllocation } from "./utils/allocation";

export type Screen = "tip-selection" | "allocation" | "processing" | "declined" | "appreciation";
const PRESET_TIPS = [200, 500, 1000, 2000, 100000];

export default function App() {
  const [screen, setScreen] = useState<Screen>("tip-selection");
  const [selectedTipCents, setSelectedTipCents] = useState<number | null>(null);
  const [allocations, setAllocations] = useState<number[]>([]);
  const [order, setOrder] = useState<Intern[]>([]);
  const [customOpen, setCustomOpen] = useState(false);
  const customButtonRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => { timers.current.forEach(window.clearTimeout); timers.current = []; }, []);
  const reset = useCallback(() => { clearTimers(); setScreen("tip-selection"); setSelectedTipCents(null); setAllocations([]); setOrder([]); setCustomOpen(false); }, [clearTimers]);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { const editable = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement; if (editable || event.ctrlKey || event.altKey || event.metaKey) return; if (event.key.toLowerCase() === "r") { event.preventDefault(); reset(); } if (event.key.toLowerCase() === "f") { event.preventDefault(); if (document.fullscreenElement) void document.exitFullscreen(); else void document.documentElement.requestFullscreen(); } }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [reset]);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const chooseTip = (cents: number) => setSelectedTipCents(cents);
  const continueToAllocation = () => { if (selectedTipCents === null) return; setOrder(shuffle(interns)); setAllocations(createEvenAllocation(selectedTipCents, interns.length)); setScreen("allocation"); };
  const pay = () => { if (selectedTipCents !== null) setScreen("processing"); };
  const afterProcessing = useCallback(() => setScreen("declined"), []);
  const appreciation = () => setScreen("appreciation");

  return <main className="app-shell">
    {screen === "tip-selection" && <TipSelectionScreen selectedTipCents={selectedTipCents} presetTips={PRESET_TIPS} onChoose={chooseTip} onCustom={(button) => { customButtonRef.current = button; setCustomOpen(true); }} onContinue={continueToAllocation} />}
    {screen === "allocation" && selectedTipCents !== null && <AllocationScreen totalCents={selectedTipCents} order={order} allocations={allocations} onChange={setAllocations} onPay={pay} />}
    {screen === "processing" && <ProcessingScreen onComplete={afterProcessing} />}
    {screen === "declined" && selectedTipCents !== null && <DeclineScreen totalCents={selectedTipCents} onTryAgain={reset} onAppreciate={appreciation} />}
    {screen === "appreciation" && <AppreciationScreen onReset={reset} />}
    {customOpen && <CustomAmountModal triggerRef={customButtonRef} initialSelected={selectedTipCents} onClose={() => { setCustomOpen(false); window.setTimeout(() => customButtonRef.current?.focus(), 0); }} onConfirm={(value) => { setSelectedTipCents(value); setCustomOpen(false); window.setTimeout(() => customButtonRef.current?.focus(), 0); }} />}
  </main>;
}
