# PrimeReact Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Полностью рефакторить монолитный `ai-assistant_1.jsx` в модульное React-приложение на @cdek/primereact + Tailwind CSS v4, с имплементацией AI-компонентов из Figma.

**Architecture:** Top-Down декомпозиция — сначала инфраструктура и разбиение на модули с сохранением inline-стилей, затем замена на PrimeReact-компоненты и Tailwind-классы, в конце — Figma AI-компоненты.

**Tech Stack:** React 19, Vite 6, @cdek/primereact (local), primereact 10.9, Tailwind CSS v4, @tabler/icons-react, SCSS

---

## File Structure

### Новые файлы (создаём)

| Файл | Ответственность |
|---|---|
| `src/main.jsx` | Entry point, рендеринг App |
| `src/App.jsx` | Выбор режима, глобальное состояние чата |
| `src/styles/globals.css` | Tailwind imports, анимации, скроллбар |
| `src/data/categories.js` | CATEGORIES, CDEK_ACTIONS, SUGGESTED_QUESTIONS |
| `src/data/mockResponses.js` | DEMO_RESPONSES, getResponseKey, INITIAL_MESSAGES, TYPING_PHRASES, SOURCES, SHOPPING_PRODUCTS |
| `src/data/autocomplete.js` | AUTOCOMPLETE_MAP, getAutocompletion |
| `src/data/chatHistory.js` | CHAT_HISTORY, FOLLOW_UP_QUESTIONS |
| `src/hooks/useChat.js` | messages, sendMessage, feedback, activeChat |
| `src/hooks/useChatHistory.js` | chats, search, pin, delete, create |
| `src/hooks/useVoiceInput.js` | isRecording, start/stop, waveformData |
| `src/hooks/useAutoComplete.js` | suggestions, ghostText |
| `src/components/chat/ChatContent.jsx` | Сборка: MessageList + InputBar |
| `src/components/chat/MessageList.jsx` | Скролл-область + рендеринг сообщений |
| `src/components/chat/MessageBubble.jsx` | Одно сообщение (user/bot) + действия |
| `src/components/chat/ChatInput.jsx` | Поле ввода + ghost text + кнопки |
| `src/components/chat/TypingIndicator.jsx` | Анимация "печатает..." |
| `src/components/chat/VoiceWaveform.jsx` | Визуализация голосового ввода |
| `src/components/sidebar/HistorySidebar.jsx` | Панель истории чатов |
| `src/components/sidebar/HistoryItem.jsx` | Элемент истории + контекстное меню |
| `src/components/sidebar/HistorySearch.jsx` | Поиск по истории |
| `src/components/suggestions/CategoryGrid.jsx` | Сетка действий (welcome screen) |
| `src/components/suggestions/SuggestionChip.jsx` | Figma Suggestion |
| `src/components/suggestions/FollowUpList.jsx` | Follow-up вопросы |
| `src/components/message-content/CodeBlock.jsx` | Блок кода с подсветкой |
| `src/components/message-content/ProductCard.jsx` | ShoppingCards + ProductOrder |
| `src/components/message-content/AttachmentLink.jsx` | FileAttachment |
| `src/components/message-content/SourcesSection.jsx` | Источники |
| `src/components/message-content/AIResponseActions.jsx` | Действия над ответом ИИ |
| `src/components/ai/FeedMessage.jsx` | Figma Feed.Message |
| `src/components/ai/HintCard.jsx` | Figma Card.Hint |
| `src/components/common/CdekAiLogo.jsx` | Аватар/лого |
| `src/components/common/PageSkeleton.jsx` | Skeleton-заглушка страницы |
| `src/layouts/FullPageLayout.jsx` | Полноэкранный режим |
| `src/layouts/SidebarLayout.jsx` | Боковая панель |
| `src/layouts/FloatLayout.jsx` | Плавающий виджет |
| `src/layouts/EmbeddedLayout.jsx` | Встроенный режим |

### Модифицируемые файлы

| Файл | Изменения |
|---|---|
| `package.json` | Новые зависимости |
| `vite.config.js` | Добавить Tailwind плагин |
| `index.html` | Убрать Google Fonts, обновить entry point |

### Удаляемые файлы (Этап 6)

| Файл | Причина |
|---|---|
| `ai-assistant_1.jsx` | Заменён модульной структурой |
| `new.jsx` | Не используется |
| `main.jsx` (корневой) | Заменён на `src/main.jsx` |
| `avatar.png` (корневой) | Перенесён в `src/assets/` |

---

## Task 1: Инфраструктура — зависимости и конфигурация

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Modify: `index.html`
- Create: `src/styles/globals.css`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

- [ ] **Step 1: Установить зависимости**

```bash
npm install @cdek/primereact@file:./primereact-master primereact@^10.9.0 @tabler/icons-react@^3.34.0
npm install -D tailwindcss@^4.0.0 @tailwindcss/vite@^4.0.0 sass@^1.80.0
```

- [ ] **Step 2: Обновить vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/ai-chat/',
})
```

- [ ] **Step 3: Создать src/styles/globals.css**

```css
@import "tailwindcss";

/* Анимации */
@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

