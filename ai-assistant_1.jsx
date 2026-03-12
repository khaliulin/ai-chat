import { useState, useRef, useEffect, useCallback } from "react";

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
    "Как рассчитать стоимость доставки?",
    "Ближайший пункт выдачи СДЭК",
    "Как оформить возврат?",
    "Сроки доставки между городами",
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
    { id: "h1", title: "Отслеживание CDEK-284759163", date: "Сегодня", active: true },
    { id: "h2", title: "Стоимость доставки Москва — СПб", date: "Сегодня", active: false },
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
        text: "Здравствуйте! Я ИИ-помощник СДЭК. Помогу отследить посылку, рассчитать стоимость доставки или найти ближайший пункт выдачи. Чем могу помочь?",
        time: "9:17", hasAudio: true, responseType: null,
    },
];

const DEMO_RESPONSES = {
    default: { text: "Я нашёл информацию по вашему запросу.\n\n• Для отслеживания посылки введите трек-номер в формате CDEK-XXXXXXXXX\n• Статус обновляется каждые 2–4 часа\n• При задержке более 3 дней рекомендую обратиться в поддержку\n\nМогу помочь ещё с чем-нибудь?", type: "default" },
    tracking: { text: "Посылка CDEK-284759163:\n\nСтатус: В пути\nТекущее местоположение: Сортировочный центр Новосибирск\nОжидаемая дата доставки: 15 марта 2026\n\nПосылка была отправлена 10 марта из Москвы и сейчас проходит сортировку. Ориентировочное время доставки — 2 рабочих дня.", type: "tracking" },
    delivery: { text: "Стоимость доставки зависит от нескольких параметров:\n\n• Города отправления и получения\n• Веса и габаритов посылки\n• Выбранного тарифа (экспресс, стандарт, экономный)\n\nСтандартная доставка Москва → Санкт-Петербург: от 350 ₽, срок 2–3 дня.\nЭкспресс: от 590 ₽, срок 1 день.\n\nХотите рассчитать для конкретного маршрута?", type: "delivery" },
    offices: { text: "Ближайшие пункты выдачи СДЭК:\n\n1. ул. Ленина, 42 — 350 м от вас, пн-пт 9:00–20:00\n2. пр. Мира, 15 — 800 м, ежедневно 10:00–21:00\n3. ТЦ «Галерея», 2 этаж — 1.2 км, ежедневно 10:00–22:00\n\nВо всех пунктах доступна примерка и проверка товара перед получением.", type: "offices" },
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
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IconMagic = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>;
const IconMoreVertical = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;

// ─── CDEK AI Logo ──────────────────────────────────────────────────────
const CdekAiLogo = ({ size = 32 }) => (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="2.5" fill="white" /><circle cx="6" cy="16" r="2.5" fill="white" /><circle cx="18" cy="16" r="2.5" fill="white" />
            <line x1="12" y1="10.5" x2="6" y2="13.5" stroke="white" strokeWidth="1.5" /><line x1="12" y1="10.5" x2="18" y2="13.5" stroke="white" strokeWidth="1.5" /><line x1="6" y1="16" x2="18" y2="16" stroke="white" strokeWidth="1.5" />
        </svg>
    </div>
);

const TypingIndicator = () => (
    <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#999", animation: `typing-bounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />)}
    </div>
);

const VoiceWaveform = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 24, flex: 1 }}>
        {Array.from({ length: 32 }).map((_, i) => <div key={i} style={{ width: 3, borderRadius: 2, background: "#555", animation: `waveform ${0.6 + Math.random() * 0.6}s ease-in-out ${i * 0.03}s infinite alternate`, minHeight: 3 }} />)}
    </div>
);

