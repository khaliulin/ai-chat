import { useState, useRef, useEffect, useCallback } from "react";
import avatarImg from "./avatar.png";

// ─── CDEK Data ─────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: "popular", label: "Популярные вопросы" },
    { id: "tracking", label: "Отслеживание" },
    { id: "delivery", label: "Доставка" },
    { id: "offices", label: "Пункты выдачи" },
    { id: "tariffs", label: "Тарифы" },
];

const SOURCES = [
    { label: "СДЭК — отслеживание посылок по трек-номеру" },
    { label: "Тарифы и сроки доставки СДЭК 2024" },
    { label: "Пункты выдачи СДЭК — адреса и режим работы" },
    { label: "Как оформить возврат посылки через СДЭК" },
    { label: "Международная доставка СДЭК — условия и тарифы" },
];

const SUGGESTED_QUESTIONS = [
    "Где моя посылка?",
    "🛍️ Товары в СДЭК Шоппинг",
    "Как рассчитать стоимость доставки?",
    "Ближайший пункт выдачи СДЭК",
    "Как оформить возврат?",
    "Сроки доставки между городами",
];

const SHOPPING_PRODUCTS = [
    { id: 1, name: "Наушники Sony WH-1000XM5", price: "29 990 ₽", oldPrice: "36 990 ₽", badge: "−19%", rating: 4.8, reviews: 1240, img: "🎧", desc: "Беспроводные, шумоподавление, до 30 ч" },
    { id: 2, name: "Смартфон Samsung Galaxy A55", price: "34 990 ₽", oldPrice: null, badge: "Хит", rating: 4.7, reviews: 890, img: "📱", desc: '6.6", 5G, 128 ГБ, камера 50 МП' },
    { id: 3, name: "Кроссовки Nike Air Max 270", price: "8 990 ₽", oldPrice: "12 490 ₽", badge: "−28%", rating: 4.9, reviews: 3210, img: "👟", desc: "Размеры 36–47, несколько цветов" },
    { id: 4, name: "Рюкзак Xiaomi Mi City", price: "3 490 ₽", oldPrice: null, badge: "Новинка", rating: 4.6, reviews: 412, img: "🎒", desc: '15.6", водоотталкивающий, 17 л' },
];

