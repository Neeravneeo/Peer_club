import craftTokensData from './craft-tokens.json';

export const craftTokens = craftTokensData;

export const craftColors = {
  canvas: craftTokensData.color.canvas.$value,
  ink: craftTokensData.color.ink.$value,
  white: craftTokensData.color.white.$value,
  linen: craftTokensData.color.linen.$value,
  cloud: craftTokensData.color.cloud.$value,
  ash: craftTokensData.color.ash.$value,
  stone: craftTokensData.color.stone.$value,
  graphite: craftTokensData.color.graphite.$value,
  mint: craftTokensData.color.mint.$value,
  marigold: craftTokensData.color.marigold.$value,
  periwinkle: craftTokensData.color.periwinkle.$value,
  sky: craftTokensData.color.sky.$value,
  papaya: craftTokensData.color.papaya.$value,
  azure: craftTokensData.color.azure.$value,
};

export const craftFonts = {
  serif: craftTokensData.font.untitledseriffont.$value,
  sans: craftTokensData.font.untitledsansfont.$value,
};

export const craftShadows = {
  xl: craftTokensData.shadow.xl.$value,
  sm: craftTokensData.shadow.sm.$value,
  md: craftTokensData.shadow.md.$value,
  md2: craftTokensData.shadow['md-2'].$value,
  subtle: craftTokensData.shadow.subtle.$value,
  md3: craftTokensData.shadow['md-3'].$value,
};

export const craftRadius = {
  md: craftTokensData.radius.md.$value,
  lg: craftTokensData.radius.lg.$value,
  xl: craftTokensData.radius.xl.$value,
  '2xl': craftTokensData.radius['2xl'].$value,
  '3xl': craftTokensData.radius['3xl'].$value,
  '3xl-2': craftTokensData.radius['3xl-2'].$value,
  pill: '9999px',
};

export default craftTokens;