// ─── Chat History Sidebar ──────────────────────────────────────────────
const HistorySidebar = ({ onNewChat, onSelectChat, activeChat, collapsed, onToggle }) => {
    const [search, setSearch] = useState("");
    const filtered = CHAT_HISTORY.filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()));

    // Group by date
    const groups = {};
    filtered.forEach((c) => {
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

    return (
        <div style={{
            width: 260, height: "100%", background: "#FAFAFA", borderRight: "1px solid #EBEBEB",
            display: "flex", flexDirection: "column", flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
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
                {Object.entries(groups).map(([date, chats]) => (
                    <div key={date}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 8px 4px" }}>{date}</div>
                        {chats.map((c) => (
                            <button key={c.id} onClick={() => onSelectChat(c.id)} style={{
                                display: "flex", alignItems: "center", gap: 8, width: "100%",
                                background: activeChat === c.id ? "#EBEBEB" : "transparent",
                                border: "none", borderRadius: 8, padding: "9px 8px", textAlign: "left",
                                cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit",
                            }}
                                onMouseEnter={(e) => { if (activeChat !== c.id) e.currentTarget.style.background = "#F0F0F0"; }}
                                onMouseLeave={(e) => { if (activeChat !== c.id) e.currentTarget.style.background = "transparent"; }}
                            >
                                <IconChat />
                                <span style={{
                                    fontSize: 12, color: "#333", overflow: "hidden",
                                    whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1,
                                    fontWeight: activeChat === c.id ? 600 : 400,
                                }}>{c.title}</span>
                            </button>
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
            <button style={{ background: "none", border: "none", padding: 4, cursor: "pointer", display: "flex", color: "#999" }}><IconMoreVertical /></button>
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
                    <span style={{ fontSize: 12, color: "#777", fontWeight: 500 }}>Ответ</span>
                    {message.hasAudio && <button style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 2, display: "flex" }}><IconAudio /></button>}
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
                        <button style={actionBtnStyle}><IconThumbUp /></button>
                        <button style={actionBtnStyle}><IconThumbDown /></button>
                        <button onClick={handleCopy} style={{ ...actionBtnStyle, gap: 4, fontSize: 11, color: copied ? "#333" : "#999", fontWeight: 500 }}>
                        {copied ? "Скопировано" : "КОПИРОВАТЬ"} <IconCopy />
                    </button>
                        <div style={{ flex: 1 }} />
                        <button style={actionBtnStyle}><IconAudio /></button>
                        <button style={actionBtnStyle}><IconRefresh /></button>
                    </div>
                    <AIResponseActions isCompact={isCompact} onAction={() => {}} />
                </>
            )}
        </div>
    );
};

const actionBtnStyle = {
    background: "none", border: "none", cursor: "pointer", color: "#999",
    padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center", transition: "all 0.15s",
};

// ─── Sources ───────────────────────────────────────────────────────────
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

// ─── Initial Suggested Questions ───────────────────────────────────────
const SuggestedQuestions = ({ onSelect, isCompact }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {SUGGESTED_QUESTIONS.map((q, i) => (
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
                        <h2 style={{ fontSize: isCompact ? 16 : 22, fontWeight: 600, color: "#1A1A1A", margin: "0 0 16px 0", lineHeight: 1.4, letterSpacing: "-0.01em" }}>Здравствуйте! Я ИИ-помощник СДЭК. Помогу отследить посылку, рассчитать стоимость доставки или найти ближайший пункт выдачи. Чем могу помочь?</h2>
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
        <div style={{ width: "100%", height: "100%", display: "flex", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
            <HistorySidebar
                onNewChat={props.onNewChat}
                onSelectChat={() => { }}
                activeChat="h1"
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
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
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
            <div style={{ flex: 1, background: "#F7F7F7", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                <div style={{ textAlign: "center", maxWidth: 400 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#1A1A1A", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>СДЭК</div>
                    <div style={{ fontSize: 14, color: "#999", fontFamily: "'DM Sans', sans-serif" }}>Курьерская служба доставки</div>
                    <div style={{ marginTop: 32, background: "#FFF", borderRadius: 12, padding: 24, border: "1px solid #E8E8E8", textAlign: "left" }}>
                        <div style={{ fontSize: 13, color: "#777", fontFamily: "'DM Sans', sans-serif" }}>Пример основного контента страницы — отслеживание, каталог услуг, личный кабинет...</div>
                    </div>
                </div>
            </div>
            <div style={{
                width: 380, height: "100%", borderLeft: "1px solid #E0E0E0",
                background: "#FFF", display: "flex", flexDirection: "column",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif", boxShadow: "-4px 0 24px rgba(0,0,0,0.05)",
                position: "relative",
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
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginLeft: 4 }}>Новый чат</span>
                    <button onClick={props.onExpand} style={hdrBtn} title="Развернуть"><IconExpand /></button>
                    <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconNewChat /></button>
                    <button onClick={props.onMinimize} style={hdrBtn} title="Свернуть"><IconMinimize /></button>
                    <button onClick={props.onClose} style={hdrBtn} title="Закрыть"><IconClose /></button>
                </div>
                <ChatContent {...props} isCompact={true} showGreeting={true} />
            </div>
        </div>
    );
};

const hdrBtn = { background: "none", border: "none", cursor: "pointer", color: "#777", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" };

// ─── FLOAT ─────────────────────────────────────────────────────────────
const FloatSidebarView = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [histOpen, setHistOpen] = useState(false);

    return (
        <div style={{ width: "100%", height: "100%", background: "#F7F7F7", position: "relative", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>СДЭК</div>
                    <div style={{ fontSize: 14, color: "#999" }}>Курьерская служба доставки</div>
                </div>
            </div>
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
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginLeft: 4 }}>Новый чат</span>
                        <button onClick={props.onExpand} style={hdrBtn} title="Развернуть"><IconExpand /></button>
                        <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconNewChat /></button>
                        <button onClick={() => setIsOpen(false)} style={hdrBtn} title="Свернуть"><IconMinimize /></button>
                        <button onClick={() => setIsOpen(false)} style={hdrBtn} title="Закрыть"><IconClose /></button>
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
        @keyframes waveform { from { height: 3px; } to { height: 20px; } }
        @keyframes rec-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes recording-pulse { 0%, 100% { border-color: #CCC; } 50% { border-color: #999; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #BBB; }
        input::placeholder { color: #AAA; }
      `}</style>

            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#1A1A1A", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                <CdekAiLogo size={26} />
                <span style={{ color: "#FFF", fontSize: 14, fontWeight: 600, marginRight: 16 }}>СДЭК AI-помощник</span>
                {[{ id: "fullpage", label: "Весь экран" }, { id: "sidebar", label: "Боковая панель" }, { id: "float", label: "Плавающий" }].map((m) => (
                    <button key={m.id} onClick={() => { setViewMode(m.id); resetChat(); }} style={{
                        background: viewMode === m.id ? "#444" : "rgba(255,255,255,0.06)",
                        color: viewMode === m.id ? "#FFF" : "#888",
                        border: viewMode === m.id ? "none" : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}>{m.label}</button>
                ))}
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
                {viewMode === "fullpage" && <FullPageView {...shared} />}
                {viewMode === "sidebar" && <SidebarView {...shared} onClose={() => setViewMode("fullpage")} onMinimize={() => setViewMode("float")} onExpand={() => setViewMode("fullpage")} />}
                {viewMode === "float" && <FloatSidebarView {...shared} onExpand={() => setViewMode("fullpage")} />}
            </div>
        </div>
    );
}