# @cdek/primereact

Добро пожаловать в Storybook. Здесь приведены примеры компонентов React на основе библиотеки primereact и хуков, которые могут быть полезны в наших проектах. Подробную документацию по компонентам можно найти в <a href="https://primereact.org/" target="_blank">документации primereact</a>.

## Установка

1.  Установите пакет:

    ```bash
    npm install @cdek/primereact
    ```

2.  Импортируйте тему в SCSS-файл вашего проекта:
    ```scss
    @use '@cdek/primereact/dist/style.scss';
    ```

В вашем проекте должны быть установлены следующие зависимости с минимальными версиями, указанными ниже:

```json
{
  "@cdek-it/typography": "^3.0.0",
  "@tabler/icons-react": "^3.34.0",
  "primereact": "^10.9.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@types/react": "^19.0.0", // опционально
  "@types/react-dom": "^19.0.4" // опционально
}
```

### Совместимость с браузерами

Для совместимости со старыми браузерами, которые не поддерживают `@layer`, необходимо заменить его на другой синтаксис. Это можно сделать с помощью `vite-plugin-string-replace`.

1.  Установите плагин:

    ```bash
    npm install -D vite-plugin-string-replace
    ```

2.  Добавьте плагин в ваш `vite.config.ts`:

    ```ts
    import { defineConfig } from 'vite';
    import StringReplace from 'vite-plugin-string-replace';

    export default defineConfig({
      // ...
      plugins: [
        //...
        StringReplace([
          {
            search: '@layer primereact {',
            replace: '@media screen {',
          },
        ]),
        //...
      ],
    });
    ```

## Иконки

В дизайн-системе в основном используются иконки из [Tabler Icons](https://tabler.io/icons/). Начиная с версии `1.1.0`, иконки не входят в пакет и должны подключаться отдельно.

Существует три способа подключения иконок:

- Как шрифт
- Как SVG-компоненты
- С CDN

### 1. Иконки как шрифт

Этот метод включает установку пакета `@tabler/icons-webfont`.

1.  Установите пакет:

    ```bash
    npm install @tabler/icons-webfont
    ```

2.  Импортируйте шрифт в SCSS:
    ```scss
    @import '@tabler/icons-webfont/dist/tabler-icons.min.css';
    ```

> **Предупреждение:**
> При подключении иконок в виде шрифта вы включаете большое количество иконок (более 6000), что может значительно увеличить размер сборки и время загрузки. Во время загрузки шрифта иконки могут отображаться в виде квадратов. Для лучшей производительности рекомендуется использовать иконки SVG или CDN.

### 2. Иконки как SVG

Этот метод позволяет включать в проект только те иконки, которые используются, что лучше для производительности.

1.  Установите пакет:

    ```bash
    npm install @tabler/icons-react
    ```

2.  Если вы используете Vite, добавьте псевдоним в `vite.config.ts`, чтобы избежать медленной начальной загрузки в режиме разработки:
    ```ts
    //...
      resolve: {
        alias: {
          //...
          '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
        },
      },
    //...
    ```
    Для получения дополнительной информации см. эту [ветку Stack Overflow](https://stackoverflow.com/questions/79194970/tabler-icons-for-react-slowing-down-app-on-initial-load).

#### Размеры иконок

Если вы не используете Tailwind CSS, вы можете импортировать утилитарные стили для иконок:

```scss
@use '@cdek/primereact/dist/utils/icons.scss';
```

Это позволит вам использовать классы дизайн-системы, такие как `icon-2xl` вместо `text-2xl`.

Если вы используете Tailwind CSS, см. конфигурацию ниже.

### 3. Иконки с CDN

Вы можете подключить иконки, добавив следующие ссылки в ваш `index.html`. Пожалуйста, уточните у фронтенд-гильдии последнюю версию.

```html
<link rel="preconnect" href="https://public-static.cdek.ru" />
<link
  rel="stylesheet"
  href="https://public-static.cdek.ru/common/icons/v3.30.0/tabler-icons.min.css"
/>
```

## Миксины

Если вы используете SCSS, вы можете импортировать миксины из пакета и использовать их в своих стилях:

```scss
@use '@cdek/primereact/dist/utils/mixins.scss' as *;
```

## Интеграция с Tailwind CSS

Эта тема совместима с Tailwind CSS v3.

1.  Установите необходимые зависимости:

    ```bash
    npm install -D tailwindcss@^3.0.0 postcss autoprefixer
    ```

2.  Настройте ваш `tailwind.config.js`:

    ```ts
    /** @type {import('tailwindcss').Config} */
    import {
      iconsPluginCallback,
      screens,
      themeExtend,
    } from '@cdek/primereact/tailwind-config';
    import plugin from 'tailwindcss/plugin';

    export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        screens,
        extend: {
          // содержит все расширения темы для дизайн-системы
          ...themeExtend,
        },
      },
      plugins: [
        // Плагин для использования классов размеров иконок, таких как icon-2xl, icon-[111px], md:icon-3xl
        plugin(iconsPluginCallback),
      ],
    };
    ```

3.  Если вам не нужны все расширения темы, вы можете импортировать только необходимые части:

    ```ts
    /** @type {import('tailwindcss').Config} */
    import {
      iconsPluginCallback,
      screens,
      // только необходимые части темы
      colors,
      additionalColors, // для плавного перехода от старых имен к новым
      fontFamily,
      additionalFontFamily, // для плавного перехода от старых имен к новым
      fontSize,
    } from '@cdek/primereact/tailwind-config';

    export default {
      theme: {
        screens,
        extend: {
          colors: {
            ...colors,
            ...additionalColors,
          },
          fontFamily: {
            ...fontFamily,
            ...additionalFontFamily,
          },
          fontSize: {
            ...fontSize,
          },
        },
      },
    };
    ```

Полный перечень переменных для импорта:

- `screens`
- `colors`
- `borderRadius`
- `borderWidth`
- `boxShadow`
- `fontFamily`
- `fontSize`
- `fontWeight`
- `lineHeight`
- `opacity`
- `sizing`
- `spacing`
- `transitionDuration`
- `transitionTimingFunction`
- `zIndex`
- `additionalColors` (для плавного перехода от старых имен к новым)
- `additionalBoxShadow` (для плавного перехода от старых имен к новым)
- `additionalFontFamily` (для плавного перехода от старых имен к новым)

4.  Настройте ваш `postcss.config.js`:

    ```js
    export default {
      plugins: {
        'postcss-import': {},
        tailwindcss: {},
        autoprefixer: {},
      },
    };
    ```

5.  Типографику следует использовать из пакета https://github.com/cdek-it/typography
    ```scss
    @use '@cdek-it/typography/dist/index.min.css';
    ```
    > **Важно:**
    > Для типографики используйте пакет [@cdek-it/typography](https://github.com/cdek-it/typography)
