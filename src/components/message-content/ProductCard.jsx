import { useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { SHOPPING_PRODUCTS } from "../../data/mockResponses.js";

function ShoppingCards({ onOrder, isCompact }) {
  return (
    <div className="animate-[msg-appear_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
      <div className={`text-[#999] mb-2.5 uppercase tracking-wide font-semibold ${isCompact ? "text-[11px]" : "text-xs"}`}>
        СДЭК Шоппинг — рекомендуем
      </div>
      <div className={`grid gap-2.5 ${isCompact ? "grid-cols-1" : "grid-cols-2"}`}>
        {SHOPPING_PRODUCTS.map((p) => (
          <button key={p.id} onClick={() => onOrder(p)} className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 text-left cursor-pointer font-[inherit] transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-2.5">
              <div className="text-[28px] leading-none shrink-0">{p.img}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-[0.04em]"
                    style={{
                      background: p.badge.startsWith("−") ? "#FEF3C7" : p.badge === "Хит" ? "#DBEAFE" : "#F0FDF4",
                      color: p.badge.startsWith("−") ? "#92400E" : p.badge === "Хит" ? "#1E40AF" : "#14532D",
                    }}>{p.badge}</span>
                </div>
                <div className={`font-semibold text-[#111827] mb-[3px] leading-tight ${isCompact ? "text-[11px]" : "text-xs"}`}>{p.name}</div>
                <div className={`text-[#9CA3AF] mb-1.5 ${isCompact ? "text-[10px]" : "text-[11px]"}`}>{p.desc}</div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-[#111827] ${isCompact ? "text-xs" : "text-[13px]"}`}>{p.price}</span>
                  {p.oldPrice && <span className="text-[10px] text-[#9CA3AF] line-through">{p.oldPrice}</span>}
                </div>
                <div className="text-[10px] text-[#9CA3AF] mt-1">★ {p.rating} · {p.reviews} отзывов</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className={`mt-3 text-[#6B7280] px-3 py-2.5 bg-[#F9FAFB] rounded-[10px] border border-[#E5E7EB] ${isCompact ? "text-[11px]" : "text-xs"}`}>
        Нажмите на товар, чтобы узнать подробности и оформить заказ с доставкой СДЭК 🚀
      </div>
    </div>
  );
}

function ProductOrder({ product, onBack, isCompact }) {
  return (
    <div className="animate-[msg-appear_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
      <button onClick={onBack} className={`bg-none border-none cursor-pointer text-[#777] mb-2.5 p-0 font-[inherit] flex items-center gap-1 ${isCompact ? "text-[11px]" : "text-xs"}`}>
        <IconChevronLeft size={18} /><span>Назад к каталогу</span>
      </button>
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-2.5">
        <div className="text-[28px] mb-2">{product.img}</div>
        <div className={`font-bold text-[#111827] mb-1 ${isCompact ? "text-[13px]" : "text-[15px]"}`}>{product.name}</div>
        <div className={`text-[#6B7280] mb-2.5 ${isCompact ? "text-[11px]" : "text-xs"}`}>{product.desc}</div>
        <div className="flex items-center gap-2 mb-3.5">
          <span className={`font-bold text-[#111827] ${isCompact ? "text-base" : "text-lg"}`}>{product.price}</span>
          {product.oldPrice && <span className="text-xs text-[#9CA3AF] line-through">{product.oldPrice}</span>}
        </div>
        <div className="text-[11px] text-[#6B7280] mb-2.5">★ {product.rating} · {product.reviews} отзывов</div>
        <div className={`text-[#374151] bg-[#F3F4F6] rounded-[10px] px-3 py-2 mb-3 ${isCompact ? "text-[11px]" : "text-xs"}`}>
          🚚 Доставка СДЭК от <b>2 дней</b> · Стандарт от <b>350 ₽</b> · Экспресс от <b>590 ₽</b>
        </div>
        <button className={`w-full bg-[#1A1A1A] text-white border-none rounded-xl font-semibold cursor-pointer font-[inherit] transition-all duration-200 ${isCompact ? "p-2.5 text-xs" : "p-3 text-[13px]"}`}>
          Заказать с доставкой СДЭК
        </button>
      </div>
      <div className={`text-[#9CA3AF] text-center ${isCompact ? "text-[10px]" : "text-[11px]"}`}>
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