const FOLLOW_UP_QUESTIONS = {
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

const AUTOCOMPLETE_MAP = [
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

// Chat history mock data
const CHAT_HISTORY = [
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

const INITIAL_MESSAGES = [
    {
        id: 1, role: "assistant",
        text: "Здравствуйте! Я ИИ-помощник СДЭК. Чем могу помочь?",
        time: "9:17", hasAudio: true, responseType: null,
    },
];

const DEMO_RESPONSES = {
    default: { text: "Ой, я как раз изучал этот вопрос! 📚\n\nВот что мне удалось выяснить:\n• Для отслеживания посылки просто напишите её номер (например, CDEK-XXXXXXXXX)\n• Статусы у нас обновляются довольно шустро, каждые пару часов\n• А если что-то застряло больше чем на 3 дня — свистните в поддержку, они разберутся!\n\nЧем ещё могу вас порадовать?", type: "default" },
    tracking: { text: "Ура, нашёл вашу посылочку CDEK-284759163! 📦✨\n\nОна сейчас в пути и бодро проезжает Новосибирск. Ожидаем, что она прибудет к вам уже 15 марта.\n\nКороткая хроника: 10 марта она выехала из Москвы, сейчас на сортировке. Ещё каких-то пару дней — и она ваша! Ждёте?", type: "tracking" },
    delivery: { text: "Давайте посчитаем, во сколько обойдётся доставка! 💰\n\nЦена обычно зависит от того, откуда и куда едем, сколько весим и как сильно торопимся.\n\nНапример:\n• Стандарт (Москва → Питер): от 350 ₽, 2–3 дня в пути.\n• Экспресс (если очень горит): от 590 ₽, доставят на следующий же день!\n\nХотите прикину точный маршрут?", type: "delivery" },
    offices: { text: "О, я знаю отличные места поблизости! 📍\n\nВот самые удобные пункты:\n1. ул. Ленина, 42 — совсем рядом (всего 350 м), работают до 20:00.\n2. пр. Мира, 15 — чуть дальше (800 м), зато открыты каждый день.\n3. ТЦ «Галерея», 2 этаж — если решите совместить с шопингом, работают до 22:00.\n\nТам можно всё примерить и рассмотреть перед получением. Заглянете?", type: "offices" },
};

function getResponseKey(text) {
    const l = text.toLowerCase();
    if (l.includes("посылк") || l.includes("трек") || l.includes("отслед")) return "tracking";
    if (l.includes("стоим") || l.includes("доставк") || l.includes("тариф") || l.includes("рассчит")) return "delivery";
    if (l.includes("пункт") || l.includes("ближ") || l.includes("офис") || l.includes("пвз")) return "offices";
    return "default";
}

// ─── Icons ─────────────────────────────────────────────────────────────
const IconSend = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const IconMic = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>;
const IconStop = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#1A1A1A"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>;
const IconAttach = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>;
const IconClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconMinimize = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconExpand = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>;
const IconBack = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
const IconNewChat = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconThumbUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>;
const IconThumbDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>;
const IconCopy = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
const IconShare = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
const IconAudio = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>;
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconChat = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>;
const IconMagic = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8 19 13" /><path d="M15 9h0" /><path d="M17.8 6.2 19 5" /><path d="m3 21 9-9" /><path d="M12.2 6.2 11 5" /></svg>;
const IconMoreVertical = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>;
const IconSidebarToggle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M15 3v18" /></svg>;
const IconPin = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-2l-1.5-1.5V6a5.5 5.5 0 0 0-11 0v7.5L5 15v2z" /></svg>;
const IconDots = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>;
const IconSettings = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;

// ─── CDEK AI Logo ──────────────────────────────────────────────────────
const CdekAiLogo = ({ size = 32 }) => (
    <img
        src={avatarImg}
        alt="AI Assistant"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
);

const TYPING_PHRASES = [
    "Шуршу упаковочной плёнкой...",
    "Ищу вашу посылку под диваном...",
    "Заправляю курьера крепким кофе...",
    "Сверяюсь с секретными картами ПВЗ...",
    "Договариваюсь с таможней на печеньки...",
    "Рассчитываю путь быстрее ветра...",
    "Проверяю, не съел ли кто-то посылку..."
];

const TypingIndicator = () => {
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
                {[0, 1, 2].map((i) => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#999", animation: `typing-bounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />)}
            </div>
            {phrase}
        </div>
    );
};

const VoiceWaveform = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 24, flex: 1 }}>
        {Array.from({ length: 32 }).map((_, i) => <div key={i} style={{ width: 3, borderRadius: 2, background: "#555", animation: `waveform ${0.6 + Math.random() * 0.6}s ease-in-out ${i * 0.03}s infinite alternate`, minHeight: 3 }} />)}
    </div>
);

// ─── Chat History Sidebar ──────────────────────────────────────────────
const HistorySidebar = ({ onNewChat, onSelectChat, activeChat, collapsed, onToggle }) => {
    const [search, setSearch] = useState("");
    const [menuOpenId, setMenuOpenId] = useState(null);
    const filtered = CHAT_HISTORY.filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()));

    const pinned = filtered.filter(c => c.pinned);
    const regular = filtered.filter(c => !c.pinned);

    const groups = {};
    regular.forEach((c) => {
        if (!groups[c.date]) groups[c.date] = [];
        groups[c.date].push(c);
    });

    if (collapsed) {
        return (
            <div style={{
                width: 48, height: "100%", background: "#FAFAFA", borderRight: "1px solid #EBEBEB",
                display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 8, flexShrink: 0,
            }}>
                <button onClick={onToggle} style={iconOnlyBtn} title="Развернуть"><IconMenu /></button>
                <button onClick={onNewChat} style={iconOnlyBtn} title="Новый чат"><IconNewChat /></button>
            </div>
        );
    }

    const HistoryItem = ({ chat }) => (
        <div
            style={{ position: "relative" }}
            onMouseLeave={() => setMenuOpenId(null)}
        >
            <button key={chat.id} onClick={() => onSelectChat(chat.id)} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                background: activeChat === chat.id ? "#EBEBEB" : "transparent",
                border: "none", borderRadius: 8, padding: "9px 8px", textAlign: "left",
                cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit",
                position: "relative", paddingRight: 32
            }}
                onMouseEnter={(e) => { if (activeChat !== chat.id) e.currentTarget.style.background = "#F0F0F0"; }}
                onMouseLeave={(e) => { if (activeChat !== chat.id) e.currentTarget.style.background = "transparent"; }}
            >
                <IconChat />
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
                    padding: 4, borderRadius: 4, display: "flex", alignItems: "center"
                }}
            >
                <IconMoreVertical />
            </button>

            {menuOpenId === chat.id && (
                <div style={{
                    position: "absolute", top: "100%", right: 8, zIndex: 100,
                    background: "#FFF", border: "1px solid #EBEBEB", borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0", minWidth: 160
                }}>
                    <button style={menuItemStyle} onClick={() => setMenuOpenId(null)}>Добавить в Избранное</button>
                    <button style={menuItemStyle} onClick={() => setMenuOpenId(null)}>Переименовать беседу</button>
                    <button style={{ ...menuItemStyle, color: "#EF4444" }} onClick={() => setMenuOpenId(null)}>Удалить беседу</button>
                </div>
            )}
        </div>
    );

    return (
        <div style={{
            width: "100%", height: "100%", background: "#FAFAFA", borderRight: "1px solid #EBEBEB",
            display: "flex", flexDirection: "column", flexShrink: 0, fontFamily: "'PT Sans', sans-serif",
        }}>
            {/* Header */}
            <div style={{ padding: "12px 12px 8px", display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={onToggle} style={iconOnlyBtn} title="Свернуть"><IconMenu /></button>
                <div style={{ flex: 1 }} />
                <button onClick={onNewChat} style={{
                    display: "flex", alignItems: "center", gap: 6, background: "#1A1A1A",
                    color: "#FFF", border: "none", borderRadius: 10, padding: "7px 14px",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                    <IconNewChat /> Новый чат
                </button>
            </div>

            {/* Search */}
            <div style={{ padding: "0 12px 8px" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 6, background: "#FFF",
                    border: "1px solid #E0E0E0", borderRadius: 10, padding: "6px 10px",
                }}>
                    <IconSearch />
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск по истории..."
                        style={{ border: "none", outline: "none", fontSize: 12, flex: 1, background: "transparent", fontFamily: "inherit", color: "#1A1A1A" }}
                    />
                </div>
            </div>

            {/* History list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
                {pinned.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 8px 4px", display: "flex", alignItems: "center", gap: 4 }}>
                            <IconPin /> Избранное
                        </div>
                        {pinned.map(c => <HistoryItem key={c.id} chat={c} />)}
                    </div>
                )}

                {Object.entries(groups).map(([date, chats]) => (
                    <div key={date}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 8px 4px" }}>{date}</div>
                        {chats.map((c) => (
                            <HistoryItem key={c.id} chat={c} />
                        ))}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div style={{ padding: 16, fontSize: 12, color: "#AAA", textAlign: "center" }}>Ничего не найдено</div>
                )}
            </div>
        </div>
    );
};

const menuItemStyle = {
    width: "100%", textAlign: "left", background: "none", border: "none",
    padding: "8px 12px", fontSize: 12, color: "#333", cursor: "pointer",
    fontFamily: "inherit", transition: "background 0.15s"
};

const iconOnlyBtn = {
    background: "none", border: "none", cursor: "pointer", color: "#777",
    padding: 6, borderRadius: 8, display: "flex", alignItems: "center",
};

// ─── AI Response Actions ──────────────────────────────────────────────
const AIResponseActions = ({ isCompact, onAction }) => {
    const actions = ["Развернуть мысль", "Короче", "Больше контекста"];
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5",
            border: "1px solid #E8E8E8", borderRadius: 24, padding: "6px 12px", marginTop: 8,
            width: "fit-content", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
        }}>
            <IconMagic />
            <div style={{ display: "flex", gap: 4 }}>
                {actions.map((act) => (
                    <button key={act} onClick={() => onAction(act)} style={{
                        background: "#EBEBEB", border: "none", borderRadius: 8,
                        padding: "6px 12px", fontSize: isCompact ? 11 : 12, color: "#666",
                        fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit"
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#EBEBEB")}
                    >{act}</button>
                ))}
            </div>
            <button style={{ background: "none", border: "none", padding: 4, cursor: "pointer", display: "flex", color: "#999" }}></button>
        </div>
    );
};

// ─── Message Bubble ────────────────────────────────────────────────────
const MessageBubble = ({ message, isCompact }) => {
    const isUser = message.role === "user";
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);

    const handleCopy = () => {
        navigator.clipboard?.writeText(message.text).catch(() => { });
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
                {message.isTyping ? <TypingIndicator /> : message.text}
            </div>
            {!isUser && !message.isTyping && (
                <>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, width: "100%" }}>
                        <button onClick={handleCopy} style={{ ...actionBtnStyle, color: copied ? "#333" : "#999" }} title={copied ? "Скопировано" : "Копировать"}><IconCopy /></button>
                        <button onClick={handleShare} style={actionBtnStyle} title={shared ? "Ссылка скопирована" : "Поделиться"}><IconShare /></button>
                        <button style={actionBtnStyle} title="Прослушать"><IconAudio /></button>
                        <button style={actionBtnStyle} title="Перегенерировать ответ"><IconRefresh /></button>
                        <div style={{ flex: 1 }} />
                        <button style={actionBtnStyle} title="Полезно"><IconThumbUp /></button>
                        <button style={actionBtnStyle} title="Не полезно"><IconThumbDown /></button>
                    </div>
                    <AIResponseActions isCompact={isCompact} onAction={() => { }} />
                </>
            )}
        </div>
    );
};

const actionBtnStyle = {
    background: "none", border: "none", cursor: "pointer", color: "#999",
    padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center", transition: "all 0.15s",
};

// ─── CDEK Shopping Cards ───────────────────────────────────────────────
const ShoppingCards = ({ onOrder, isCompact }) => {
    return (
        <div style={{ animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <div style={{ fontSize: isCompact ? 11 : 12, color: "#999", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>СДЭК Шоппинг — рекомендуем</div>
            <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr", gap: 10 }}>
                {SHOPPING_PRODUCTS.map((p) => (
                    <button key={p.id} onClick={() => onOrder(p)}
                        style={{
                            background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 14,
                            textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                            transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#D1D5DB"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{p.img}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                    <span style={{
                                        fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                                        background: p.badge.startsWith("−") ? "#FEF3C7" : p.badge === "Хит" ? "#DBEAFE" : "#F0FDF4",
                                        color: p.badge.startsWith("−") ? "#92400E" : p.badge === "Хит" ? "#1E40AF" : "#14532D",
                                        textTransform: "uppercase", letterSpacing: "0.04em"
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
};

// ─── Product Order Card ────────────────────────────────────────────────
const ProductOrder = ({ product, onBack, isCompact }) => (
    <div style={{ animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#777", fontSize: isCompact ? 11 : 12, marginBottom: 10, padding: 0, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
            <IconBack /><span>Назад к каталогу</span>
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
                fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s"
            }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#1A1A1A"}
            >Заказать с доставкой СДЭК</button>
        </div>
        <div style={{ fontSize: isCompact ? 10 : 11, color: "#9CA3AF", textAlign: "center" }}>Перейдёте на сайт СДЭК Шоппинг для завершения заказа</div>
    </div>
);

// ─── CDEK Action Cards (start screen) ──────────────────────────────────────
const CDEK_ACTIONS = [
    { icon: "📦", label: "Отследи посылку", badge: null, q: "Где моя посылка?" },
    { icon: "🛍️", label: "СДЭК Шоппинг", badge: "новое", q: null, shopping: true },
    { icon: "💰", label: "Рассчитай цену", badge: null, q: "Как рассчитать стоимость доставки?" },
    { icon: "📌", label: "Найди ПВЗ", badge: null, q: "Ближайший пункт выдачи СДЭК" },
    { icon: "🔄", label: "Оформи возврат", badge: null, q: "Как оформить возврат?" },
    { icon: "⏱️", label: "Сроки доставки", badge: null, q: "Сроки доставки между городами" },
];

const SuggestedQuestions = ({ onSelect, isCompact }) => {
    const [shoppingOpen, setShoppingOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (selectedProduct) {
        return <ProductOrder product={selectedProduct} onBack={() => setSelectedProduct(null)} isCompact={isCompact} />;
    }
    if (shoppingOpen) {
        return <ShoppingCards onOrder={(p) => setSelectedProduct(p)} isCompact={isCompact} />;
    }

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: isCompact ? "repeat(3, 1fr)" : "repeat(3, 1fr)", gap: 8 }}>
                {CDEK_ACTIONS.map((a, i) => (
                    <button key={i}
                        onClick={() => a.shopping ? setShoppingOpen(true) : onSelect(a.q)}
                        style={{
                            background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 14,
                            padding: isCompact ? "10px 8px" : "14px 10px",
                            display: "flex", flexDirection: "column", alignItems: "flex-start",
                            gap: 6, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                            transition: "all 0.18s", position: "relative",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.borderColor = "#D1D5DB"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
                    >
                        {a.badge && (
                            <span style={{
                                position: "absolute", top: 6, right: 6,
                                background: "#1A1A1A", color: "#FFF",
                                fontSize: 8, fontWeight: 700, padding: "2px 5px",
                                borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>{a.badge}</span>
                        )}
                        <span style={{ fontSize: isCompact ? 18 : 22, lineHeight: 1 }}>{a.icon}</span>
                        <span style={{ fontSize: isCompact ? 10 : 11, fontWeight: 500, color: "#374151", lineHeight: 1.3 }}>{a.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};


// ─── Sources ──────────────────────────────────────────────────────────
const SourcesSection = ({ isCompact }) => {
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
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#888", flexShrink: 0 }} />{s.label}
                    </div>
                ))}
                {!expanded && <button onClick={() => setExpanded(true)} style={{
                    background: "#FAFAFA", border: "1px solid #E0E0E0", borderRadius: 20,
                    padding: "5px 12px", fontSize: 11, color: "#777", cursor: "pointer", fontFamily: "inherit",
                }}>← Ещё источники</button>}
            </div>
        </div>
    );
};

// ─── Follow-up List (no cards) ─────────────────────────────────────────
const FollowUpList = ({ responseType, onSelect, isCompact }) => {
    const list = FOLLOW_UP_QUESTIONS[responseType] || FOLLOW_UP_QUESTIONS.default;
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 1, animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            {list.map((q, i) => (
                <button key={i} onClick={() => onSelect(q)} style={{
                    background: "transparent", border: "none", padding: isCompact ? "10px 4px" : "12px 4px",
                    fontSize: isCompact ? 12 : 13, color: "#444", textAlign: "left", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: "1px solid #F0F0F0", transition: "all 0.15s", fontFamily: "inherit",
                }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                ><span>{q}</span><IconChevron /></button>
            ))}
        </div>
    );
};

// ─── Autocomplete ──────────────────────────────────────────────────────
function getAutocompletion(input) {
    if (!input || input.length < 3) return "";
    const lower = input.toLowerCase();
    for (const item of AUTOCOMPLETE_MAP) {
        if (lower.startsWith(item.prefix) && lower.length <= item.prefix.length + 2) {
            return item.completion.slice(lower.length - item.prefix.length);
        }
    }
    return "";
}

// ─── Input Bar ─────────────────────────────────────────────────────────
const InputBar = ({ value, onChange, onSend, isCompact }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef(null);
    const [ghostText, setGhostText] = useState("");

    useEffect(() => {
        if (isRecording) { setGhostText(""); return; }
        setGhostText(getAutocompletion(value));
    }, [value, isRecording]);

    const handleKeyDown = (e) => {
        if (e.key === "Tab" && ghostText) { e.preventDefault(); onChange(value + ghostText); setGhostText(""); }
        else if (e.key === "Enter" && value.trim()) onSend();
    };

    const startRecording = () => {
        setIsRecording(true); setRecordingTime(0);
        timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
        setTimeout(() => { setIsRecording(false); clearInterval(timerRef.current); setRecordingTime(0); onChange("Где моя посылка с трек-номером 284759163?"); }, 3500);
    };
    const cancelRecording = () => { setIsRecording(false); clearInterval(timerRef.current); setRecordingTime(0); };
    const sendRecording = () => { setIsRecording(false); clearInterval(timerRef.current); setRecordingTime(0); onChange("Где моя посылка с трек-номером 284759163?"); setTimeout(() => onSend(), 100); };
    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    if (isRecording) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: "2px solid #CCC", borderRadius: 16, padding: isCompact ? "10px 12px" : "12px 16px", animation: "recording-pulse 2s ease-in-out infinite" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D44", animation: "rec-dot 1s ease-in-out infinite" }} />
                <span style={{ fontSize: 12, color: "#777", fontWeight: 500, minWidth: 32 }}>{formatTime(recordingTime)}</span>
                <VoiceWaveform />
                <button onClick={cancelRecording} style={{ ...iBtnS, color: "#666" }}><IconStop /></button>
                <button onClick={sendRecording} style={{ background: "#1A1A1A", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, color: "#FFF", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Отправить</button>
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
                    style={{ width: "100%", border: "none", outline: "none", fontSize: isCompact ? 13 : 14, color: "#1A1A1A", background: "transparent", fontFamily: "inherit", position: "relative", zIndex: 1 }}
                />
            </div>
            {ghostText && <span style={{ fontSize: 10, color: "#AAA", background: "#F5F5F5", borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap", border: "1px solid #E0E0E0", fontWeight: 500, flexShrink: 0 }}>Tab ↹</span>}
            <button onClick={startRecording} style={{ ...iBtnS, color: "#888" }}><IconMic /></button>
            <button style={{ ...iBtnS, color: "#999" }}><IconAttach /></button>
            <button onClick={() => value.trim() && onSend()} disabled={!value.trim()} style={{ ...iBtnS, color: value.trim() ? "#1A1A1A" : "#CCC" }}><IconSend /></button>
        </div>
    );
};
const iBtnS = { background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", borderRadius: 8 };

// ─── Chat Content ──────────────────────────────────────────────────────
const ChatContent = ({ messages, inputValue, setInputValue, handleSend, isCompact, showGreeting, onQuestionSelect, hasUserSent }) => {
    const scrollRef = useRef(null);
    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const lastAst = [...messages].reverse().find((m) => m.role === "assistant" && !m.isTyping);
    const lastType = lastAst?.responseType || null;
    const lastDone = messages.length > 0 && messages[messages.length - 1].role === "assistant" && !messages[messages.length - 1].isTyping;

    return (
        <>
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isCompact ? "12px 14px" : "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
                {showGreeting && !hasUserSent && (
                    <div style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isCompact ? 14 : 20 }}>
                            <CdekAiLogo size={isCompact ? 28 : 36} /><span style={{ fontSize: 12, color: "#999" }}>Сегодня</span>
                        </div>
                        <h2 style={{ fontSize: isCompact ? 16 : 22, fontWeight: 600, color: "#1A1A1A", margin: "0 0 16px 0", lineHeight: 1.4, letterSpacing: "-0.01em" }}>Здравствуйте! Я ИИ-помощник СДЭК. Чем могу помочь?</h2>
                    </div>
                )}
                {(hasUserSent ? messages.filter(m => m.id !== 1) : []).map((msg) => <MessageBubble key={msg.id} message={msg} isCompact={isCompact} />)}
                {hasUserSent && lastDone && lastType && <SourcesSection isCompact={isCompact} />}
                {!hasUserSent && <SuggestedQuestions onSelect={onQuestionSelect} isCompact={isCompact} />}
                {hasUserSent && lastDone && lastType && <FollowUpList responseType={lastType} onSelect={onQuestionSelect} isCompact={isCompact} />}
            </div>
            <div style={{ padding: isCompact ? "8px 12px 12px" : "8px 20px 16px" }}>
                <InputBar value={inputValue} onChange={setInputValue} onSend={handleSend} isCompact={isCompact} />
            </div>
        </>
    );
};


// ─── FULL PAGE ─────────────────────────────────────────────────────────
const FullPageView = (props) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", fontFamily: "'PT Sans', sans-serif" }}>
            <div style={{ width: sidebarCollapsed ? 48 : 260, height: "100%", flexShrink: 0 }}>
                <HistorySidebar
                    onNewChat={props.onNewChat}
                    onSelectChat={() => { }}
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
};

// ─── SIDEBAR ───────────────────────────────────────────────────────────
const SidebarView = (props) => {
    const [histOpen, setHistOpen] = useState(false);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "'PT Sans', sans-serif" }}>
            {/* Full-width skeleton background content */}
            <PageSkeleton />

            {/* Drawer panel — absolute right */}
            <div style={{
                position: "absolute", top: 0, right: 0, bottom: 0,
                width: 380, borderLeft: "1px solid #E0E0E0",
                background: "#FFF", display: "flex", flexDirection: "column",
                boxShadow: "-8px 0 32px rgba(0,0,0,0.08)",
                animation: "sidebar-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}>
                {/* History dropdown overlay */}
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
                    <button onClick={() => setHistOpen(!histOpen)} style={hdrBtn} title="История"><IconBack /></button>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginLeft: 4 }}>ИИ-чат</span>
                    <button onClick={props.onExpand} style={hdrBtn} title="Развернуть"><IconExpand /></button>
                    <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconNewChat /></button>
                    <button onClick={props.onMinimize} style={hdrBtn} title="Свернуть"><IconMinimize /></button>
                </div>
                <ChatContent {...props} isCompact={true} showGreeting={true} />
            </div>
        </div>
    );
};

// ─── PageSkeleton ─────────────────────────────────────────────────────────
const sk = (w, h, r = 6) => ({
    height: h, width: w, background: "linear-gradient(90deg, #F0F0F0 25%, #E4E4E4 50%, #F0F0F0 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite",
    borderRadius: r, flexShrink: 0,
});

const PageSkeleton = () => (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", background: "#F9FAFB", fontFamily: "'PT Sans', sans-serif" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px" }}>
            {/* Header */}
            <div style={sk("220px", 28, 8)} />
            <div style={{ ...sk("360px", 16, 6), marginTop: 10, marginBottom: 32 }} />
            {/* Cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 40 }}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ padding: 20, background: "#FFF", borderRadius: 16, border: "1px solid #E5E7EB" }}>
                        <div style={sk("55%", 14, 4)} />
                        <div style={{ ...sk("35%", 12, 4), marginTop: 8 }} />
                    </div>
                ))}
            </div>
            <div style={{ height: 1, background: "#E5E7EB", marginBottom: 32 }} />
            {/* Text blocks */}
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

const hdrBtn = { background: "none", border: "none", cursor: "pointer", color: "#777", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" };
const hdrCircleBtn = { background: "#F5F5F5", border: "none", cursor: "pointer", color: "#1A1A1A", padding: 10, borderRadius: "50%", display: "flex", alignItems: "center", transition: "all 0.2s" };

// ─── FLOAT ─────────────────────────────────────────────────────────────
const FloatSidebarView = (props) => {
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
                }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                ><span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>AI</span></button>
            )}
            {isOpen && (
                <div style={{
                    position: "absolute", bottom: 24, right: 24, width: 370, height: 520,
                    background: "#FFF", borderRadius: 20,
                    boxShadow: "0 12px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)",
                    display: "flex", flexDirection: "column", overflow: "hidden",
                    animation: "float-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)", border: "1px solid #E0E0E0",
                }}>
                    {/* History overlay inside float */}
                    {histOpen && (
                        <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: "#FFF", zIndex: 10, borderTop: "1px solid #EBEBEB", borderRadius: "0 0 20px 20px", overflow: "hidden" }}>
                            <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
                        </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #EBEBEB", gap: 4 }}>
                        <button onClick={() => setHistOpen(!histOpen)} style={hdrBtn} title="История"><IconBack /></button>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginLeft: 4 }}>ИИ-чат</span>
                        <button onClick={props.onExpand} style={hdrBtn} title="Развернуть"><IconExpand /></button>
                        <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconNewChat /></button>
                        <button onClick={() => setIsOpen(false)} style={hdrBtn} title="Свернуть"><IconMinimize /></button>
                    </div>
                    <ChatContent {...props} isCompact={true} showGreeting={true} />
                </div>
            )}
        </div>
    );
};

