import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SaleCart, ShoppingCart } from "./interfaces";

interface State {
    saleCart: SaleCart[];
    shoppingCart: ShoppingCart[];
    setSaleCart: (data: SaleCart[]) => void;
    setShoppingCart: (data: ShoppingCart[]) => void;
}

export const useStore = create<State>()(
    persist(
        (set) => ({
            saleCart: [],
            shoppingCart: [],
            setSaleCart: (data) => {
                set({ saleCart: data });
            },
            setShoppingCart: (data) => {
                set({ shoppingCart: data });
            }
        }),
        {
            name: 'cart-storage',
        },
    ),
);