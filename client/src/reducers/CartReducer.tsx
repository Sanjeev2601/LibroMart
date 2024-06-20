import {ShoppingCartItem, BookItem} from "../types";

export const CartTypes = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
    CLEAR:'CLEAR'
};

export type AppActions = {
    id:number;
    type: 'ADD' | 'REMOVE'  | 'CLEAR';
    item: BookItem;
}
const storageKey = "cart";
const storedData = localStorage.getItem(storageKey);
export const initialState = storedData ? JSON.parse(storedData) : [];
export const cartReducer = (state:ShoppingCartItem[], action:AppActions) => {
    console.log("cartReducer called with action:", action);
    switch (action.type) {
        case CartTypes.ADD:
            const existingItem = state.find((cartItem) => cartItem.id === action.id)
            if (existingItem) {
                return state.map((cartItem) =>
                    cartItem.id === action.id
                        ? {...cartItem, quantity: cartItem.quantity + 1}
                        : cartItem
                );
            } else {
                return [
                    ...state,
                    {id: action.id, book: action.item, quantity: 1},
                ];
            }
        case CartTypes.REMOVE:
            const itemToRemove = state.find((cartItem) => cartItem.id === action.id)
            if (itemToRemove) {
                if(itemToRemove.quantity > 1) {
                    return state.map((cartItem) =>
                        cartItem.id === action.id
                            ? {...cartItem, quantity: cartItem.quantity - 1}
                            : cartItem
                    );
                }
                else {
                    return state.filter((cartItem) => cartItem.id !== action.id)
                }
            }
            return state;
        case CartTypes.CLEAR:
            return [];    // will be defined in Project 7
        default:
            throw new Error(`Invalid action type ${action.type}`);
    }
};