const EmbeddedView = (props) => {
    const [histOpen, setHistOpen] = useState(false);
    const [chatVisible, setChatVisible] = useState(true);

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFF", position: "relative", fontFamily: "'PT Sans', sans-serif" }}>
            {/* Main Page Content */}
            <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, background: "#F9FAFB", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
                    <button style={hdrCircleBtn} title="Настройки"><IconSettings /></button>
                    <button
                        onClick={() => setChatVisible(!chatVisible)}
                        style={{ ...hdrCircleBtn, background: chatVisible ? "#EBEBEB" : "none" }}
                        title={chatVisible ? "Скрыть правое меню" : "Показать правое меню"}
                    >
                        <IconSidebarToggle />
                    </button>
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                    <PageSkeleton />
                </div>
            </div>

            {/* Embedded AI Section (Right side) */}
            {chatVisible && (
                <div style={{
                    width: 400, margin: 12, borderRadius: 24,
                    display: "flex", flexDirection: "column", background: "#FFF",
                    position: "relative", overflow: "hidden",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
                    animation: "msg-appear 0.3s ease-out"
                }}>
                    {/* History dropdown overlay for embedded */}
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
                        <button onClick={() => setHistOpen(!histOpen)} style={hdrBtn} title="История"><IconBack /></button>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#111827", marginLeft: 4 }}>ИИ-чат</span>
                        <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconNewChat /></button>
                    </div>
                    <ChatContent {...props} isCompact={true} showGreeting={true} />
                </div>
            )}
        </div>
    );
};

