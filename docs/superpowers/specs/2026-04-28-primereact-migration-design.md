# Миграция CDEK AI Assistant на PrimeReact + Tailwind CSS

**Дата:** 2026-04-28
**Подход:** Top-Down (layout → декомпозиция)
**Стек:** React 19 + Vite 6 + @cdek/primereact (local) + Tailwind CSS v4 + @tabler/icons-react

---

## 1. Контекст

Текущее состояние — монолитный файл `ai-assistant_1.jsx` (~1200 строк), все стили inline, без UI-библиотеки. 4 режима отображения (Full Page, Sidebar, Float, Embedded). Моковые данные захардкожены.

Цель — полный рефакторинг: декомпозиция на модули, переход на `@cdek/primereact` v2.3.22 (локальная зависимость из `./primereact-master`), Tailwind CSS для стилей, имплементация AI-компонентов из Figma-кита "AI UI kit (DS) [beta]".

Моковые данные остаются, API-слой не добавляется.

---

## 2. Целевая структура проекта

```
src/
├── main.jsx                     # Entry point
├── App.jsx                      # Router / mode selector
├── assets/
│   └── avatar.png
├── layouts/
│   ├── FullPageLayout.jsx       # Полноэкранный чат
│   ├── SidebarLayout.jsx        # Чат + боковая панель истории
│   ├── FloatLayout.jsx          # Плавающий виджет
│   └── EmbeddedLayout.jsx       # Встроенный компонент
├── components/
│   ├── chat/
│   │   ├── ChatContent.jsx      # Основная область чата (сообщения + ввод)
│   │   ├── MessageList.jsx      # Список сообщений со скроллом
│   │   ├── MessageBubble.jsx    # Одно сообщение (user/bot)
│   │   ├── ChatInput.jsx        # Поле ввода + кнопки (attach, voice, send)
│   │   ├── TypingIndicator.jsx  # Анимация "печатает..."
│   │   └── VoiceWaveform.jsx    # Визуализация голосового ввода
│   ├── sidebar/
│   │   ├── HistorySidebar.jsx   # Панель истории чатов
│   │   ├── HistoryItem.jsx      # Элемент истории
│   │   └── HistorySearch.jsx    # Поиск по истории
│   ├── suggestions/
│   │   ├── CategoryGrid.jsx     # Сетка категорий (welcome screen)
│   │   ├── SuggestionChip.jsx   # Чип-подсказка (→ Figma Suggestion)
│   │   └── FollowUpList.jsx     # Follow-up вопросы после ответа
│   ├── ai/
│   │   ├── FeedMessage.jsx      # → Figma Feed.Message
│   │   └── HintCard.jsx         # → Figma Card.Hint
│   ├── message-content/
│   │   ├── CodeBlock.jsx        # Блок кода с подсветкой
│   │   ├── ProductCard.jsx      # Карточка товара
│   │   └── AttachmentLink.jsx   # Ссылка на PDF/файл
│   └── common/
│       ├── CdekAiLogo.jsx       # Аватар/лого
│       └── icons/               # SVG-иконки как React-компоненты
├── hooks/
│   ├── useChat.js               # Состояние чата, отправка, история
│   ├── useChatHistory.js        # Управление списком чатов
│   ├── useVoiceInput.js         # Логика голосового ввода
│   └── useAutoComplete.js       # Автокомплит подсказок
├── data/
│   ├── mockResponses.js         # Моковые ответы
│   ├── categories.js            # Категории вопросов
│   └── autocomplete.js          # Карта автокомплита
└── styles/
    └── globals.css              # Анимации, скроллбар, глобальные стили
```

---

## 3. Зависимости

### Production
- `@cdek/primereact`: `file:./primereact-master` — CDEK-обёртка над PrimeReact
- `primereact`: `^10.9.0` — базовая библиотека компонентов
- `@tabler/icons-react`: `^3.34.0` — иконки
- `react`: `^19.0.0`
- `react-dom`: `^19.0.0`

### DevDependencies
- `tailwindcss`: `^4.0.0` — утилитарные CSS-классы
- `@tailwindcss/vite`: `^4.0.0` — Vite-плагин
- `sass`: `^1.80.0` — для компиляции SCSS из @cdek/primereact

### Конфигурация Tailwind v4

```css
/* styles/globals.css */
@import "tailwindcss";
@import "@cdek/primereact/dist/style.scss";
```

### Vite

Добавить `@tailwindcss/vite` как плагин. Остальная конфигурация без изменений.

### Шрифты

PT Sans берём из `@cdek/primereact` (woff2). Убираем Google Fonts импорт из `index.html`.

### Иконки

20+ кастомных SVG → заменяем на `@tabler/icons-react` где есть аналог. Уникальные CDEK-иконки остаются в `common/icons/`.

---

## 4. Маппинг компонентов

### Замена на PrimeReact

| Текущий элемент | PrimeReact компонент | Примечание |
|---|---|---|
| `<button style={...}>` | `<Button>` из `@cdek/primereact` | severity: primary/secondary/tertiary |
| Текстовое поле ввода | `<InputText>` / `<InputTextarea>` | из `@cdek/primereact` |
| Поиск по истории | `<IconField>` + `<InputIcon>` + `<InputText>` | Иконка поиска внутри поля |
| Автокомплит | `<AutoComplete>` из primereact | suggestions + completeMethod |
| Скролл-область | `<ScrollPanel>` из primereact | Кастомный скроллбар из темы |
| Тултипы | `<Tooltip>` из primereact | Замена title атрибутов |
| Аватар бота | `<Avatar>` из primereact | image + shape="circle" |
| Бейджи категорий | `<Badge>` / `<Tag>` из primereact | Для меток |
| Разделители | `<Divider>` из primereact | В истории чатов |

