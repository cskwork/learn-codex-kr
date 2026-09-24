"use client";

import { useEffect, useState } from "react";
import { PROGRESS_EVENT, getLiveStreak, getProgress } from "./storage";

export type LocalProgress = {
  /** false until read from localStorage on the client (avoid hydration flashes). */
  ready: boolean;
  done: Set<string>;
  streak: number;
  best: number;
};

const INITIAL: LocalProgress = { ready: false, done: new Set(), streak: 0, best: 0 };

function read(): LocalProgress {
  const { current, best } = getLiveStreak();
  return { ready: true, done: new Set(getProgress().map((p) => p.slug)), streak: current, best };
}

/** Device-local lesson progress + streak, kept fresh across tabs and in-page updates. */
export function useProgress(): LocalProgress {
  const [state, setState] = useState<LocalProgress>(INITIAL);
  useEffect(() => {
    const refresh = () => setState(read());
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return state;
}
