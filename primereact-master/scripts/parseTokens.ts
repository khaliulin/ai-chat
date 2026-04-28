import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { hasTemplate, hexToRgb, replaceTemplate } from './utils.ts';
import type {
  ColorsCollectionsValue,
  ColorsCollection,
  DesignRecordType,
  DesignFontsUnionCollection,
  DesignScaleUnionCollection,
  DesignRootCollection,
  DesignCollection,
  DesignCollectionsValue,
} from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация путей
const PATHS = {
  INPUT_FILE_DIR: 'src/tokens',
  INPUT_PRIMITIVE_FILE: 'src/tokens/default.tokens.json',
  INPUT_THEME_LIGHT_FILE: 'src/tokens/light.tokens.json',
  INPUT_THEME_DARK_FILE: 'src/tokens/dark.tokens.json',
  OUTPUT_DIR: 'src/tokens',
  OUTPUT_PRIMITIVE_FILE: 'primitives.ts',
  OUTPUT_PRIMITIVE_SASS_FILE: '_primitives.scss',
  OUTPUT_SEMANTIC_SASS_FILE: '_semantic.scss',
  OUTPUT_THEME_SASS_FILE: '_theme.scss',
  OUTPUT_COMPONENTS_SASS_FILE: '_components.scss',
};

// для tailwind
const colorsCollection: Record<string, DesignRecordType<string>> = {};
const fontFamilyCollection: DesignRecordType<string> = {};
const fontWeightCollection: DesignRecordType<string> = {};
const fontSizeCollection: DesignRecordType<string> = {};
const lineHeightCollection: DesignRecordType<string> = {};
const borderRadiusCollection: DesignRecordType<string> = {};
const borderWidthCollection: DesignRecordType<string> = {};
const spacingCollection: DesignRecordType<string> = {};
const sizingCollection: DesignRecordType<string> = {};
const shadowsCollection: DesignRecordType<string> = {};
const transitionTimingFunctionCollection: DesignRecordType<string> = {};
const transitionDurationCollection: DesignRecordType<string> = {};
const opacityCollection: DesignRecordType<string> = {};

const themeLightColorsCollection: Record<string, DesignRecordType<string>> = {};
const themeDarkColorsCollection: Record<string, DesignRecordType<string>> = {};
const themeLightCollection: DesignRecordType<string> = {};
const themeDarkCollection: DesignRecordType<string> = {};

// алиасы для подставновки
const aliasCollection = new Map<string, string>();

type Options = {
  withAlpha?: boolean;
  alpha?: number;
};

