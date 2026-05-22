const STORAGE_KEY = "lck.device-id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const next = `d_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  window.localStorage.setItem(STORAGE_KEY, next);
  return next;
}

export function getDisplayName(): string {
  if (typeof window === "undefined") return "익명";
  const stored = window.localStorage.getItem("lck.display-name");
  if (stored) return stored;
  const id = getDeviceId();
  const animals = ["고래", "여우", "수달", "다람쥐", "사슴", "토끼", "두루미", "오소리", "표범"];
  const tail = id.slice(-3);
  const pick = animals[parseInt(tail, 36) % animals.length];
  const name = `${pick}-${tail}`;
  window.localStorage.setItem("lck.display-name", name);
  return name;
}

export function setDisplayName(name: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("lck.display-name", name.trim().slice(0, 24));
}
