/**
 * LaBouffe — Centralized Design Tokens
 * Tất cả màu sắc, spacing, border radius, font sizes được quản lý tại đây.
 * Import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme'
 */

import { Platform } from 'react-native';

// ─── Color Palette ───────────────────────────────────────────────
export const COLORS = {
  // Brand Colors
  primary: '#FF6332',
  primaryLight: '#FFEBE5',
  primaryDark: '#E95322',
  secondary: '#FFB01D',
  success: '#34A853',

  // Background
  background: '#FFFFFF',
  surface: '#F9F9F9',
  surfaceLight: '#FBFBFB',

  // Text
  textPrimary: '#333333',
  textSecondary: '#888888',
  textMuted: '#AFAFAF',
  textOnPrimary: '#FFFFFF',

  // Border
  border: '#F2F2F2',
  borderLight: '#F9F9F9',
  borderMedium: '#EEEEEE',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',

  // Utility
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.4)',
  heartRed: '#FF6332',

  // Social
  facebook: '#1877F2',
  google: '#DB4437',
};

// ─── Spacing ─────────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// ─── Border Radius ───────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 15,
  xl: 20,
  xxl: 25,
  pill: 30,
  round: 60,
  card: 15,
};

// ─── Font Sizes ──────────────────────────────────────────────────
export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 24,
  xxl: 32,
  title: 26,
  hero: 40,
};

// ─── Shadows ─────────────────────────────────────────────────────
export const SHADOWS = {
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeavy: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  modal: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
};

// ─── Platform Fonts (giữ lại từ bản gốc) ────────────────────────
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ─── Backward Compatible Theme Colors (used by use-theme-color.ts) ──
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