async function convertPrimitiveTokens() {
  const primitiveFilePathStr = path.join(
    process.cwd(),
    PATHS.INPUT_PRIMITIVE_FILE
  );
  const primitiveFilePath = fs.existsSync(primitiveFilePathStr);

  if (!primitiveFilePath) {
    console.log(
      `    Не удалось найти файл с токенами-примитивами по пути: ${primitiveFilePathStr}\n` +
        `    Файл не будет преобразован. Проверьте, что файл существует.`
    );
  }

  try {
    console.log(`Входной файл: ${primitiveFilePathStr}`);

    const jsonContent = await fs.promises.readFile(
      primitiveFilePathStr,
      'utf8'
    );
    const jsonObject = JSON.parse(jsonContent);

    // цвета
    console.log('Начинаю преобразование токенов цвета');
    buildColors(jsonObject['colors'] || {}, 'alpha', {
      withAlpha: true,
    });
    buildColors(jsonObject['colors'] || {}, 'solid');
    console.log('Преобразование токенов цвета завершено');

    // шрифты
    console.log('Начинаю преобразование токенов шрифтов');
    buildFontsCollections(jsonObject['fonts'] || {}, 'fontFamily');
    buildFontsCollections(jsonObject['fonts'] || {}, 'fontWeight');
    buildFontsCollections(jsonObject['fonts'] || {}, 'fontSize');
    buildFontsCollections(jsonObject['fonts'] || {}, 'lineHeight');
    console.log('Преобразование токенов шрифтов завершено');

    // размеры, тени, transition и opacity и т.п.
    console.log(
      'Начинаю преобразование токенов радиусов, отступов, размеров, shadows, transition и opacity'
    );
    buildDesignScaleCollections(jsonObject || {}, 'borderRadius');
    buildDesignScaleCollections(jsonObject || {}, 'borderWidth');
    buildDesignScaleCollections(jsonObject || {}, 'spacing');
    buildDesignScaleCollections(jsonObject || {}, 'sizing');
    buildShadows(jsonObject['shadows'] || {});
    buildTransitionTimingFunction(jsonObject['transition']?.['easing'] || {});
    buildTransitionDurations(jsonObject['transition']?.['duration'] || {});
    buildDesignScaleCollections(jsonObject || {}, 'opacity');
    console.log(
      'Преобразование токенов радиусов, отступов, размеров, shadows, transition и opacity завершено'
    );

    console.log(`Токены-примитивы успешно преобразованы!`);

    return {
      success: true,
      primitiveFilePathStr,
    };
  } catch (error) {
    console.error(`Ошибка преобразования: ${primitiveFilePathStr}`);
    console.error((error as Error).message);

    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

async function convertThemeTokens() {
  const themeLightFilePathStr = path.join(
    process.cwd(),
    PATHS.INPUT_THEME_LIGHT_FILE
  );
  const themeDarkFilePathStr = path.join(
    process.cwd(),
    PATHS.INPUT_THEME_DARK_FILE
  );
  const themeLightFilePath = fs.existsSync(themeLightFilePathStr);
  const themeDarkFilePath = fs.existsSync(themeDarkFilePathStr);

  if (!themeLightFilePath && !themeDarkFilePath) {
    console.log(
      `    Не удалось найти файлы с токенами темы по пути: ${themeLightFilePathStr} и ${themeDarkFilePathStr}\n` +
        `    Файлы не будут преобразованы. Проверьте, что файлы существуют.`
    );
  }

  try {
    console.log(`Входной файл: ${themeLightFilePathStr}`);

    const jsonLightContent = await fs.promises.readFile(
      themeLightFilePathStr,
      'utf8'
    );
    const jsonLightObject = JSON.parse(jsonLightContent);

    console.log(`Входной файл: ${themeDarkFilePathStr}`);

    const jsonDarkContent = await fs.promises.readFile(
      themeDarkFilePathStr,
      'utf8'
    );
    const jsonDarkObject = JSON.parse(jsonDarkContent);

    // цвета
    console.log('Начинаю преобразование токенов темы');
    buildThemeColors(jsonLightObject || {}, 'success', 'light');
    buildThemeColors(jsonLightObject || {}, 'info', 'light');
    buildThemeColors(jsonLightObject || {}, 'warn', 'light');
    buildThemeColors(jsonLightObject || {}, 'help', 'light');
    buildThemeColors(jsonLightObject || {}, 'error', 'light');
    buildThemeColors(jsonLightObject || {}, 'surface', 'light');
    buildThemeColors(jsonLightObject || {}, 'primary', 'light');
    buildThemeColors(jsonLightObject || {}, 'highlight', 'light');
    buildFocusRing(jsonLightObject['focusRing'] || {}, 'light');
    buildThemeColors(jsonLightObject || {}, 'mask', 'light');
    buildThemeColors(jsonLightObject || {}, 'form', 'light');
    buildThemeColors(jsonLightObject || {}, 'text', 'light');
    buildThemeColors(jsonLightObject['text'] || {}, 'extend', 'light', {
      textExtend: true,
    });
    buildThemeColors(jsonLightObject || {}, 'content', 'light');

    buildThemeColors(jsonDarkObject || {}, 'success', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'info', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'warn', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'help', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'error', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'surface', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'primary', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'highlight', 'dark');
    buildFocusRing(jsonDarkObject['focusRing'] || {}, 'dark');
    buildThemeColors(jsonDarkObject || {}, 'mask', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'form', 'dark');
    buildThemeColors(jsonDarkObject || {}, 'text', 'dark');
    buildThemeColors(jsonDarkObject['text'] || {}, 'extend', 'dark', {
      textExtend: true,
    });
    buildThemeColors(jsonDarkObject || {}, 'content', 'dark');

    buildTransparentColor(jsonLightObject['transparent'] || {}, 'light');
    buildTransparentColor(jsonDarkObject['transparent'] || {}, 'dark');

    console.log('Преобразование токенов темы завершено');

    console.log(`Токены-примитивы успешно преобразованы!`);

    return {
      success: true,
      themeLightFilePathStr,
      themeDarkFilePathStr,
    };
  } catch (error) {
    console.error(`Ошибка преобразования файлов темы:`);
    console.error((error as Error).message);

    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

async function main() {
  console.log('Начинаю поиск файлов с токенами...');

  try {
    const primitiveResult = await convertPrimitiveTokens();

    if (!primitiveResult.success) {
      console.log(
        'Возникла ошибка при преобразовании токенов-примитивов. Прекращаю дальнейшее выполнение.'
      );
      process.exit(1);
    }

    const themeResult = await convertThemeTokens();

    if (!themeResult.success) {
      console.log('Возникла ошибка при преобразовании токенов темы.');
      // process.exit(1);
    }

    await fs.promises.mkdir(PATHS.OUTPUT_DIR, { recursive: true });

    // ts-файл
    const outputPath = path.join(PATHS.OUTPUT_DIR, PATHS.OUTPUT_PRIMITIVE_FILE);

    await fs.promises.writeFile(
      outputPath,
      generateTokensFileContent(),
      'utf8'
    );

    // sass-файл
    const sassPrimitiveOutputPath = path.join(
      PATHS.OUTPUT_DIR,
      PATHS.OUTPUT_PRIMITIVE_SASS_FILE
    );
    await fs.promises.writeFile(
      sassPrimitiveOutputPath,
      generateRootSassFileContent(),
      'utf8'
    );

    const sassThemeOutputPath = path.join(
      PATHS.OUTPUT_DIR,
      PATHS.OUTPUT_THEME_SASS_FILE
    );
    await fs.promises.writeFile(
      sassThemeOutputPath,
      generateThemeSassFileContent(),
      'utf8'
    );

    console.log(`Выходной TS-файл: ${outputPath}`);
    console.log(`Выходной SASS-файл с примитивами: ${sassPrimitiveOutputPath}`);
    console.log(`Выходной SASS-файл с темой: ${sassThemeOutputPath}`);
  } catch (error) {
    console.error((error as Error).message);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

// Запуск из командной строки
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

function buildColors(
  colors: ColorsCollection,
  collectionKey: 'alpha' | 'solid',
  options: Options = {
    withAlpha: false,
  }
) {
  Object.entries(colors[collectionKey]).forEach(([colorName, colorValue]) => {
    colorsCollection[`${colorName}`] = {};
    Object.entries(colorValue).forEach(([graduate, value]) => {
      const aliasName = `colors/${collectionKey}/${colorName}/${graduate}`;
      const val = value as ColorsCollectionsValue;

      const result = hexToRgb(val.$value.hex, {
        alpha: val.$value.alpha,
        format: 'css',
        withAlpha: options.withAlpha,
        precision: 2,
      }) as string;

      colorsCollection[`${colorName}`][`${graduate}`] = result;

      if (!aliasCollection.has(aliasName)) {
        aliasCollection.set(aliasName, `var(--${colorName}-${graduate})`);
      }
    });
  });
}

function buildDesignScaleCollections(
  designScale: DesignRootCollection,
  collectionName: DesignScaleUnionCollection
) {
  Object.entries(designScale[collectionName]).forEach(([graduate, value]) => {
    const aliasName = `${collectionName}/${graduate}`;

    if (collectionName === 'borderRadius') {
      borderRadiusCollection[`${graduate}`] =
        value.$value === 0 ? '0' : `${value.$value}px`;
    }

    if (collectionName === 'borderWidth') {
      borderWidthCollection[`${graduate}`] =
        value.$value === 0 ? '0' : `${value.$value}px`;
    }

    if (collectionName === 'spacing') {
      spacingCollection[`${graduate}`] =
        value.$value === 0 ? '0' : `${value.$value}px`;
    }

    if (collectionName === 'sizing') {
      let sizingValue: string | number = '';

      if (typeof value.$value === 'string') {
        sizingValue = value.$value;
      } else {
        sizingValue = value.$value === 0 ? '0' : `${value.$value}px`;
      }

      sizingCollection[`${graduate}`] = sizingValue;
    }

    if (collectionName === 'opacity') {
      opacityCollection[`${graduate}`] = String(value.$value);
    }

    if (!aliasCollection.has(aliasName)) {
      aliasCollection.set(aliasName, `var(--${collectionName}-${graduate})`);
    }
  });
}

function buildFontsCollections(
  designScale: DesignRootCollection,
  collectionName: DesignFontsUnionCollection
) {
  Object.entries(designScale[collectionName]).forEach(([graduate, value]) => {
    const aliasName = `fonts/${collectionName}/${graduate}`;

    if (collectionName === 'fontFamily') {
      fontFamilyCollection[`${graduate}`] =
        `'${value.$value}', Roboto, Inter, Helvetica, Arial, sans-serif`;

      if (graduate === 'heading') {
        fontFamilyCollection['primary'] = `var(--fontFamily-heading)`;
      }

      if (graduate === 'base') {
        fontFamilyCollection['secondary'] = `var(--fontFamily-base)`;
      }
    }

    if (collectionName === 'fontWeight') {
      fontWeightCollection[`${graduate}`] = String(value.$value);
    }

    if (collectionName === 'fontSize') {
      fontSizeCollection[`${graduate}`] =
        value.$value === 0 ? '0' : `${value.$value}px`;
    }

    if (collectionName === 'lineHeight') {
      lineHeightCollection[`${graduate}`] =
        typeof value.$value === 'string' ? value.$value : `${value.$value}px`;
    }

    if (!aliasCollection.has(aliasName)) {
      aliasCollection.set(aliasName, `var(--${collectionName}-${graduate})`);
    }
  });
}

function buildShadows(designScale: DesignCollection) {
  Object.entries(designScale).forEach(([graduate, value]) => {
    const aliasName = `shadows/${graduate}`;

    shadowsCollection[`${graduate}`] = replaceTemplate(
      String(value.$value),
      aliasCollection
    );

    if (!aliasCollection.has(aliasName)) {
      aliasCollection.set(aliasName, `var(--shadow-${graduate})`);
    }
  });
}

function buildTransitionTimingFunction(designScale: DesignCollection) {
  Object.entries(designScale).forEach(([graduate, value]) => {
    const aliasName = `transition/easing/${graduate}`;

    transitionTimingFunctionCollection[`${graduate}`] = String(value.$value);

    if (!aliasCollection.has(aliasName)) {
      aliasCollection.set(aliasName, `var(--transition-easing-${graduate})`);
    }
  });
}

function buildTransitionDurations(designScale: DesignCollection) {
  Object.entries(designScale).forEach(([graduate, value]) => {
    const aliasName = `transition/duration/${graduate}`;

    transitionDurationCollection[`${graduate}`] = String(value.$value);

    if (!aliasCollection.has(aliasName)) {
      aliasCollection.set(aliasName, `var(--transition-duration-${graduate})`);
    }
  });
}

function buildTransparentColor(
  designScale: ColorsCollectionsValue,
  theme: 'light' | 'dark'
) {
  const aliasName = `transparent`;

  if (theme === 'light') {
    themeLightCollection[`${aliasName}`] = hexToRgb(designScale.$value.hex, {
      alpha: designScale.$value.alpha,
      format: 'css',
      withAlpha: true,
      precision: 4,
    }) as string;
  }

  if (theme === 'dark') {
    themeDarkCollection[`${aliasName}`] = hexToRgb(designScale.$value.hex, {
      alpha: designScale.$value.alpha,
      format: 'css',
      withAlpha: true,
      precision: 4,
    }) as string;
  }

  if (!aliasCollection.has(aliasName)) {
    aliasCollection.set(aliasName, `var(--${aliasName})`);
  }
}

function buildThemeColors(
  designScale: DesignRootCollection,
  collectionName: string,
  theme: 'light' | 'dark',
  options?: {
    textExtend?: boolean;
  }
) {
  Object.entries(designScale[collectionName]).forEach(([graduate, value]) => {
    if (graduate === 'extend') {
      return;
    }
    const isExtensions = '$extensions' in value ? value.$extensions : null;
    const haveAlias =
      isExtensions && 'com.figma.aliasData' in value.$extensions;
    const aliasData = value.$extensions['com.figma.aliasData'];

    if (
      haveAlias &&
      typeof aliasData === 'object' &&
      aliasData != null &&
      'targetVariableName' in aliasData
    ) {
      const aliasName = `${options?.textExtend ? 'text/' : ''}${collectionName}/${graduate}`;

      if (theme === 'light') {
        themeLightColorsCollection[
          `${options?.textExtend ? 'text/' : ''}${collectionName}`
        ] =
          themeLightColorsCollection[
            `${options?.textExtend ? 'text/' : ''}${collectionName}`
          ] || {};

        themeLightColorsCollection[
          `${options?.textExtend ? 'text/' : ''}${collectionName}`
        ][`${graduate}`] = String(
          aliasCollection.get(aliasData.targetVariableName) || ''
        );
      }

      if (theme === 'dark') {
        themeDarkColorsCollection[
          `${options?.textExtend ? 'text/' : ''}${collectionName}`
        ] =
          themeDarkColorsCollection[
            `${options?.textExtend ? 'text/' : ''}${collectionName}`
          ] || {};

        themeDarkColorsCollection[
          `${options?.textExtend ? 'text/' : ''}${collectionName}`
        ][`${graduate}`] = String(
          aliasCollection.get(aliasData.targetVariableName) || ''
        );
      }

      if (!aliasCollection.has(aliasName)) {
        aliasCollection.set(
          aliasName,
          `var(--${options?.textExtend ? 'text-' : ''}${collectionName}-${graduate})`
        );
      }
    }

    if (!haveAlias && hasTemplate(value.$value)) {
      const aliasName = `${options?.textExtend ? 'text/' : ''}${collectionName}/${graduate}`;

      if (theme === 'light') {
        themeLightColorsCollection[`${collectionName}`] =
          themeLightColorsCollection[`${collectionName}`] || {};

        themeLightColorsCollection[`${collectionName}`][`${graduate}`] =
          replaceTemplate(String(value.$value), aliasCollection);
      }

      if (theme === 'dark') {
        themeDarkColorsCollection[`${collectionName}`] =
          themeDarkColorsCollection[`${collectionName}`] || {};

        themeDarkColorsCollection[`${collectionName}`][`${graduate}`] =
          replaceTemplate(String(value.$value), aliasCollection);
      }

      if (!aliasCollection.has(aliasName)) {
        aliasCollection.set(aliasName, `var(--${collectionName}-${graduate})`);
      }
    }
  });
}

function buildFocusRing(
  designScale: DesignRootCollection,
  theme: 'light' | 'dark'
) {
  Object.entries(designScale).forEach(([k, value]) => {
    if (k === 'shadow') {
      const col = designScale[k] as unknown as DesignCollectionsValue;
      const isExtensions = '$extensions' in col ? col.$extensions : null;
      const haveAlias =
        isExtensions && 'com.figma.aliasData' in col.$extensions;
      const aliasData = col.$extensions['com.figma.aliasData'];

      if (
        haveAlias &&
        typeof aliasData === 'object' &&
        aliasData != null &&
        'targetVariableName' in aliasData
      ) {
        if (theme === 'light') {
          themeLightCollection[`focusRing-${k}`] = String(
            aliasCollection.get(aliasData.targetVariableName) || ''
          );
        }

        if (theme === 'dark') {
          themeDarkCollection[`focusRing-${k}`] = String(
            aliasCollection.get(aliasData.targetVariableName) || ''
          );
        }
      }
    }

    if (k === 'extend') {
      Object.entries(designScale[k]).forEach(([graduate, val]) => {
        const isExtensions = '$extensions' in val ? val.$extensions : null;
        const haveAlias =
          isExtensions && 'com.figma.aliasData' in val.$extensions;
        const aliasData = val.$extensions['com.figma.aliasData'];
        const aliasName = `focusRing-${k}-${graduate}`;

        if (
          haveAlias &&
          typeof aliasData === 'object' &&
          aliasData != null &&
          'targetVariableName' in aliasData
        ) {
          if (theme === 'light') {
            themeLightCollection[aliasName] = String(
              aliasCollection.get(aliasData.targetVariableName) || ''
            );
          }

          if (theme === 'dark') {
            themeDarkCollection[aliasName] = String(
              aliasCollection.get(aliasData.targetVariableName) || ''
            );
          }
        }
      });
    }
  });
}

function generateTokensFileContent() {
  // Генерация содержимого TS-файла
  let tsContent = `// ============================================\n`;
  tsContent += `// Design Tokens\n`;
  tsContent += `// Auto-generated from: ${path.join(PATHS.INPUT_PRIMITIVE_FILE)}\n`;
  tsContent += `// Generated at: ${new Date().toISOString()}\n`;
  tsContent += `// Do not edit this file manually!\n`;
  tsContent += `// ============================================\n`;
  tsContent += `\n`;

  tsContent += `// Примитивы\n`;
  tsContent += `export const colors = ${JSON.stringify(colorsCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const fontFamily = ${JSON.stringify(fontFamilyCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const fontWeight = ${JSON.stringify(fontWeightCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const fontSize = ${JSON.stringify(fontSizeCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const lineHeight = ${JSON.stringify(lineHeightCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const borderRadius = ${JSON.stringify(borderRadiusCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const borderWidth = ${JSON.stringify(borderWidthCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const spacing = ${JSON.stringify(spacingCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const sizing = ${JSON.stringify(sizingCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const boxShadow = ${JSON.stringify(shadowsCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const transitionTimingFunction = ${JSON.stringify(transitionTimingFunctionCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const transitionDuration = ${JSON.stringify(transitionDurationCollection, null, 2)};\n`;
  tsContent += `\n`;

  tsContent += `export const opacity = ${JSON.stringify(opacityCollection, null, 2)};\n`;
  tsContent += `\n`;

  // tsContent += `export const themeLight = ${JSON.stringify(themeLightColorsCollection, null, 2)};\n`;
  // tsContent += `\n`;

  // tsContent += `export const themeDark = ${JSON.stringify(themeDarkColorsCollection, null, 2)};\n`;
  // tsContent += `\n`;

  // tsContent += `export const themeLightCollection = ${JSON.stringify(themeLightCollection, null, 2)};\n`;
  // tsContent += `\n`;

  // tsContent += `export const themeDarkCollection = ${JSON.stringify(themeDarkCollection, null, 2)};\n`;
  // tsContent += `\n`;

  tsContent += `// Алиасы\n`;
  tsContent += `const aliases = ${JSON.stringify(Object.fromEntries(aliasCollection), null, 2)};\n`;
  tsContent += `\n`;

  return tsContent;
}

function generateRootSassFileContent() {
  let content = `// ============================================\n`;
  content += `// Design Tokens\n`;
  content += `// Auto-generated from: ${path.join(PATHS.INPUT_PRIMITIVE_FILE)}\n`;
  content += `// Generated at: ${new Date().toISOString()}\n`;
  content += `// Do not edit this file manually!\n`;
  content += `// ============================================\n`;
  content += `\n`;

  content += `// Примитивы\n`;
  content += `:root {\n`;
  // цвета
  Object.entries(colorsCollection).forEach(([colorName, colorValue]) => {
    Object.entries(colorValue).forEach(([graduate, value]) => {
      const variableName = `--${colorName}-${graduate}`;
      content += `  ${variableName}: ${value};\n`;
    });
  });
  content += `\n`;

  // fontFamily
  Object.entries(fontFamilyCollection).forEach(([graduate, value]) => {
    const variableName = `--fontFamily-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // fontWeight
  Object.entries(fontWeightCollection).forEach(([graduate, value]) => {
    const variableName = `--fontWeight-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // fontSize
  Object.entries(fontSizeCollection).forEach(([graduate, value]) => {
    const variableName = `--fontSize-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // lineHeight
  Object.entries(lineHeightCollection).forEach(([graduate, value]) => {
    const variableName = `--lineHeight-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // borderRadius
  Object.entries(borderRadiusCollection).forEach(([graduate, value]) => {
    const variableName = `--borderRadius-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // borderWidth
  Object.entries(borderWidthCollection).forEach(([graduate, value]) => {
    const variableName = `--borderWidth-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // spacing
  Object.entries(spacingCollection).forEach(([graduate, value]) => {
    const variableName = `--spacing-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // sizing
  Object.entries(sizingCollection).forEach(([graduate, value]) => {
    const variableName = `--sizing-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // shadows
  Object.entries(shadowsCollection).forEach(([graduate, value]) => {
    const variableName = `--shadow-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // transition timing function
  Object.entries(transitionTimingFunctionCollection).forEach(
    ([graduate, value]) => {
      const variableName = `--transition-easing-${graduate}`;
      content += `  ${variableName}: ${value};\n`;
    }
  );
  content += `\n`;

  // transition durations
  Object.entries(transitionDurationCollection).forEach(([graduate, value]) => {
    const variableName = `--transition-duration-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });
  content += `\n`;

  // opacity
  Object.entries(opacityCollection).forEach(([graduate, value]) => {
    const variableName = `--opacity-${graduate}`;
    content += `  ${variableName}: ${value};\n`;
  });

  content += `}\n`;

  return content;
}

function generateThemeSassFileContent() {
  let content = `// ============================================\n`;
  content += `// Design Tokens\n`;
  content += `// Auto-generated from: ${path.join(PATHS.INPUT_THEME_LIGHT_FILE)}\n`;
  content += `// Generated at: ${new Date().toISOString()}\n`;
  content += `// Do not edit this file manually!\n`;
  content += `// ============================================\n`;
  content += `\n`;

  content += `// Темы\n`;
  content += `:root {\n`;
  Object.entries(themeLightCollection).forEach(([graduate, value]) => {
    content += `  --${graduate}: ${value};\n`;
  });
  // доп.цвета
  Object.entries(themeLightColorsCollection).forEach(
    ([colorName, colorValue]) => {
      Object.entries(colorValue).forEach(([graduate, value]) => {
        const variableName = `--${colorName === 'text/extend' ? colorName.replace('/', '-') : colorName}-${graduate}`;
        content += `  ${variableName}: ${value};\n`;
      });
    }
  );
  content += `}\n\n`;

  content += `:root[data-theme="dark"] {\n`;
  Object.entries(themeDarkCollection).forEach(([graduate, value]) => {
    content += `  --${graduate}: ${value};\n`;
  });
  // доп.цвета для темной темы
  Object.entries(themeDarkColorsCollection).forEach(
    ([colorName, colorValue]) => {
      Object.entries(colorValue).forEach(([graduate, value]) => {
        const variableName = `--${colorName === 'text/extend' ? colorName.replace('/', '-') : colorName}-${graduate}`;
        content += `  ${variableName}: ${value};\n`;
      });
    }
  );
  content += `}\n`;

  return content;
}
