import { OrderDetails } from "../types";

export const OrderDetailTypes = {
    ADD: 'ADD',
    CLEAR:'CLEAR'
};

export type AppActions = {
    type: 'ADD' | 'CLEAR';
    item: OrderDetails;
};

export const orderDetailsReducer = (state: OrderDetails, action: AppActions) => {
    switch (action.type) {
        case OrderDetailTypes.ADD:
            localStorage.setItem('orderDetails', JSON.stringify(action.item));
            return action.item;

        case OrderDetailTypes.CLEAR:
            return [];

        default:
            throw new Error(`Invalid action ${action.type}`);
    }
};