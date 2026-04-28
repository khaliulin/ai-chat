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
