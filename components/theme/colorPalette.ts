// Centralized color gradients and helpers for category cards
export type CategoryPalette = {
  id: string;
  gradient: string; // tailwind gradient classes (from-.. via-.. to-..)
  accent: string; // accent gradient for small elements
  glowClass?: string; // optional extra glow classes
};

export const CATEGORY_PALETTES: CategoryPalette[] = [
  {
    id: "violet-pink-blue",
    gradient: "from-purple-600 via-pink-600 to-blue-600",
    accent: "from-purple-500 to-pink-500",
    glowClass: "opacity-40",
  },
  {
    id: "pink-orange",
    gradient: "from-pink-500 to-orange-400",
    accent: "from-pink-400 to-orange-400",
    glowClass: "opacity-35",
  },
  {
    id: "teal-green",
    gradient: "from-teal-400 via-emerald-400 to-green-500",
    accent: "from-teal-400 to-green-400",
    glowClass: "opacity-30",
  },
  {
    id: "indigo-sky",
    gradient: "from-indigo-500 via-sky-400 to-cyan-400",
    accent: "from-indigo-500 to-sky-400",
    glowClass: "opacity-30",
  },
  {
    id: "rose-gold",
    gradient: "from-rose-500 via-amber-400 to-yellow-400",
    accent: "from-rose-500 to-amber-400",
    glowClass: "opacity-30",
  },
];

export function getPalette(index: number) {
  return CATEGORY_PALETTES[index % CATEGORY_PALETTES.length];
}
