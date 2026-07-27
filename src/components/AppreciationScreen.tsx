import { useEffect, useRef, useState } from "react";
import { getRandomAppreciationPhrase } from "../data/appreciationPhrases";

export function AppreciationScreen({ onReset }: { onReset: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [phrase] = useState(getRandomAppreciationPhrase);

  useEffect(() => {
    heading.current?.focus();
    const timer = window.setTimeout(onReset, 15000);
    return () => window.clearTimeout(timer);
  }, [onReset]);

  return <section className="center-screen appreciation-screen"><div className="appreciation-icon" aria-hidden="true">&#10003;</div><h1 tabIndex={-1} ref={heading}>Your appreciation is {phrase}.</h1></section>;
}