@keyframes msg-appear {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float-appear {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes fab-appear {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes sidebar-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes waveform {
  from { height: 3px; }
  to { height: 20px; }
}

@keyframes rec-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes recording-pulse {
  0%, 100% { border-color: #CCC; }
  50% { border-color: #999; }
}

/* Скроллбар */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #DDD; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #BBB; }

/* Глобальные сбросы */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

input::placeholder { color: #AAA; }
```

- [ ] **Step 4: Скопировать avatar.png в src/assets/**

```bash
mkdir -p src/assets
cp avatar.png src/assets/avatar.png
```

- [ ] **Step 5: Создать src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 6: Создать заглушку src/App.jsx**

```jsx
import AiAssistantPrototype from '../ai-assistant_1.jsx'

export default function App() {
  return <AiAssistantPrototype />
}
```

- [ ] **Step 7: Обновить index.html**

Заменить содержимое:

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CDEK AI Assistant</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Проверить что приложение запускается**

```bash
npm run dev
```

Expected: приложение открывается в браузере, выглядит как раньше (старый компонент рендерится через заглушку App.jsx).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/main.jsx src/App.jsx src/styles/globals.css src/assets/avatar.png
git commit -m "feat: setup infrastructure — Tailwind v4, PrimeReact, project structure"
```

---

## Task 2: Вынести данные в src/data/

**Files:**
- Create: `src/data/categories.js`
- Create: `src/data/mockResponses.js`
- Create: `src/data/autocomplete.js`
- Create: `src/data/chatHistory.js`

- [ ] **Step 1: Создать src/data/categories.js**

```js
export const CATEGORIES = [
  { id: "popular", label: "Популярные вопросы" },
  { id: "tracking", label: "Отслеживание" },
  { id: "delivery", label: "Доставка" },
  { id: "offices", label: "Пункты выдачи" },
  { id: "tariffs", label: "Тарифы" },
];

export const CDEK_ACTIONS = [
  { icon: "📦", label: "Отследи посылку", badge: null, q: "Где моя посылка?" },
  { icon: "🛍️", label: "СДЭК Шоппинг", badge: "новое", q: null, shopping: true },
  { icon: "💰", label: "Рассчитай цену", badge: null, q: "Как рассчитать стоимость доставки?" },
  { icon: "📌", label: "Найди ПВЗ", badge: null, q: "Ближайший пункт выдачи СДЭК" },
  { icon: "👨‍💻", label: "API CDEK", badge: null, q: "Как подключить API СДЭК для разработчиков?" },
  { icon: "📖", label: "CDEK Wiki", badge: null, q: "Создай отчёт по вопросам в https://cdek.me/questions2" },
];

export const SUGGESTED_QUESTIONS = [
  "Где моя посылка?",
  "🛍️ Товары в СДЭК Шоппинг",
  "Как рассчитать стоимость доставки?",
  "Ближайший пункт выдачи СДЭК",
  "Как оформить возврат?",
  "Сроки доставки между городами",
];
```

- [ ] **Step 2: Создать src/data/mockResponses.js**

```js
export const SOURCES = [
  { label: "СДЭК — отслеживание посылок по трек-номеру" },
  { label: "Тарифы и сроки доставки СДЭК 2024" },
  { label: "Пункты выдачи СДЭК — адреса и режим работы" },
  { label: "Как оформить возврат посылки через СДЭК" },
  { label: "Международная доставка СДЭК — условия и тарифы" },
];

export const SHOPPING_PRODUCTS = [
  { id: 1, name: "Наушники Sony WH-1000XM5", price: "29 990 ₽", oldPrice: "36 990 ₽", badge: "−19%", rating: 4.8, reviews: 1240, img: "🎧", desc: "Беспроводные, шумоподавление, до 30 ч" },
  { id: 2, name: "Смартфон Samsung Galaxy A55", price: "34 990 ₽", oldPrice: null, badge: "Хит", rating: 4.7, reviews: 890, img: "📱", desc: '6.6", 5G, 128 ГБ, камера 50 МП' },
  { id: 3, name: "Кроссовки Nike Air Max 270", price: "8 990 ₽", oldPrice: "12 490 ₽", badge: "−28%", rating: 4.9, reviews: 3210, img: "👟", desc: "Размеры 36–47, несколько цветов" },
  { id: 4, name: "Рюкзак Xiaomi Mi City", price: "3 490 ₽", oldPrice: null, badge: "Новинка", rating: 4.6, reviews: 412, img: "🎒", desc: '15.6", водоотталкивающий, 17 л' },
];

export const TYPING_PHRASES = [
  "Шуршу упаковочной плёнкой...",
  "Ищу вашу посылку под диваном...",
  "Заправляю курьера крепким кофе...",
  "Сверяюсь с секретными картами ПВЗ...",
  "Договариваюсь с таможней на печеньки...",
  "Рассчитываю путь быстрее ветра...",
  "Проверяю, не съел ли кто-то посылку...",
];

export const DEMO_RESPONSES = {
  default: { text: "Ой, я как раз изучал этот вопрос! 📚\n\nВот что мне удалось выяснить:\n• Для отслеживания посылки просто напишите её номер (например, CDEK-XXXXXXXXX)\n• Статусы у нас обновляются довольно шустро, каждые пару часов\n• А если что-то застряло больше чем на 3 дня — свистните в поддержку, они разберутся!\n\nЧем ещё могу вас порадовать?", type: "default" },
  tracking: { text: "Ура, нашёл вашу посылочку CDEK-284759163! 📦✨\n\nОна сейчас в пути и бодро проезжает Новосибирск. Ожидаем, что она прибудет к вам уже 15 марта.\n\nКороткая хроника: 10 марта она выехала из Москвы, сейчас на сортировке. Ещё каких-то пару дней — и она ваша! Ждёте?", type: "tracking" },
  delivery: { text: "Давайте посчитаем, во сколько обойдётся доставка! 💰\n\nЦена обычно зависит от того, откуда и куда едем, сколько весим и как сильно торопимся.\n\nНапример:\n• Стандарт (Москва → Питер): от 350 ₽, 2–3 дня в пути.\n• Экспресс (если очень горит): от 590 ₽, доставят на следующий же день!\n\nХотите прикину точный маршрут?", type: "delivery" },
  offices: { text: "О, я знаю отличные места поблизости! 📍\n\nВот самые удобные пункты:\n1. ул. Ленина, 42 — совсем рядом (всего 350 м), работают до 20:00.\n2. пр. Мира, 15 — чуть дальше (800 м), зато открыты каждый день.\n3. ТЦ «Галерея», 2 этаж — если решите совместить с шопингом, работают до 22:00.\n\nТам можно всё примерить и рассмотреть перед получением. Заглянете?", type: "offices" },
  api: {
    text: "Конечно! Интеграция со СДЭК API v2 довольно проста. 👨‍💻\n\nСначала нужно получить токен доступа по OAuth2. Вот пример запроса на создание заказа через cURL:\n\n```bash\ncurl -X POST 'https://api.cdek.ru/v2/orders' \\\n-H 'Authorization: Bearer <YOUR_ACCESS_TOKEN>' \\\n-H 'Content-Type: application/json' \\\n-d '{\n  \"type\": 1,\n  \"number\": \"INV-123\",\n  \"tariff_code\": 136,\n  \"recipient\": {\n    \"name\": \"Иван Петров\",\n    \"phones\": [{\"number\": \"+79130000000\"}]\n  },\n  \"from_location\": {\"address\": \"Москва, ул. Ленина, 1\"},\n  \"to_location\": {\"address\": \"Новосибирск, Красный пр-т, 2\"},\n  \"packages\": [{\"weight\": 1000, \"length\": 10, \"width\": 10, \"height\": 10}]\n}'\n```\n\nВсю актуальную документацию, SDK и примеры для популярных языков (PHP, Python, JS) вы найдете на [apidoc.cdek.ru](https://apidoc.cdek.ru/). Есть вопросы по параметрам?",
    type: "api",
  },
  wiki: {
    text: "Я проанализировал вопросы из базы знаний CDEK Wiki (https://cdek.me/questions2) и подготовил для вас сводный отчет. 📊\n\nВ PDF-файле ниже вы найдете:\n• Статистику самых популярных запросов за последний месяц\n• Тренды в вопросах пользователей по качеству доставки\n• Рекомендации по обновлению разделов FAQ\n\nОтчет готов к скачиванию!",
    type: "wiki",
    file: { name: "CDEK_Questions_Report_2026.pdf", size: "2.4 MB", type: "pdf" },
  },
};

export const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    text: "Здравствуйте! Я ИИ-помощник СДЭК. Чем могу помочь?",
    time: "9:17",
    hasAudio: true,
    responseType: null,
  },
];

export function getResponseKey(text) {
  const l = text.toLowerCase();
  if (l.includes("посылк") || l.includes("трек") || l.includes("отслед")) return "tracking";
  if (l.includes("стоим") || l.includes("доставк") || l.includes("тариф") || l.includes("рассчит")) return "delivery";
  if (l.includes("пункт") || l.includes("ближ") || l.includes("офис") || l.includes("пвз")) return "offices";
  if (l.includes("api") || l.includes("документац") || l.includes("разработчик") || l.includes("подключ")) return "api";
  if (l.includes("wiki") || l.includes("отчет") || l.includes("отчёт") || l.includes("questions")) return "wiki";
  return "default";
}
```

- [ ] **Step 3: Создать src/data/autocomplete.js**

```js
export const AUTOCOMPLETE_MAP = [
  { prefix: "где ", completion: "моя посылка?" },
  { prefix: "как рас", completion: "считать стоимость доставки?" },
  { prefix: "как расс", completion: "читать стоимость доставки?" },
  { prefix: "как рассч", completion: "итать стоимость доставки?" },
  { prefix: "ближ", completion: "айший пункт выдачи СДЭК" },
  { prefix: "как оф", completion: "ормить возврат?" },
  { prefix: "сроки", completion: " доставки между городами" },
  { prefix: "трек", completion: "-номер посылки" },
  { prefix: "отслед", completion: "ить посылку по номеру" },
  { prefix: "стоим", completion: "ость доставки из Москвы" },
  { prefix: "когда", completion: " придёт моя посылка?" },
  { prefix: "можно", completion: " ли изменить адрес доставки?" },
  { prefix: "что дел", completion: "ать, если посылка задерживается?" },
  { prefix: "курьер", completion: "ская доставка до двери" },
  { prefix: "меж", completion: "дународная доставка СДЭК" },
  { prefix: "пункт", completion: " выдачи рядом со мной" },
  { prefix: "возвр", completion: "ат посылки — как оформить?" },
  { prefix: "измен", completion: "ить адрес доставки" },
  { prefix: "связ", completion: "аться с курьером" },
  { prefix: "экспр", completion: "есс-доставка за 1 день" },
  { prefix: "застр", completion: "аховать посылку" },
];

export function getAutocompletion(input) {
  if (!input || input.length < 3) return "";
  const lower = input.toLowerCase();
  for (const item of AUTOCOMPLETE_MAP) {
    if (lower.startsWith(item.prefix) && lower.length <= item.prefix.length + 2) {
      return item.completion.slice(lower.length - item.prefix.length);
    }
  }
  return "";
}
```

- [ ] **Step 4: Создать src/data/chatHistory.js**

```js
export const CHAT_HISTORY = [
  { id: "h1", title: "Отслеживание CDEK-284759163", date: "Сегодня", active: true, pinned: true },
  { id: "h2", title: "Стоимость доставки Москва — СПб", date: "Сегодня", active: false, pinned: true },
  { id: "h3", title: "Ближайший пункт выдачи", date: "Вчера", active: false },
  { id: "h4", title: "Возврат посылки — документы", date: "Вчера", active: false },
  { id: "h5", title: "Международная доставка в Казахстан", date: "11 мар", active: false },
  { id: "h6", title: "Курьерская доставка до двери", date: "11 мар", active: false },
  { id: "h7", title: "Застраховать посылку", date: "10 мар", active: false },
  { id: "h8", title: "Сроки доставки крупногабарита", date: "9 мар", active: false },
  { id: "h9", title: "Оформить отправку из ПВЗ", date: "8 мар", active: false },
  { id: "h10", title: "Тарифы экспресс-доставки 2026", date: "7 мар", active: false },
];

export const FOLLOW_UP_QUESTIONS = {
  tracking: [
    "Изменить адрес доставки",
    "Связаться с курьером",
    "Переоформить на другой ПВЗ",
    "Посылка задерживается — что делать?",
    "Получить SMS-уведомление о доставке",
  ],
  delivery: [
    "Экспресс-доставка за 1 день",
    "Доставка крупногабаритного груза",
    "Международная отправка",
    "Застраховать посылку",
    "Доставка документов",
  ],
  offices: [
    "Показать на карте",
    "Пункты с примеркой",
    "Работающие в выходные",
    "Постаматы СДЭК рядом",
    "Оставить отзыв о пункте",
  ],
  default: [
    "Отследить другую посылку",
    "Рассчитать стоимость доставки",
    "Найти ближайший пункт выдачи",
    "Как оформить возврат",
    "Связаться с оператором",
  ],
};
```

- [ ] **Step 5: Проверить что данные корректно импортируются**

Временно добавить в `src/App.jsx`:

```jsx
import { CATEGORIES } from './data/categories.js'
import { DEMO_RESPONSES } from './data/mockResponses.js'
import { AUTOCOMPLETE_MAP } from './data/autocomplete.js'
import { CHAT_HISTORY } from './data/chatHistory.js'

console.log('Data modules loaded:', { CATEGORIES, DEMO_RESPONSES, AUTOCOMPLETE_MAP, CHAT_HISTORY })
```

```bash
npm run dev
```

Expected: в консоли браузера видны все загруженные данные без ошибок.

- [ ] **Step 6: Убрать тестовый console.log из App.jsx и commit**

```bash
git add src/data/
git commit -m "refactor: extract mock data into src/data modules"
```

---

## Task 3: Вынести хуки

**Files:**
- Create: `src/hooks/useChat.js`
- Create: `src/hooks/useChatHistory.js`
- Create: `src/hooks/useVoiceInput.js`
- Create: `src/hooks/useAutoComplete.js`

- [ ] **Step 1: Создать src/hooks/useChat.js**

```jsx
import { useState, useCallback } from "react";
import { INITIAL_MESSAGES, DEMO_RESPONSES, getResponseKey } from "../data/mockResponses.js";

export function useChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [hasUserSent, setHasUserSent] = useState(false);
  const [activeChat, setActiveChat] = useState("h1");

  const doSend = useCallback((text) => {
    const txt = text.trim();
    if (!txt) return;
    setHasUserSent(true);
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    setMessages((p) => [
      ...p,
      { id: Date.now(), role: "user", text: txt, time: now },
      { id: Date.now() + 1, role: "assistant", text: "", isTyping: true, time: "", responseType: null },
    ]);
    setInputValue("");
    const key = getResponseKey(txt);
    setTimeout(() => {
      const now2 = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
      const resp = DEMO_RESPONSES[key];
      setMessages((p) =>
        p.map((m) =>
          m.isTyping
            ? { ...m, text: resp.text, isTyping: false, time: now2, hasAudio: true, responseType: resp.type, file: resp.file }
            : m
        )
      );
    }, 1500);
  }, []);

  const handleSend = useCallback(() => doSend(inputValue), [inputValue, doSend]);

  const handleQuestionSelect = useCallback(
    (q) => {
      setInputValue(q);
      setTimeout(() => doSend(q), 150);
    },
    [doSend]
  );

  const resetChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setInputValue("");
    setHasUserSent(false);
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    handleSend,
    handleQuestionSelect,
    hasUserSent,
    activeChat,
    setActiveChat,
    resetChat,
  };
}
```

- [ ] **Step 2: Создать src/hooks/useChatHistory.js**

```jsx
import { useState, useMemo } from "react";
import { CHAT_HISTORY } from "../data/chatHistory.js";

export function useChatHistory() {
  const [chats] = useState(CHAT_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chats, searchQuery]);

  const pinnedChats = useMemo(() => filteredChats.filter((c) => c.pinned), [filteredChats]);

  const groupedChats = useMemo(() => {
    const regular = filteredChats.filter((c) => !c.pinned);
    const groups = {};
    regular.forEach((c) => {
      if (!groups[c.date]) groups[c.date] = [];
      groups[c.date].push(c);
    });
    return groups;
  }, [filteredChats]);

  return {
    filteredChats,
    pinnedChats,
    groupedChats,
    searchQuery,
    setSearchQuery,
    menuOpenId,
    setMenuOpenId,
  };
}
```

- [ ] **Step 3: Создать src/hooks/useVoiceInput.js**

```jsx
import { useState, useRef, useCallback } from "react";

export function useVoiceInput(onResult) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    setTimeout(() => {
      setIsRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
      onResult("Где моя посылка с трек-номером 284759163?");
    }, 3500);
  }, [onResult]);

  const cancelRecording = useCallback(() => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    setRecordingTime(0);
  }, []);

  const sendRecording = useCallback(() => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    setRecordingTime(0);
    onResult("Где моя посылка с трек-номером 284759163?");
  }, [onResult]);

  return {
    isRecording,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    startRecording,
    cancelRecording,
    sendRecording,
  };
}
```

- [ ] **Step 4: Создать src/hooks/useAutoComplete.js**

```jsx
import { useState, useEffect } from "react";
import { getAutocompletion } from "../data/autocomplete.js";

export function useAutoComplete(value, isDisabled = false) {
  const [ghostText, setGhostText] = useState("");

  useEffect(() => {
    if (isDisabled) {
      setGhostText("");
      return;
    }
    setGhostText(getAutocompletion(value));
  }, [value, isDisabled]);

  const acceptCompletion = () => {
    if (ghostText) {
      setGhostText("");
      return value + ghostText;
    }
    return value;
  };

  return { ghostText, acceptCompletion };
}
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/
git commit -m "refactor: extract hooks — useChat, useChatHistory, useVoiceInput, useAutoComplete"
```

---

## Task 4: Вынести общие компоненты (common)

**Files:**
- Create: `src/components/common/CdekAiLogo.jsx`
- Create: `src/components/common/PageSkeleton.jsx`

- [ ] **Step 1: Создать src/components/common/CdekAiLogo.jsx**

```jsx
import avatarImg from "../../assets/avatar.png";

export default function CdekAiLogo({ size = 32 }) {
  return (
    <img
      src={avatarImg}
      alt="AI Assistant"
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  );
}
```

- [ ] **Step 2: Создать src/components/common/PageSkeleton.jsx**

```jsx
const sk = (w, h, r = 6) => ({
  height: h,
  width: w,
  background: "linear-gradient(90deg, #F0F0F0 25%, #E4E4E4 50%, #F0F0F0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.6s infinite",
  borderRadius: r,
  flexShrink: 0,
});

export default function PageSkeleton() {
  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", background: "#F9FAFB", fontFamily: "'PT Sans', sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px" }}>
        <div style={sk("220px", 28, 8)} />
        <div style={{ ...sk("360px", 16, 6), marginTop: 10, marginBottom: 32 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 40 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ padding: 20, background: "#FFF", borderRadius: 16, border: "1px solid #E5E7EB" }}>
              <div style={sk("55%", 14, 4)} />
              <div style={{ ...sk("35%", 12, 4), marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "#E5E7EB", marginBottom: 32 }} />
        <div style={sk("65%", 20, 6)} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <div style={sk("100%", 14, 4)} />
          <div style={sk("100%", 14, 4)} />
          <div style={sk("82%", 14, 4)} />
          <div style={{ ...sk("100%", 72, 12), marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/common/
git commit -m "refactor: extract CdekAiLogo and PageSkeleton components"
```

---

## Task 5: Вынести компоненты содержимого сообщений

**Files:**
- Create: `src/components/message-content/CodeBlock.jsx`
- Create: `src/components/message-content/AttachmentLink.jsx`
- Create: `src/components/message-content/SourcesSection.jsx`
- Create: `src/components/message-content/AIResponseActions.jsx`
- Create: `src/components/message-content/ProductCard.jsx`

- [ ] **Step 1: Создать src/components/message-content/CodeBlock.jsx**

Скопировать компонент `CodeBlock` из `ai-assistant_1.jsx:422-518` как отдельный модуль. Заменить иконки `IconCopy` и `IconCheck` на Tabler:

```jsx
import { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";

export default function CodeBlock({ content, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlight = (code) => {
    if (!code) return "";
    let html = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span style="color: #E6DB74">$1</span>');
    html = html.replace(/(#.*$|\/\/.*$)/gm, '<span style="color: #75715E">$1</span>');

    const keywords = /\b(curl|POST|GET|Authorization|Bearer|Content-Type|packages|recipient|from_location|to_location|type|number|tariff_code|name|phones|address|weight|length|width|height|orders|location)\b/g;
    html = html.replace(keywords, '<span style="color: #66D9EF; font-weight: 500">$1</span>');
    html = html.replace(/( -H | -d | -X | --data | --header )/g, '<span style="color: #A6E22E">$1</span>');
    html = html.replace(/\b(\d+)\b/g, '<span style="color: #AE81FF">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const lines = content.split("\n");

  return (
    <div style={{
      position: "relative", background: "#121212", borderRadius: "12px",
      margin: "14px 0", border: "1px solid #2A2A2A", overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 14px", background: "#1E1E1E", borderBottom: "1px solid #2A2A2A",
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F56" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27C93F" }} />
          <span style={{ fontSize: "10px", color: "#666", marginLeft: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>{language || "bash"}</span>
        </div>
        <button onClick={handleCopy} style={{
          background: copied ? "#27C93F22" : "rgba(255,255,255,0.05)",
          border: "1px solid", borderColor: copied ? "#27C93F44" : "#444",
          borderRadius: "6px", color: copied ? "#27C93F" : "#BBB",
          fontSize: "11px", padding: "4px 10px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
          fontFamily: "inherit", fontWeight: 500,
        }}>
          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <div style={{ display: "flex", position: "relative", overflowX: "auto" }}>
        <div style={{
          padding: "16px 12px", background: "#181818", borderRight: "1px solid #2A2A2A",
          textAlign: "right", userSelect: "none", color: "#444", fontSize: "12px",
          fontFamily: "monospace", minWidth: "35px", flexShrink: 0,
        }}>
          {lines.map((_, i) => (<div key={i} style={{ height: "1.6em" }}>{i + 1}</div>))}
        </div>
        <pre style={{
          margin: 0, padding: "16px", flex: 1,
          fontSize: "12px", color: "#F8F8F2", fontFamily: "'Fira Code', 'JetBrains Mono', 'Monaco', monospace",
          lineHeight: 1.6, whiteSpace: "pre",
        }}>
          <code>{highlight(content)}</code>
        </pre>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Создать src/components/message-content/AttachmentLink.jsx**

```jsx
import { IconFileTypePdf, IconDownload } from "@tabler/icons-react";

export default function AttachmentLink({ file, isCompact }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, background: "#F9FAFB",
      border: "1px solid #E5E7EB", borderRadius: 16, padding: "12px 16px",
      marginTop: 12, width: isCompact ? "100%" : "320px",
      animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      <div style={{
        width: 44, height: 44, background: "#FEE2E2", borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444",
      }}>
        <IconFileTypePdf size={32} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{file.name}</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{file.size} · PDF документ</div>
      </div>
      <button style={{
        background: "#F3F4F6", border: "none", borderRadius: "50%",
        width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "#374151", transition: "all 0.2s",
      }} title="Скачать">
        <IconDownload size={18} />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Создать src/components/message-content/SourcesSection.jsx**

```jsx
import { useState } from "react";
import { SOURCES } from "../../data/mockResponses.js";

export default function SourcesSection({ isCompact }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? SOURCES : SOURCES.slice(0, 3);

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ fontSize: 12, color: "#777", fontWeight: 500, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
        Источники
        <span style={{ background: "#F0F0F0", color: "#555", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 600 }}>{SOURCES.length}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {shown.map((s, i) => (
          <div key={i} style={{
            background: "#F5F5F5", borderRadius: 20, padding: "5px 12px",
            fontSize: isCompact ? 10 : 11, color: "#444", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
            maxWidth: isCompact ? "100%" : 280, overflow: "hidden",
            whiteSpace: "nowrap", textOverflow: "ellipsis", border: "1px solid #E8E8E8",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#888", flexShrink: 0 }} />
            {s.label}
          </div>
        ))}
        {!expanded && (
          <button onClick={() => setExpanded(true)} style={{
            background: "#FAFAFA", border: "1px solid #E0E0E0", borderRadius: 20,
            padding: "5px 12px", fontSize: 11, color: "#777", cursor: "pointer", fontFamily: "inherit",
          }}>
            ← Ещё источники
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Создать src/components/message-content/AIResponseActions.jsx**

```jsx
import { IconWand } from "@tabler/icons-react";

const ACTIONS = ["Развернуть мысль", "Короче", "Больше контекста"];

export default function AIResponseActions({ isCompact, onAction }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5",
      border: "1px solid #E8E8E8", borderRadius: 24, padding: "6px 12px", marginTop: 8,
      width: "fit-content", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    }}>
      <IconWand size={16} />
      <div style={{ display: "flex", gap: 4 }}>
        {ACTIONS.map((act) => (
          <button key={act} onClick={() => onAction(act)} style={{
            background: "#EBEBEB", border: "none", borderRadius: 8,
            padding: "6px 12px", fontSize: isCompact ? 11 : 12, color: "#666",
            fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
          }}>
            {act}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Создать src/components/message-content/ProductCard.jsx**

```jsx
import { useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { SHOPPING_PRODUCTS } from "../../data/mockResponses.js";

function ShoppingCards({ onOrder, isCompact }) {
  return (
    <div style={{ animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      <div style={{ fontSize: isCompact ? 11 : 12, color: "#999", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
        СДЭК Шоппинг — рекомендуем
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr", gap: 10 }}>
        {SHOPPING_PRODUCTS.map((p) => (
          <button key={p.id} onClick={() => onOrder(p)} style={{
            background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 14,
            textAlign: "left", cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{p.img}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                    background: p.badge.startsWith("−") ? "#FEF3C7" : p.badge === "Хит" ? "#DBEAFE" : "#F0FDF4",
                    color: p.badge.startsWith("−") ? "#92400E" : p.badge === "Хит" ? "#1E40AF" : "#14532D",
                    textTransform: "uppercase", letterSpacing: "0.04em",
                  }}>{p.badge}</span>
                </div>
                <div style={{ fontSize: isCompact ? 11 : 12, fontWeight: 600, color: "#111827", marginBottom: 3, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: isCompact ? 10 : 11, color: "#9CA3AF", marginBottom: 6 }}>{p.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: isCompact ? 12 : 13, fontWeight: 700, color: "#111827" }}>{p.price}</span>
                  {p.oldPrice && <span style={{ fontSize: 10, color: "#9CA3AF", textDecoration: "line-through" }}>{p.oldPrice}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>★ {p.rating} · {p.reviews} отзывов</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: isCompact ? 11 : 12, color: "#6B7280", padding: "10px 12px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
        Нажмите на товар, чтобы узнать подробности и оформить заказ с доставкой СДЭК 🚀
      </div>
    </div>
  );
}

function ProductOrder({ product, onBack, isCompact }) {
  return (
    <div style={{ animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer", color: "#777",
        fontSize: isCompact ? 11 : 12, marginBottom: 10, padding: 0, fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        <IconChevronLeft size={18} /><span>Назад к каталогу</span>
      </button>
      <div style={{ background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 16, marginBottom: 10 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{product.img}</div>
        <div style={{ fontSize: isCompact ? 13 : 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{product.name}</div>
        <div style={{ fontSize: isCompact ? 11 : 12, color: "#6B7280", marginBottom: 10 }}>{product.desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: isCompact ? 16 : 18, fontWeight: 700, color: "#111827" }}>{product.price}</span>
          {product.oldPrice && <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>{product.oldPrice}</span>}
        </div>
        <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 10 }}>★ {product.rating} · {product.reviews} отзывов</div>
        <div style={{ fontSize: isCompact ? 11 : 12, color: "#374151", background: "#F3F4F6", borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
          🚚 Доставка СДЭК от <b>2 дней</b> · Стандарт от <b>350 ₽</b> · Экспресс от <b>590 ₽</b>
        </div>
        <button style={{
          width: "100%", background: "#1A1A1A", color: "#FFF", border: "none",
          borderRadius: 12, padding: isCompact ? "10px" : "12px", fontSize: isCompact ? 12 : 13,
          fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
        }}>
          Заказать с доставкой СДЭК
        </button>
      </div>
      <div style={{ fontSize: isCompact ? 10 : 11, color: "#9CA3AF", textAlign: "center" }}>
        Перейдёте на сайт СДЭК Шоппинг для завершения заказа
      </div>
    </div>
  );
}

export default function ProductCardSection({ isCompact }) {
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (selectedProduct) {
    return <ProductOrder product={selectedProduct} onBack={() => setSelectedProduct(null)} isCompact={isCompact} />;
  }
  if (shoppingOpen) {
    return <ShoppingCards onOrder={(p) => setSelectedProduct(p)} isCompact={isCompact} />;
  }

  return null;
}

export { ShoppingCards, ProductOrder };
```

- [ ] **Step 6: Commit**

```bash
git add src/components/message-content/
git commit -m "refactor: extract message content components — CodeBlock, AttachmentLink, Sources, AIActions, ProductCard"
```

---

## Task 6: Вынести компоненты чата

**Files:**
- Create: `src/components/chat/TypingIndicator.jsx`
- Create: `src/components/chat/VoiceWaveform.jsx`
- Create: `src/components/chat/MessageBubble.jsx`
- Create: `src/components/chat/ChatInput.jsx`
- Create: `src/components/chat/ChatContent.jsx`
- Create: `src/components/chat/MessageList.jsx`

- [ ] **Step 1: Создать src/components/chat/TypingIndicator.jsx**

```jsx
import { useState, useEffect } from "react";
import { TYPING_PHRASES } from "../../data/mockResponses.js";

export default function TypingIndicator() {
  const [phrase, setPhrase] = useState(TYPING_PHRASES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase(TYPING_PHRASES[Math.floor(Math.random() * TYPING_PHRASES.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "8px 0", fontStyle: "italic", color: "#888", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: "50%", background: "#999",
            animation: `typing-bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      {phrase}
    </div>
  );
}
```

- [ ] **Step 2: Создать src/components/chat/VoiceWaveform.jsx**

```jsx
export default function VoiceWaveform() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 24, flex: 1 }}>
      {Array.from({ length: 32 }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2, background: "#555",
          animation: `waveform ${0.6 + Math.random() * 0.6}s ease-in-out ${i * 0.03}s infinite alternate`,
          minHeight: 3,
        }} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Создать src/components/chat/MessageBubble.jsx**

```jsx
import { useState } from "react";
import { IconCopy, IconShare, IconVolume, IconRefresh, IconThumbUp, IconThumbDown } from "@tabler/icons-react";
import CdekAiLogo from "../common/CdekAiLogo.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import CodeBlock from "../message-content/CodeBlock.jsx";
import AttachmentLink from "../message-content/AttachmentLink.jsx";
import AIResponseActions from "../message-content/AIResponseActions.jsx";

const actionBtnStyle = {
  background: "none", border: "none", cursor: "pointer", color: "#999",
  padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center", transition: "all 0.15s",
};

function renderMessageContent(text) {
  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part && part.startsWith("```")) {
      const lines = part.split("\n");
      const lang = lines[0].replace("```", "").trim();
      const content = lines.slice(1, -1).join("\n");
      return <CodeBlock key={i} content={content} language={lang} />;
    }

    if (!part) return null;

    const subParts = part.split(/(\[.*?\]\(.*?\))/g);
    return (
      <span key={i} style={{ whiteSpace: "pre-line" }}>
        {subParts.map((sub, j) => {
          const linkMatch = sub.match(/\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            return (
              <a key={`${i}-${j}`} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
                style={{ color: "#0066FF", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid transparent", transition: "border-color 0.2s" }}>
                {linkMatch[1]}
              </a>
            );
          }
          return sub;
        })}
      </span>
    );
  });
}

export default function MessageBubble({ message, isCompact }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start", gap: 4,
      animation: "msg-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      {!isUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <CdekAiLogo size={24} />
          <span style={{ fontSize: 11, color: "#BBB" }}>{message.time}</span>
        </div>
      )}
      {isUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 11, color: "#BBB" }}>{message.time}</span>
          <span style={{ fontSize: 12, color: "#777", fontWeight: 500 }}>Вы</span>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#D4D4D4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#555" }}>П</div>
        </div>
      )}
      <div style={{
        background: isUser ? "#F0F0F0" : "#FFF",
        border: isUser ? "none" : "1px solid #EBEBEB",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: isCompact ? "12px 16px" : "16px 20px",
        maxWidth: isCompact ? "100%" : "85%",
        fontSize: isCompact ? 13 : 14, lineHeight: 1.6, color: "#1A1A1A",
        whiteSpace: "pre-line", boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        {message.isTyping ? <TypingIndicator /> : renderMessageContent(message.text)}
      </div>
      {!isUser && message.file && <AttachmentLink file={message.file} isCompact={isCompact} />}
      {!isUser && !message.isTyping && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, width: "100%" }}>
            <button onClick={handleCopy} style={{ ...actionBtnStyle, color: copied ? "#333" : "#999" }} title={copied ? "Скопировано" : "Копировать"}><IconCopy size={14} /></button>
            <button onClick={handleShare} style={actionBtnStyle} title={shared ? "Ссылка скопирована" : "Поделиться"}><IconShare size={14} /></button>
            <button style={actionBtnStyle} title="Прослушать"><IconVolume size={14} /></button>
            <button style={actionBtnStyle} title="Перегенерировать ответ"><IconRefresh size={14} /></button>
            <div style={{ flex: 1 }} />
            <button style={actionBtnStyle} title="Полезно"><IconThumbUp size={14} /></button>
            <button style={actionBtnStyle} title="Не полезно"><IconThumbDown size={14} /></button>
          </div>
          <AIResponseActions isCompact={isCompact} onAction={() => {}} />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Создать src/components/chat/ChatInput.jsx**

```jsx
import { IconSend, IconMicrophone, IconPaperclip, IconPlayerStop } from "@tabler/icons-react";
import { useVoiceInput } from "../../hooks/useVoiceInput.js";
import { useAutoComplete } from "../../hooks/useAutoComplete.js";
import VoiceWaveform from "./VoiceWaveform.jsx";

const iBtnS = { background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", borderRadius: 8 };

export default function ChatInput({ value, onChange, onSend, isCompact }) {
  const { isRecording, formattedTime, startRecording, cancelRecording, sendRecording } = useVoiceInput((text) => {
    onChange(text);
  });

  const { ghostText, acceptCompletion } = useAutoComplete(value, isRecording);

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && ghostText) {
      e.preventDefault();
      onChange(acceptCompletion());
    } else if (e.key === "Enter" && value.trim()) {
      onSend();
    }
  };

  const handleSendRecording = () => {
    sendRecording();
    setTimeout(() => onSend(), 100);
  };

  if (isRecording) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: "2px solid #CCC", borderRadius: 16, padding: isCompact ? "10px 12px" : "12px 16px", animation: "recording-pulse 2s ease-in-out infinite" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D44", animation: "rec-dot 1s ease-in-out infinite" }} />
        <span style={{ fontSize: 12, color: "#777", fontWeight: 500, minWidth: 32 }}>{formattedTime}</span>
        <VoiceWaveform />
        <button onClick={cancelRecording} style={{ ...iBtnS, color: "#666" }}><IconPlayerStop size={16} /></button>
        <button onClick={handleSendRecording} style={{ background: "#1A1A1A", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, color: "#FFF", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Отправить</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF", border: "2px solid #D4D4D4", borderRadius: 16, padding: isCompact ? "8px 12px" : "10px 16px" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, fontSize: isCompact ? 13 : 14, color: "transparent", pointerEvents: "none", whiteSpace: "nowrap", overflow: "hidden", fontFamily: "inherit", lineHeight: "normal" }}>
          {value}<span style={{ color: "#CCC" }}>{ghostText}</span>
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} placeholder="Напишите сообщение..."
          style={{ width: "100%", border: "none", outline: "none", fontSize: isCompact ? 13 : 14, color: "#1A1A1A", background: "transparent", fontFamily: "inherit", position: "relative", zIndex: 1 }} />
      </div>
      {ghostText && <span style={{ fontSize: 10, color: "#AAA", background: "#F5F5F5", borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap", border: "1px solid #E0E0E0", fontWeight: 500, flexShrink: 0 }}>Tab ↹</span>}
      <button onClick={startRecording} style={{ ...iBtnS, color: "#888" }}><IconMicrophone size={18} /></button>
      <button style={{ ...iBtnS, color: "#999" }}><IconPaperclip size={18} /></button>
      <button onClick={() => value.trim() && onSend()} disabled={!value.trim()} style={{ ...iBtnS, color: value.trim() ? "#1A1A1A" : "#CCC" }}><IconSend size={20} /></button>
    </div>
  );
}
```

- [ ] **Step 5: Создать src/components/chat/MessageList.jsx**

```jsx
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function MessageList({ messages, isCompact }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isCompact ? "12px 14px" : "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} isCompact={isCompact} />
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Создать src/components/chat/ChatContent.jsx**

```jsx
import { useRef, useEffect } from "react";
import CdekAiLogo from "../common/CdekAiLogo.jsx";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";
import SourcesSection from "../message-content/SourcesSection.jsx";
import CategoryGrid from "../suggestions/CategoryGrid.jsx";
import FollowUpList from "../suggestions/FollowUpList.jsx";

export default function ChatContent({ messages, inputValue, setInputValue, handleSend, isCompact, showGreeting, onQuestionSelect, hasUserSent }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const lastAst = [...messages].reverse().find((m) => m.role === "assistant" && !m.isTyping);
  const lastType = lastAst?.responseType || null;
  const lastDone = messages.length > 0 && messages[messages.length - 1].role === "assistant" && !messages[messages.length - 1].isTyping;

  return (
    <>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isCompact ? "12px 14px" : "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {showGreeting && !hasUserSent && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isCompact ? 14 : 20 }}>
              <CdekAiLogo size={isCompact ? 28 : 36} />
              <span style={{ fontSize: 12, color: "#999" }}>Сегодня</span>
            </div>
            <h2 style={{ fontSize: isCompact ? 16 : 22, fontWeight: 600, color: "#1A1A1A", margin: "0 0 16px 0", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
              Здравствуйте! Я ИИ-помощник СДЭК. Чем могу помочь?
            </h2>
          </div>
        )}
        {(hasUserSent ? messages.filter((m) => m.id !== 1) : []).map((msg) => (
          <MessageBubble key={msg.id} message={msg} isCompact={isCompact} />
        ))}
        {hasUserSent && lastDone && lastType && <SourcesSection isCompact={isCompact} />}
        {!hasUserSent && <CategoryGrid onSelect={onQuestionSelect} isCompact={isCompact} />}
        {hasUserSent && lastDone && lastType && <FollowUpList responseType={lastType} onSelect={onQuestionSelect} isCompact={isCompact} />}
      </div>
      <div style={{ padding: isCompact ? "8px 12px 12px" : "8px 20px 16px" }}>
        <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} isCompact={isCompact} />
      </div>
    </>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/chat/
git commit -m "refactor: extract chat components — MessageBubble, ChatInput, ChatContent, TypingIndicator, VoiceWaveform"
```

---

## Task 7: Вынести компоненты подсказок

**Files:**
- Create: `src/components/suggestions/CategoryGrid.jsx`
- Create: `src/components/suggestions/FollowUpList.jsx`
- Create: `src/components/suggestions/SuggestionChip.jsx`

- [ ] **Step 1: Создать src/components/suggestions/CategoryGrid.jsx**

```jsx
import { useState } from "react";
import { CDEK_ACTIONS } from "../../data/categories.js";
import { ShoppingCards, ProductOrder } from "../message-content/ProductCard.jsx";

export default function CategoryGrid({ onSelect, isCompact }) {
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (selectedProduct) {
    return <ProductOrder product={selectedProduct} onBack={() => setSelectedProduct(null)} isCompact={isCompact} />;
  }
  if (shoppingOpen) {
    return <ShoppingCards onOrder={(p) => setSelectedProduct(p)} isCompact={isCompact} />;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {CDEK_ACTIONS.map((a, i) => (
        <button key={i}
          onClick={() => a.shopping ? setShoppingOpen(true) : onSelect(a.q)}
          style={{
            background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 14,
            padding: isCompact ? "10px 8px" : "14px 10px",
            display: "flex", flexDirection: "column", alignItems: "flex-start",
            gap: 6, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            transition: "all 0.18s", position: "relative",
          }}>
          {a.badge && (
            <span style={{
              position: "absolute", top: 6, right: 6,
              background: "#1A1A1A", color: "#FFF",
              fontSize: 8, fontWeight: 700, padding: "2px 5px",
              borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{a.badge}</span>
          )}
          <span style={{ fontSize: isCompact ? 18 : 22, lineHeight: 1 }}>{a.icon}</span>
          <span style={{ fontSize: isCompact ? 10 : 11, fontWeight: 500, color: "#374151", lineHeight: 1.3 }}>{a.label}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Создать src/components/suggestions/FollowUpList.jsx**

```jsx
import { IconChevronRight } from "@tabler/icons-react";
import { FOLLOW_UP_QUESTIONS } from "../../data/chatHistory.js";

export default function FollowUpList({ responseType, onSelect, isCompact }) {
  const list = FOLLOW_UP_QUESTIONS[responseType] || FOLLOW_UP_QUESTIONS.default;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      {list.map((q, i) => (
        <button key={i} onClick={() => onSelect(q)} style={{
          background: "transparent", border: "none", padding: isCompact ? "10px 4px" : "12px 4px",
          fontSize: isCompact ? 12 : 13, color: "#444", textAlign: "left", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #F0F0F0", transition: "all 0.15s", fontFamily: "inherit",
        }}>
          <span>{q}</span>
          <IconChevronRight size={14} />
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Создать src/components/suggestions/SuggestionChip.jsx (заглушка для Figma)**

```jsx
export default function SuggestionChip({ text, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "#F5F5F5", border: "1px solid #E8E8E8", borderRadius: 20,
      padding: "8px 16px", fontSize: 13, color: "#444", cursor: "pointer",
      fontFamily: "inherit", transition: "all 0.15s",
    }}>
      {text}
    </button>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/suggestions/
git commit -m "refactor: extract suggestion components — CategoryGrid, FollowUpList, SuggestionChip"
```

---

## Task 8: Вынести компоненты sidebar

**Files:**
- Create: `src/components/sidebar/HistorySidebar.jsx`
- Create: `src/components/sidebar/HistoryItem.jsx`
- Create: `src/components/sidebar/HistorySearch.jsx`

- [ ] **Step 1: Создать src/components/sidebar/HistorySearch.jsx**

```jsx
import { IconSearch } from "@tabler/icons-react";

export default function HistorySearch({ value, onChange }) {
  return (
    <div style={{ padding: "0 12px 8px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, background: "#FFF",
        border: "1px solid #E0E0E0", borderRadius: 10, padding: "6px 10px",
      }}>
        <IconSearch size={15} />
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск по истории..."
          style={{ border: "none", outline: "none", fontSize: 12, flex: 1, background: "transparent", fontFamily: "inherit", color: "#1A1A1A" }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Создать src/components/sidebar/HistoryItem.jsx**

```jsx
import { IconMessage, IconDotsVertical } from "@tabler/icons-react";

const menuItemStyle = {
  width: "100%", textAlign: "left", background: "none", border: "none",
  padding: "8px 12px", fontSize: 12, color: "#333", cursor: "pointer",
  fontFamily: "inherit", transition: "background 0.15s",
};

export default function HistoryItem({ chat, activeChat, onSelectChat, menuOpenId, setMenuOpenId }) {
  return (
    <div style={{ position: "relative" }} onMouseLeave={() => setMenuOpenId(null)}>
      <button onClick={() => onSelectChat(chat.id)} style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%",
        background: activeChat === chat.id ? "#EBEBEB" : "transparent",
        border: "none", borderRadius: 8, padding: "9px 8px", textAlign: "left",
        cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit",
        position: "relative", paddingRight: 32,
      }}>
        <IconMessage size={14} />
        <span style={{
          fontSize: 12, color: "#333", overflow: "hidden",
          whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1,
          fontWeight: activeChat === chat.id ? 600 : 400,
        }}>{chat.title}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === chat.id ? null : chat.id); }}
        style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", color: "#999", cursor: "pointer",
          padding: 4, borderRadius: 4, display: "flex", alignItems: "center",
        }}>
        <IconDotsVertical size={14} />
      </button>
      {menuOpenId === chat.id && (
        <div style={{
          position: "absolute", top: "100%", right: 8, zIndex: 100,
          background: "#FFF", border: "1px solid #EBEBEB", borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0", minWidth: 160,
        }}>
          <button style={menuItemStyle} onClick={() => setMenuOpenId(null)}>Добавить в Избранное</button>
          <button style={menuItemStyle} onClick={() => setMenuOpenId(null)}>Переименовать беседу</button>
          <button style={{ ...menuItemStyle, color: "#EF4444" }} onClick={() => setMenuOpenId(null)}>Удалить беседу</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Создать src/components/sidebar/HistorySidebar.jsx**

```jsx
import { IconMenu2, IconEdit, IconPin } from "@tabler/icons-react";
import { useChatHistory } from "../../hooks/useChatHistory.js";
import HistorySearch from "./HistorySearch.jsx";
import HistoryItem from "./HistoryItem.jsx";

const iconOnlyBtn = {
  background: "none", border: "none", cursor: "pointer", color: "#777",
  padding: 6, borderRadius: 8, display: "flex", alignItems: "center",
};

export default function HistorySidebar({ onNewChat, onSelectChat, activeChat, collapsed, onToggle }) {
  const { filteredChats, pinnedChats, groupedChats, searchQuery, setSearchQuery, menuOpenId, setMenuOpenId } = useChatHistory();

  if (collapsed) {
    return (
      <div style={{
        width: 48, height: "100%", background: "#FAFAFA", borderRight: "1px solid #EBEBEB",
        display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 8, flexShrink: 0,
      }}>
        <button onClick={onToggle} style={iconOnlyBtn} title="Развернуть"><IconMenu2 size={18} /></button>
        <button onClick={onNewChat} style={iconOnlyBtn} title="Новый чат"><IconEdit size={16} /></button>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", height: "100%", background: "#FAFAFA", borderRight: "1px solid #EBEBEB",
      display: "flex", flexDirection: "column", flexShrink: 0, fontFamily: "'PT Sans', sans-serif",
    }}>
      <div style={{ padding: "12px 12px 8px", display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={onToggle} style={iconOnlyBtn} title="Свернуть"><IconMenu2 size={18} /></button>
        <div style={{ flex: 1 }} />
        <button onClick={onNewChat} style={{
          display: "flex", alignItems: "center", gap: 6, background: "#1A1A1A",
          color: "#FFF", border: "none", borderRadius: 10, padding: "7px 14px",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>
          <IconEdit size={16} /> Новый чат
        </button>
      </div>

      <HistorySearch value={searchQuery} onChange={setSearchQuery} />

      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        {pinnedChats.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 8px 4px", display: "flex", alignItems: "center", gap: 4 }}>
              <IconPin size={12} /> Избранное
            </div>
            {pinnedChats.map((c) => (
              <HistoryItem key={c.id} chat={c} activeChat={activeChat} onSelectChat={onSelectChat} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />
            ))}
          </div>
        )}

        {Object.entries(groupedChats).map(([date, chats]) => (
          <div key={date}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 8px 4px" }}>{date}</div>
            {chats.map((c) => (
              <HistoryItem key={c.id} chat={c} activeChat={activeChat} onSelectChat={onSelectChat} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />
            ))}
          </div>
        ))}

        {filteredChats.length === 0 && (
          <div style={{ padding: 16, fontSize: 12, color: "#AAA", textAlign: "center" }}>Ничего не найдено</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sidebar/
git commit -m "refactor: extract sidebar components — HistorySidebar, HistoryItem, HistorySearch"
```

---

## Task 9: Вынести layouts и собрать App.jsx

**Files:**
- Create: `src/layouts/FullPageLayout.jsx`
- Create: `src/layouts/SidebarLayout.jsx`
- Create: `src/layouts/FloatLayout.jsx`
- Create: `src/layouts/EmbeddedLayout.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Создать src/layouts/FullPageLayout.jsx**

```jsx
import { useState } from "react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";

export default function FullPageLayout(props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", fontFamily: "'PT Sans', sans-serif" }}>
      <div style={{ width: sidebarCollapsed ? 48 : 260, height: "100%", flexShrink: 0 }}>
        <HistorySidebar
          onNewChat={props.onNewChat}
          onSelectChat={() => {}}
          activeChat="h1"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      <div style={{
        flex: 1, height: "100%",
        background: "linear-gradient(180deg, #F5F5F5 0%, #FAFAFA 30%, #FFF 100%)",
        display: "flex", flexDirection: "column",
      }}>
        <ChatContent {...props} isCompact={false} showGreeting={true} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Создать src/layouts/SidebarLayout.jsx**

```jsx
import { useState } from "react";
import { IconChevronLeft, IconMaximize, IconEdit, IconMinus } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtn = { background: "none", border: "none", cursor: "pointer", color: "#777", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" };

export default function SidebarLayout(props) {
  const [histOpen, setHistOpen] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "'PT Sans', sans-serif" }}>
      <PageSkeleton />
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: 380, borderLeft: "1px solid #E0E0E0",
        background: "#FFF", display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.08)",
        animation: "sidebar-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        {histOpen && (
          <div style={{
            position: "absolute", top: 44, left: 0, right: 0, bottom: 0,
            background: "#FFF", zIndex: 10, display: "flex", flexDirection: "column",
            borderTop: "1px solid #EBEBEB",
          }}>
            <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #EBEBEB", gap: 4 }}>
          <button onClick={() => setHistOpen(!histOpen)} style={hdrBtn} title="История"><IconChevronLeft size={18} /></button>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginLeft: 4 }}>ИИ-чат</span>
          <button onClick={props.onExpand} style={hdrBtn} title="Развернуть"><IconMaximize size={16} /></button>
          <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconEdit size={16} /></button>
          <button onClick={props.onMinimize} style={hdrBtn} title="Свернуть"><IconMinus size={18} /></button>
        </div>
        <ChatContent {...props} isCompact={true} showGreeting={true} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Создать src/layouts/FloatLayout.jsx**

```jsx
import { useState } from "react";
import { IconChevronLeft, IconMaximize, IconEdit, IconMinus } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtn = { background: "none", border: "none", cursor: "pointer", color: "#777", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" };

export default function FloatLayout(props) {
  const [isOpen, setIsOpen] = useState(props.initialOpen !== false);
  const [histOpen, setHistOpen] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "'PT Sans', sans-serif" }}>
      <PageSkeleton />
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={{
          position: "absolute", bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: "50%", background: "#1A1A1A", border: "none", cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center",
          justifyContent: "center", animation: "fab-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", transition: "transform 0.2s",
        }}>
          <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>AI</span>
        </button>
      )}
      {isOpen && (
        <div style={{
          position: "absolute", bottom: 24, right: 24, width: 370, height: 520,
          background: "#FFF", borderRadius: 20,
          boxShadow: "0 12px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "float-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)", border: "1px solid #E0E0E0",
        }}>
          {histOpen && (
            <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: "#FFF", zIndex: 10, borderTop: "1px solid #EBEBEB", borderRadius: "0 0 20px 20px", overflow: "hidden" }}>
              <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #EBEBEB", gap: 4 }}>
            <button onClick={() => setHistOpen(!histOpen)} style={hdrBtn} title="История"><IconChevronLeft size={18} /></button>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginLeft: 4 }}>ИИ-чат</span>
            <button onClick={props.onExpand} style={hdrBtn} title="Развернуть"><IconMaximize size={16} /></button>
            <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconEdit size={16} /></button>
            <button onClick={() => setIsOpen(false)} style={hdrBtn} title="Свернуть"><IconMinus size={18} /></button>
          </div>
          <ChatContent {...props} isCompact={true} showGreeting={true} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Создать src/layouts/EmbeddedLayout.jsx**

```jsx
import { useState } from "react";
import { IconChevronLeft, IconEdit, IconSettings, IconLayoutSidebar } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtn = { background: "none", border: "none", cursor: "pointer", color: "#777", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" };
const hdrCircleBtn = { background: "#F5F5F5", border: "none", cursor: "pointer", color: "#1A1A1A", padding: 10, borderRadius: "50%", display: "flex", alignItems: "center", transition: "all 0.2s" };

export default function EmbeddedLayout(props) {
  const [histOpen, setHistOpen] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFF", position: "relative", fontFamily: "'PT Sans', sans-serif" }}>
      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, background: "#F9FAFB", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
          <button style={hdrCircleBtn} title="Настройки"><IconSettings size={20} /></button>
          <button onClick={() => setChatVisible(!chatVisible)} style={{ ...hdrCircleBtn, background: chatVisible ? "#EBEBEB" : "none" }} title={chatVisible ? "Скрыть правое меню" : "Показать правое меню"}>
            <IconLayoutSidebar size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <PageSkeleton />
        </div>
      </div>

      {chatVisible && (
        <div style={{
          width: 400, margin: 12, borderRadius: 24,
          display: "flex", flexDirection: "column", background: "#FFF",
          position: "relative", overflow: "hidden",
          border: "1px solid #E5E7EB",
          boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
          animation: "msg-appear 0.3s ease-out",
        }}>
          {histOpen && (
            <div style={{
              position: "absolute", top: 44, left: 0, right: 0, bottom: 0,
              background: "#FFF", zIndex: 10, display: "flex", flexDirection: "column",
              borderTop: "1px solid #EBEBEB",
            }}>
              <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #EBEBEB", gap: 4 }}>
            <button onClick={() => setHistOpen(!histOpen)} style={hdrBtn} title="История"><IconChevronLeft size={18} /></button>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#111827", marginLeft: 4 }}>ИИ-чат</span>
            <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconEdit size={16} /></button>
          </div>
          <ChatContent {...props} isCompact={true} showGreeting={true} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Переписать src/App.jsx — собрать всё вместе**

```jsx
import { useState, useCallback } from "react";
import { useChat } from "./hooks/useChat.js";
import CdekAiLogo from "./components/common/CdekAiLogo.jsx";
import FullPageLayout from "./layouts/FullPageLayout.jsx";
import SidebarLayout from "./layouts/SidebarLayout.jsx";
import FloatLayout from "./layouts/FloatLayout.jsx";
import EmbeddedLayout from "./layouts/EmbeddedLayout.jsx";

const VIEW_MODES = [
  { id: "fullpage", label: "Весь экран" },
  { id: "sidebar", label: "Боковая панель" },
  { id: "float", label: "Плавающий" },
  { id: "embedded", label: "Встроенный" },
];

export default function App() {
  const [viewMode, setViewMode] = useState("fullpage");
  const [floatInitialOpen, setFloatInitialOpen] = useState(true);
  const chat = useChat();

  const shared = {
    messages: chat.messages,
    inputValue: chat.inputValue,
    setInputValue: chat.setInputValue,
    handleSend: chat.handleSend,
    onQuestionSelect: chat.handleQuestionSelect,
    hasUserSent: chat.hasUserSent,
    onNewChat: chat.resetChat,
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#1A1A1A", fontFamily: "'PT Sans', sans-serif", flexShrink: 0 }}>
        <CdekAiLogo size={26} />
        <span style={{ color: "#FFF", fontSize: 14, fontWeight: 600, marginRight: 16 }}>СДЭК AI-помощник</span>
        {VIEW_MODES.map((m) => (
          <button key={m.id} onClick={() => { if (m.id === "float") setFloatInitialOpen(true); setViewMode(m.id); chat.resetChat(); }} style={{
            background: viewMode === m.id ? "#444" : "rgba(255,255,255,0.06)",
            color: viewMode === m.id ? "#FFF" : "#888",
            border: viewMode === m.id ? "none" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{m.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {viewMode === "fullpage" && <FullPageLayout {...shared} />}
        {viewMode === "sidebar" && <SidebarLayout {...shared} onMinimize={() => { setFloatInitialOpen(false); setViewMode("float"); }} onExpand={() => setViewMode("fullpage")} />}
        {viewMode === "float" && <FloatLayout {...shared} initialOpen={floatInitialOpen} onExpand={() => setViewMode("fullpage")} />}
        {viewMode === "embedded" && <EmbeddedLayout {...shared} onClose={() => setViewMode("fullpage")} onMinimize={() => setViewMode("float")} onExpand={() => setViewMode("fullpage")} />}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Проверить что приложение работает**

```bash
npm run dev
```

Expected: все 4 режима работают, чат отправляет сообщения, история отображается, подсказки кликабельны, автокомплит работает.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ src/App.jsx
git commit -m "refactor: extract 4 layout components, wire up modular App.jsx"
```

---

## Task 10: Замена inline-стилей на Tailwind CSS

**Files:**
- Modify: все компоненты в `src/components/` и `src/layouts/`

Этот таск выполняется итеративно — по одному компоненту за раз. Порядок: сначала мелкие leaf-компоненты, затем составные.

- [ ] **Step 1: Мигрировать CdekAiLogo на Tailwind**

Файл: `src/components/common/CdekAiLogo.jsx`

```jsx
import avatarImg from "../../assets/avatar.png";

export default function CdekAiLogo({ size = 32 }) {
  return (
    <img
      src={avatarImg}
      alt="AI Assistant"
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
```

- [ ] **Step 2: Мигрировать TypingIndicator на Tailwind**

Файл: `src/components/chat/TypingIndicator.jsx`

```jsx
import { useState, useEffect } from "react";
import { TYPING_PHRASES } from "../../data/mockResponses.js";

export default function TypingIndicator() {
  const [phrase, setPhrase] = useState(TYPING_PHRASES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase(TYPING_PHRASES[Math.floor(Math.random() * TYPING_PHRASES.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-2 italic text-gray-400 text-[13px] flex items-center gap-2">
      <div className="flex gap-[3px]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-gray-400"
            style={{ animation: `typing-bounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
      {phrase}
    </div>
  );
}
```

- [ ] **Step 3: Мигрировать VoiceWaveform на Tailwind**

Файл: `src/components/chat/VoiceWaveform.jsx`

```jsx
export default function VoiceWaveform() {
  return (
    <div className="flex items-center gap-0.5 h-6 flex-1">
      {Array.from({ length: 32 }).map((_, i) => (
        <div key={i} className="w-[3px] rounded-sm bg-gray-600"
          style={{ animation: `waveform ${0.6 + Math.random() * 0.6}s ease-in-out ${i * 0.03}s infinite alternate`, minHeight: 3 }} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Мигрировать остальные компоненты**

Повторить паттерн для каждого компонента: заменить `style={{}}` на Tailwind-классы. Для динамических значений (зависящих от props вроде `isCompact`) использовать тернарные операторы в `className`. Для значений, которых нет в Tailwind (кастомные анимации, точные пиксели), оставить `style={{}}`.

Порядок миграции:
1. `HistorySearch.jsx`
2. `HistoryItem.jsx`
3. `HistorySidebar.jsx`
4. `AttachmentLink.jsx`
5. `SourcesSection.jsx`
6. `AIResponseActions.jsx`
7. `SuggestionChip.jsx`
8. `FollowUpList.jsx`
9. `CategoryGrid.jsx`
10. `CodeBlock.jsx`
11. `ProductCard.jsx`
12. `MessageBubble.jsx`
13. `ChatInput.jsx`
14. `ChatContent.jsx`
15. `PageSkeleton.jsx`
16. `FullPageLayout.jsx`
17. `SidebarLayout.jsx`
18. `FloatLayout.jsx`
19. `EmbeddedLayout.jsx`
20. `App.jsx`

- [ ] **Step 5: Проверить что всё работает**

```bash
npm run dev
```

Expected: визуально идентично предыдущей версии, все режимы работают.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "style: migrate all components from inline styles to Tailwind CSS"
```

---

## Task 11: Замена кастомных элементов на PrimeReact-компоненты

**Files:**
- Modify: компоненты в `src/components/` и `src/layouts/`

- [ ] **Step 1: Заменить кнопки в HistorySidebar на Button из @cdek/primereact**

Файл: `src/components/sidebar/HistorySidebar.jsx`

Кнопка "Новый чат":
```jsx
import { Button } from "@cdek/primereact";

// Заменить кастомную кнопку "Новый чат" на:
<Button severity="primary" size="small" label="Новый чат" icon={<IconEdit size={16} />} onClick={onNewChat} />
```

- [ ] **Step 2: Заменить поле поиска на InputText из @cdek/primereact**

Файл: `src/components/sidebar/HistorySearch.jsx`

```jsx
import { InputText } from "@cdek/primereact";
import { IconSearch } from "@tabler/icons-react";

export default function HistorySearch({ value, onChange }) {
  return (
    <div className="px-3 pb-2">
      <span className="p-input-icon-left w-full">
        <IconSearch size={15} />
        <InputText
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск по истории..."
          className="w-full text-xs"
        />
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Заменить аватар на Avatar из primereact**

Файл: `src/components/common/CdekAiLogo.jsx`

```jsx
import { Avatar } from "primereact/avatar";
import avatarImg from "../../assets/avatar.png";

export default function CdekAiLogo({ size = 32 }) {
  const primeSize = size >= 36 ? "large" : size >= 28 ? "normal" : "normal";
  return (
    <Avatar image={avatarImg} shape="circle" size={primeSize} className="shrink-0"
      style={{ width: size, height: size }} />
  );
}
```

- [ ] **Step 4: Заменить Tooltip на primereact Tooltip**

В компонентах, использующих `title` атрибуты на кнопках действий (`MessageBubble.jsx`), добавить:

```jsx
import { Tooltip } from "primereact/tooltip";

// Заменить title="Копировать" на:
<button data-pr-tooltip="Копировать" className="action-btn" ...>
<Tooltip target=".action-btn" position="top" />
```

- [ ] **Step 5: Заменить Divider в HistorySidebar**

Для разделителей между группами дат использовать `<Divider />` из primereact там, где уместно.

- [ ] **Step 6: Заменить InputText в ChatInput на primereact InputText**

Файл: `src/components/chat/ChatInput.jsx`

Заменить нативный `<input>` на `<InputText>` из `@cdek/primereact`, сохраняя ghost text overlay.

- [ ] **Step 7: Проверить что всё работает**

```bash
npm run dev
```

Expected: все PrimeReact-компоненты рендерятся с CDEK-темой, функциональность сохранена.

- [ ] **Step 8: Commit**

```bash
git add src/
git commit -m "feat: replace custom UI elements with PrimeReact components"
```

---

## Task 12: Имплементация AI-компонентов из Figma

**Files:**
- Modify: `src/components/ai/FeedMessage.jsx`
- Modify: `src/components/ai/HintCard.jsx`
- Modify: `src/components/suggestions/SuggestionChip.jsx`

- [ ] **Step 1: Получить дизайн-контекст из Figma**

Используя Figma MCP tools, получить design context для каждого из 3 компонентов:
- `Feed.Message` — найти через `search_design_system` или `get_design_context`
- `Card.Hint` — аналогично
- `Suggestion` — аналогично

Извлечь: padding, spacing, border-radius, цвета, типографику, состояния.

- [ ] **Step 2: Имплементировать FeedMessage**

Файл: `src/components/ai/FeedMessage.jsx`

Обёртка над `MessageBubble` со стилизацией по токенам из Figma. Конкретный код будет определён после получения design context в Step 1.

```jsx
import MessageBubble from "../chat/MessageBubble.jsx";

export default function FeedMessage({ message, isCompact }) {
  return (
    <div className="feed-message">
      <MessageBubble message={message} isCompact={isCompact} />
    </div>
  );
}
```

- [ ] **Step 3: Имплементировать HintCard**

Файл: `src/components/ai/HintCard.jsx`

На базе `<Card>` из primereact, стилизация по Figma `Card.Hint`.

```jsx
import { Card } from "primereact/card";

export default function HintCard({ icon, title, description, onClick }) {
  return (
    <Card className="hint-card cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-semibold text-sm">{title}</div>
          {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Обновить SuggestionChip по Figma**

Файл: `src/components/suggestions/SuggestionChip.jsx`

На базе `<Chip>` из primereact, стилизация по Figma `Suggestion`.

```jsx
import { Chip } from "primereact/chip";

export default function SuggestionChip({ text, onClick }) {
  return (
    <Chip label={text} className="suggestion-chip cursor-pointer" onClick={onClick} />
  );
}
```

- [ ] **Step 5: Интегрировать AI-компоненты**

Обновить `ChatContent.jsx` и `CategoryGrid.jsx` чтобы использовать `FeedMessage`, `HintCard`, `SuggestionChip` вместо текущих аналогов.

- [ ] **Step 6: Проверить**

```bash
npm run dev
```

Expected: AI-компоненты рендерятся по Figma-дизайну, стилистически согласованы с остальным UI.

- [ ] **Step 7: Commit**

```bash
git add src/components/ai/ src/components/suggestions/SuggestionChip.jsx src/components/chat/ChatContent.jsx src/components/suggestions/CategoryGrid.jsx
git commit -m "feat: implement Figma AI components — FeedMessage, HintCard, SuggestionChip"
```

---

## Task 13: Финализация — очистка и удаление legacy

**Files:**
- Delete: `ai-assistant_1.jsx`
- Delete: `new.jsx`
- Delete: `main.jsx` (корневой)
- Delete: `avatar.png` (корневой)
- Modify: `package.json` (если нужно)

- [ ] **Step 1: Удалить legacy-файлы**

```bash
rm ai-assistant_1.jsx new.jsx main.jsx avatar.png
```

- [ ] **Step 2: Проверить что приложение работает без legacy-файлов**

```bash
npm run dev
```

Expected: приложение запускается и работает полностью из `src/`.

- [ ] **Step 3: Проверить билд**

```bash
npm run build
```

Expected: билд проходит без ошибок и предупреждений.

- [ ] **Step 4: Проверить все 4 режима отображения**

Ручная проверка в браузере:
1. Full Page — сайдбар сворачивается/разворачивается, чат работает
2. Sidebar — панель справа, история открывается
3. Float — виджет открывается/закрывается, FAB кнопка
4. Embedded — правая панель скрывается/показывается

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove legacy monolithic files, migration complete"
```