### Остаётся кастомным

- `TypingIndicator` — кастомная анимация с тремя точками
- `VoiceWaveform` — визуализация аудио
- `CodeBlock` — рендеринг кода с подсветкой и номерами строк
- `ProductCard` — карточка товара (специфичная для CDEK)
- `MessageBubble` — кастомная разметка, стилизация через Tailwind

### AI-компоненты из Figma

- **`Feed.Message`** → `FeedMessage.jsx` — обёртка над MessageBubble, стилизация по токенам из Figma
- **`Card.Hint`** → `HintCard.jsx` — карточка-подсказка на welcome-экране, на базе `<Card>` из primereact
- **`Suggestion`** → `SuggestionChip.jsx` — чип с текстом, на базе `<Chip>` из primereact + кастомные стили

---

## 5. Декомпозиция логики (хуки)

### `useChat.js` — ядро чата
- `messages: Message[]` — список сообщений текущего чата
- `sendMessage(text)` — добавить user-сообщение + сгенерить мок-ответ
- `activeChat: string | null` — ID текущего чата
- `setActiveChat(id)` — переключение между чатами
- `isTyping: boolean` — бот "печатает"
- `feedback: Map<id, 'up'|'down'>` — реакции на сообщения
- `setFeedback(id, value)`

### `useChatHistory.js` — управление списком чатов
- `chats: Chat[]` — все чаты (сгруппированные по дате)
- `pinnedChats: Chat[]` — закреплённые
- `searchQuery / setSearchQuery` — поиск
- `filteredChats` — отфильтрованный список
- `pinChat(id) / unpinChat(id)`
- `deleteChat(id)`
- `createNewChat()`

### `useVoiceInput.js` — голосовой ввод
- `isRecording: boolean`
- `startRecording() / stopRecording()`
- `waveformData: number[]` — данные для визуализации

### `useAutoComplete.js` — подсказки при вводе
- `suggestions: string[]` — текущие подсказки
- `updateSuggestions(query)` — фильтрация
- `clearSuggestions()`

### Локальное состояние (НЕ выносим)
- `isSidebarOpen` → `SidebarLayout`
- `isMinimized` → `FloatLayout`
- `isAudioPlaying` → `MessageBubble`
- `copiedMessageId` → `MessageBubble`

---

## 6. Этапы миграции

### Этап 1: Инфраструктура
- Установить зависимости
- Настроить Tailwind v4 + Vite плагин
- Подключить стили `@cdek/primereact` и шрифты
- Создать структуру директорий `src/`
- Проверить что приложение запускается

### Этап 2: Разбиение монолита
- Вынести моковые данные в `data/`
- Вынести SVG-иконки в `common/icons/`
- Извлечь хуки
- Разделить `ai-assistant_1.jsx` на: `App.jsx`, 4 layout-а, `ChatContent`, `HistorySidebar`
- Стили пока inline — главное не сломать

### Этап 3: Замена на PrimeReact-компоненты
- Кнопки → `<Button>`
- Инпуты → `<InputText>`, `<InputTextarea>`
- Поиск → `<IconField>` + `<InputText>`
- Автокомплит → `<AutoComplete>`
- Аватар → `<Avatar>`
- Тултипы → `<Tooltip>`
- Прочие (Divider, ScrollPanel, Badge/Tag)

### Этап 4: Миграция стилей на Tailwind
- Убрать inline `style={{}}` → Tailwind-классы
- Перенести анимации в `globals.css`
- Убрать Google Fonts из `index.html`
- Кастомный скроллбар через тему

### Этап 5: AI-компоненты из Figma
- Имплементировать `FeedMessage` по Figma `Feed.Message`
- Имплементировать `HintCard` по Figma `Card.Hint`
- Имплементировать `SuggestionChip` по Figma `Suggestion`
- Интегрировать в ChatContent и welcome-экран

### Этап 6: Финализация
- Удалить `ai-assistant_1.jsx` и `new.jsx`
- Очистить неиспользуемые зависимости
- Проверить все 4 режима отображения
- Убрать мёртвый код

---

## 7. Figma-контекст

**Файл:** AI UI kit (DS) [beta] — `rbcj8YdeSGCabUKqqBCQpI`
**Подключённые библиотеки:** Tokens (DS) v2.0, UI Kit (DS) v2.0, Icons (DS), и др.

**Токен-архитектура:** primitive → semantic → component
- Примитивы: цвета (50-950), spacing (gap-none...gap-xxxl), borderRadius (none...max)
- Семантика: form/borderRadius, text/color, surface/ground
- Компоненты: card/root/color, tabs/tab/color

**AI-компоненты для имплементации:**
- `Feed.Message` — сообщение в AI-чате (обновлён 2026-04-21)
- `Card.Hint` — карточка-подсказка (обновлён 2026-04-17)
- `Suggestion` — чип-подсказка (обновлён 2026-04-16)
