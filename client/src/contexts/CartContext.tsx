import {createContext, Dispatch, ReactNode, useEffect, useReducer} from "react";
import {AppActions, cartReducer } from "../reducers/CartReducer";
import { ShoppingCartItem} from "../types";

// const initialCartState:ShoppingCartItem[] =  []
const storageKey = "cart";
const storedData = localStorage.getItem(storageKey);
export const initialCartState = storedData ? JSON.parse(storedData) : [];
export const CartStore = createContext<{
    carts: ShoppingCartItem[];
    dispatch: Dispatch<any>;
}>({
    carts: initialCartState,
    dispatch: () => null
});

CartStore.displayName = 'CartContext';

interface cartContextProps {
    children: ReactNode;
}

function CartContext({ children }: cartContextProps) {
    const [carts, dispatch] = useReducer(
      cartReducer as (state: ShoppingCartItem[], action: AppActions) => ShoppingCartItem[],
        initialCartState
    );

    useEffect(() => {
        console.log("Cart state updated:", carts);
        localStorage.setItem('cart', JSON.stringify(carts));
    },[carts]);

    return (
      <CartStore.Provider value={{carts, dispatch}}>
          {children}
      </CartStore.Provider>
    );
}

export default CartContext;