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