// ─── MAIN ──────────────────────────────────────────────────────────────
export default function AiAssistantPrototype() {
    const [viewMode, setViewMode] = useState("fullpage");
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [hasUserSent, setHasUserSent] = useState(false);
    const [floatInitialOpen, setFloatInitialOpen] = useState(true);

    const doSend = useCallback((text) => {
        const txt = text.trim();
        if (!txt) return;
        setHasUserSent(true);
        const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        setMessages((p) => [...p, { id: Date.now(), role: "user", text: txt, time: now }, { id: Date.now() + 1, role: "assistant", text: "", isTyping: true, time: "", responseType: null }]);
        setInputValue("");
        const key = getResponseKey(txt);
        setTimeout(() => {
            const now2 = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            setMessages((p) => p.map((m) => m.isTyping ? { ...m, text: DEMO_RESPONSES[key].text, isTyping: false, time: now2, hasAudio: true, responseType: DEMO_RESPONSES[key].type } : m));
        }, 1500);
    }, []);

    const handleSend = useCallback(() => doSend(inputValue), [inputValue, doSend]);
    const handleQuestionSelect = useCallback((q) => { setInputValue(q); setTimeout(() => doSend(q), 150); }, [doSend]);

    const resetChat = useCallback(() => { setMessages(INITIAL_MESSAGES); setInputValue(""); setHasUserSent(false); }, []);

    const shared = {
        messages,
        inputValue,
        setInputValue,
        handleSend,
        onQuestionSelect: handleQuestionSelect,
        hasUserSent,
        onNewChat: resetChat
    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes typing-bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        @keyframes msg-appear { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float-appear { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fab-appear { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes sidebar-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes waveform { from { height: 3px; } to { height: 20px; } }
        @keyframes rec-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes recording-pulse { 0%, 100% { border-color: #CCC; } 50% { border-color: #999; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #BBB; }
        input::placeholder { color: #AAA; }
      `}</style>

            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#1A1A1A", fontFamily: "'PT Sans', sans-serif", flexShrink: 0 }}>
                <CdekAiLogo size={26} />
                <span style={{ color: "#FFF", fontSize: 14, fontWeight: 600, marginRight: 16 }}>СДЭК AI-помощник</span>
                {[{ id: "fullpage", label: "Весь экран" }, { id: "sidebar", label: "Боковая панель" }, { id: "float", label: "Плавающий" }, { id: "embedded", label: "Встроенный" }].map((m) => (
                    <button key={m.id} onClick={() => { if (m.id === "float") setFloatInitialOpen(true); setViewMode(m.id); resetChat(); }} style={{
                        background: viewMode === m.id ? "#444" : "rgba(255,255,255,0.06)",
                        color: viewMode === m.id ? "#FFF" : "#888",
                        border: viewMode === m.id ? "none" : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}>{m.label}</button>
                ))}
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
                {viewMode === "fullpage" && <FullPageView {...shared} />}
                {viewMode === "sidebar" && <SidebarView {...shared} onMinimize={() => { setFloatInitialOpen(false); setViewMode("float"); }} onExpand={() => setViewMode("fullpage")} />}
                {viewMode === "float" && <FloatSidebarView {...shared} initialOpen={floatInitialOpen} onExpand={() => setViewMode("fullpage")} />}
                {viewMode === "embedded" && <EmbeddedView {...shared} onClose={() => setViewMode("fullpage")} onMinimize={() => setViewMode("float")} onExpand={() => setViewMode("fullpage")} />}
            </div>
        </div>
    );
}