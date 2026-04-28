export const CATEGORIES = [
  { id: "popular", label: "Популярные вопросы" },
  { id: "tracking", label: "Отслеживание" },
  { id: "delivery", label: "Доставка" },
  { id: "offices", label: "Пункты выдачи" },
  { id: "tariffs", label: "Тарифы" },
];

export const CDEK_ACTIONS = [
  { icon: "📦", label: "Отследи посылку", badge: null, q: "Где моя посылка?", shopping: false },
  { icon: "🛍️", label: "СДЭК Шоппинг", badge: "новое", q: null, shopping: true },
  { icon: "💰", label: "Рассчитай цену", badge: null, q: "Как рассчитать стоимость доставки?", shopping: false },
  { icon: "📌", label: "Найди ПВЗ", badge: null, q: "Ближайший пункт выдачи СДЭК", shopping: false },
  { icon: "👨‍💻", label: "API CDEK", badge: null, q: "Как подключить API СДЭК для разработчиков?", shopping: false },
  { icon: "📖", label: "CDEK Wiki", badge: null, q: "Создай отчёт по вопросам в https://cdek.me/questions2", shopping: false },
];

export const SUGGESTED_QUESTIONS = [
  "Где моя посылка?",
  "🛍️ Товары в СДЭК Шоппинг",
  "Как рассчитать стоимость доставки?",
  "Ближайший пункт выдачи СДЭК",
  "Как оформить возврат?",
  "Сроки доставки между городами",
];
