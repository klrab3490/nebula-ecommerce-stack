// Centralized color gradients and helpers for category cards
export type CategoryPalette = {
  id: string;
  gradient: string; // tailwind gradient classes (from-.. via-.. to-..)
  accent: string; // accent gradient for small elements
  glowClass?: string; // optional extra glow classes
};

export const CATEGORY_PALETTES: CategoryPalette[] = [
  {
    id: "purple-pink-orange",
    gradient: "from-purple-600 via-pink-600 to-orange-500",
    accent: "from-purple-500 to-pink-500",
    glowClass: "opacity-30",
  },
  {
    id: "orange-rose-pink",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    accent: "from-orange-400 to-pink-500",
    glowClass: "opacity-35",
  },
  {
    id: "teal-emerald-cyan",
    gradient: "from-teal-500 via-emerald-500 to-cyan-500",
    accent: "from-teal-400 to-emerald-500",
    glowClass: "opacity-30",
  },
  {
    id: "indigo-purple-pink",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    accent: "from-indigo-500 to-purple-500",
    glowClass: "opacity-30",
  },
  {
    id: "amber-orange-red",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    accent: "from-amber-500 to-orange-500",
    glowClass: "opacity-30",
  },
];

export function getPalette(index: number) {
  return CATEGORY_PALETTES[index % CATEGORY_PALETTES.length];
}
