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
    <div className="grid grid-cols-3 gap-2">
      {CDEK_ACTIONS.map((a, i) => (
        <button key={i}
          onClick={() => a.shopping ? setShoppingOpen(true) : onSelect(a.q)}
          className={`bg-[#F9FAFB] border border-[#E5E7EB] rounded-[14px] flex flex-col items-start gap-1.5 cursor-pointer font-[inherit] text-left transition-all duration-[180ms] relative ${isCompact ? "px-2 py-2.5" : "px-2.5 py-3.5"}`}>
          {a.badge && (
            <span className="absolute top-1.5 right-1.5 bg-[#1A1A1A] text-white text-[8px] font-bold px-[5px] py-0.5 rounded-md uppercase tracking-wide">{a.badge}</span>
          )}
          <span className={`leading-none ${isCompact ? "text-lg" : "text-[22px]"}`}>{a.icon}</span>
          <span className={`font-medium text-[#374151] leading-tight ${isCompact ? "text-[10px]" : "text-[11px]"}`}>{a.label}</span>
        </button>
      ))}
    </div>
  );
}
