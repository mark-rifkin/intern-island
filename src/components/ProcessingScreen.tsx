import { useEffect, useState } from "react";
import { createProcessingSequence } from "../data/processingMessages";

const durations = [700, 850, 850, 950, 1100] as const;

export function ProcessingScreen({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [messages] = useState(createProcessingSequence);

  useEffect(() => {
    const timer = index === messages.length - 1
      ? window.setTimeout(onComplete, durations[index])
      : window.setTimeout(() => setIndex((value) => value + 1), durations[index]);

    return () => window.clearTimeout(timer);
  }, [index, messages.length, onComplete]);

  return <section className="center-screen" aria-live="polite"><svg className="processing-spinner" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" /></svg><p className="processing-message">{messages[index]}</p></section>;
}
