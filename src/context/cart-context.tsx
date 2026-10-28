import { createContext, ReactNode, useContext, useState } from "react";

import { Album } from "@/models/album";

type CartContextValue = {
  items: Album[];
  total: number;
  addToCart: (album: Album) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Album[]>([]);

  const total = items.reduce((sum, album) => sum + album.price, 0);

  function addToCart(album: Album) {
    setItems((current) => [...current, album]);
  }

  return (
    <CartContext value={{ items, total, addToCart }}>{children}</CartContext>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart doit être utilisé dans un <CartProvider>");
  }
  return cart;
}
