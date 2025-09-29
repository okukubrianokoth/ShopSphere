import React from "react";
import "/home/brian-okuku/Documents/ShopSphere/frontend/src/styles/productcard.css";
import { Plus, Minus } from "lucide-react";

export default function ProductCard({ product, onAdd, onRemove }) {
  return (
    <div className="pcard">
      <img src={product.image_url} alt={product.name} />
      <h4>{product.name}</h4>
      <p>{product.category}</p>
      <p>KSh {product.price.toFixed(2)}</p>
      <div className="pcard-btns">
        {onRemove && <button onClick={() => onRemove(product)}><Minus size={14}/> Remove</button>}
        {onAdd && <button onClick={() => onAdd(product)}><Plus size={14}/> Add</button>}
      </div>
    </div>
  );
}
