export const colors = {
  // neutrals
  black: {
    base: "#121212",
    opacity50: "rgba(18,18,18,0.5)",
  },
  white: {
    base: "#FFFFFF",
    opacity10: "rgba(255,255,255,0.1)",
    opacity20: "rgba(255,255,255,0.2)",
  },
  gray: {
    100: "#262626",
    200: "#393939",
    300: "#525252",
    400: "#6F6F6F",
    500: "#8D8D8D",
    600: "#A8A8A8",
    700: "#C6C6C6",
    800: "#E0E0E0",
    900: "#F4F4F4",
  },
  pink: {
    50: "#FDF2F8",
    100: "#FCE7F3",
    200: "#FBCFE8",
    300: "#F9A8D4",
    400: "#F472B6",
    500: "#EC4899",
    600: "#DB2777",
    700: "#BE185D",
  },
  rose: {
    100: "#FFE4E6",
    200: "#FECDD3",
    300: "#FDA4AF",
    400: "#FB7185",
    500: "#F43F5E",
  },
} as const;

export type FontWeightPreset = "Regular" | "Medium" | "Bold";

const getLineHeight = (fontSize: number, ratio: number) =>
  Math.round(fontSize * ratio);

const getLetterSpacing = (fontSize: number, ratio: number) =>
  fontSize * ratio; // RN expects absolute px

export const typography = {
  title20b: {
    fontSize: 20,
    lineHeight: getLineHeight(20, 1.4),
    letterSpacing: getLetterSpacing(20, -0.025),
    fontWeight: "700" as const,
  },
  body24b: {
    fontSize: 24,
    lineHeight: getLineHeight(24, 1.5),
    letterSpacing: getLetterSpacing(24, -0.025),
    fontWeight: "700" as const,
  },
  body20b: {
    fontSize: 20,
    lineHeight: getLineHeight(20, 1.5),
    letterSpacing: getLetterSpacing(20, -0.025),
    fontWeight: "700" as const,
  },
  body18r: {
    fontSize: 18,
    lineHeight: getLineHeight(18, 1.5),
    letterSpacing: getLetterSpacing(18, -0.025),
    fontWeight: "400" as const,
  },
  body16r: {
    fontSize: 16,
    lineHeight: getLineHeight(16, 1.5),
    letterSpacing: getLetterSpacing(16, -0.025),
    fontWeight: "400" as const,
  },
  caption14r: {
    fontSize: 14,
    lineHeight: getLineHeight(14, 1.4),
    letterSpacing: getLetterSpacing(14, -0.025),
    fontWeight: "400" as const,
    color: colors.gray[600],
  },
} as const;


