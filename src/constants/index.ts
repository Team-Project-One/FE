// 앱에서 사용되는 상수들을 정의하는 파일

export const COLORS = {
  // Primary colors
  primary: "#002E66",
  secondary: "#E0E0E0",

  // Background colors
  background: "#FEBEEC",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  gray: "#E0E0E0",

  // Text colors
  text: "#333333",
  textSecondary: "#666666",
  textLight: "#999999",

  // Border colors
  border: "#E0E0E0",
  borderDark: "#999999",

  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
} as const;

export const SIZES = {
  // Header & Navigation
  headerHeight: 60,
  bottomNavHeight: 60,

  // Button sizes
  buttonHeight: 90,
  buttonWidth: 200,
  buttonPaddingVertical: 15,
  buttonPaddingHorizontal: 30,

  // Border radius
  borderRadius: 5,
  borderRadiusMedium: 8,
  borderRadiusLarge: 12,

  // Font sizes
  fontSizeSmall: 12,
  fontSizeMedium: 14,
  fontSizeLarge: 16,
  fontSizeXLarge: 18,
  fontSizeXXLarge: 20,
  fontSizeTitle: 24,
} as const;

export const SPACING = {
  // Small spacing
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 40,

  // Component specific
  headerPadding: 20,
  contentPadding: 20,
  buttonGap: 10,
  navButtonGap: 40,
} as const;

export const LAYOUT = {
  // Safe area
  safeAreaTop: 10,
  safeAreaBottom: 20,

  // Component heights
  profileImageSize: 120,
  detailBoxHeight: 40,

  // Shadows
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
} as const;
