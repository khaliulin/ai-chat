type Options = {
  format?: 'array' | 'css' | 'object';
  withAlpha?: boolean;
  alpha?: number;
  precision?: number;
};
/**
 * Converts hex color to rgb. Calculates corresponding foreground.
 *
 * @param {string} hex - The hex color to be converted. Can be 3 or 6 HEX-ONLY chars.
 *
 * Optional options object:
 * @param {number} alpha - Alpha channel value between 0 and 1. Overrides alpha from hex if provided.
 * @param {boolean} withAlpha - Add alpha channel to the output.
 * @param {string} format - Can be 'array', 'css' or 'object'.
 *
 * @return {array} rgb - [x,x,x].
 * @return {array} rgba - [x,x,x,x].
 * @return {string} rgbString - rgb(x,x,x).
 * @return {string} rgbaString - rgba(x,x,x).
 * @return {string} rgbObject - {red: x, green: x, blue: x}.
 * @return {string} rgbaObject - {red: x, green: x, blue: x, alpha: x}.
 */
export function hexToRgb(
  hex: string,
  options: Options = {
    format: 'object',
    withAlpha: false,
    alpha: 1,
    precision: 2,
  }
):
  | number[]
  | string
  | { red: number; green: number; blue: number; alpha?: number } {
  // считаем что на вход в hex приходит валидный формат, поэтому не обрабатываем ошибки

  hex = hex.replace(/^#/, '');
  let alphaFromHex = 1;

  if (hex.length === 8) {
    alphaFromHex = Number.parseInt(hex.slice(6, 8), 16) / 255;
    hex = hex.slice(0, 6);
  }

  if (hex.length === 4) {
    alphaFromHex = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255;
    hex = hex.slice(0, 3);
  }

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const number = Number.parseInt(hex, 16);
  const red = number >> 16;
  const green = (number >> 8) & 255;
  const blue = number & 255;
  const alpha =
    typeof options.alpha === 'number' ? options.alpha : alphaFromHex;

  if (options.format === 'array') {
    if (options.withAlpha) {
      return [red, green, blue, alpha];
    }

    return [red, green, blue];
  }

  if (options.format === 'css') {
    if (!options.withAlpha) {
      return `rgb(${red}, ${green}, ${blue})`;
    }

    const alphaString =
      alpha === 1 ? '1' : `${Number(alpha.toFixed(options.precision))}`;
    return `rgba(${red}, ${green}, ${blue}, ${alphaString})`;
  }

  if (options.withAlpha) {
    return { red, green, blue, alpha };
  }

  return { red, green, blue };
}

export function hasTemplate(value: any): boolean {
  if (typeof value !== 'string') return false;
  return /\{([^}]+)\}/.test(value);
}

export function replaceTemplate(
  str: string,
  aliases: Map<string, string>
): string {
  return str.replace(/\{([^}]+)\}/g, (match, path) => {
    const key = path.replace(/\./g, '/');
    const value = aliases.has(key) ? aliases.get(key) : undefined;

    if (value === undefined) {
      console.warn(`Alias not found for key: ${key}`);
      return match; // Возвращаем исходное выражение
    }

    return value;
  });
}
