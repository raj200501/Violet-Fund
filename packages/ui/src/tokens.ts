export const colors = {
  violet: {
    25: "#fbfaff",
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95"
  },
  slate: {
    25: "#fcfcfd",
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5f5",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1f2937",
    900: "#0f172a"
  },
  graphite: {
    50: "#f7f8fb",
    100: "#eef1f6",
    200: "#d8dee8",
    300: "#b4becc",
    400: "#7d8795",
    500: "#57606f",
    600: "#3f4654",
    700: "#2b313d",
    800: "#1d212b",
    900: "#0f1219"
  },
  emerald: {
    50: "#ecfdf3",
    100: "#d1fae5",
    200: "#a7f3d0",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857"
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309"
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c"
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1"
  }
};

export const surfaces = {
  light: {
    base: "#ffffff",
    raised: "#fdfbff",
    sunken: "#f5f4fb",
    overlay: "#eef0f8",
    stroke: "#e2e8f0"
  },
  dark: {
    base: "#0b1120",
    raised: "#0f172a",
    sunken: "#111827",
    overlay: "#1f2937",
    stroke: "#1f2937"
  }
};

export const typography = {
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem"
  },
  lineHeights: {
    tight: "1.1",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.7"
  },
  tracking: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.02em"
  }
};

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "28px"
};

export const shadows = {
  soft: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
  medium: "0 8px 30px rgba(15, 23, 42, 0.12)",
  deep: "0 16px 40px rgba(15, 23, 42, 0.18)",
  glow: "0 0 0 1px rgba(139, 92, 246, 0.18), 0 12px 32px rgba(124, 58, 237, 0.2)"
};

export const gradients = {
  violet: "linear-gradient(135deg, rgba(237, 233, 254, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)",
  dark: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)",
  dusk: "linear-gradient(120deg, rgba(124, 58, 237, 0.15) 0%, rgba(14, 165, 233, 0.12) 100%)"
};

export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px"
};

export const motion = {
  fast: "150ms",
  medium: "200ms",
  slow: "250ms"
};

export const zIndices = {
  dropdown: 30,
  sticky: 40,
  overlay: 50,
  modal: 60,
  popover: 70,
  toast: 80
};
