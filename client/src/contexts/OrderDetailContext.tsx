import { createContext, Dispatch, ReactNode, useEffect, useReducer } from "react";
import { OrderDetails } from "../types";
import { AppActions } from "../reducers/OrderDetailReducer";
import { orderDetailsReducer } from "../reducers/OrderDetailReducer";

const storageKey = "orderDetails";
const storedData = localStorage.getItem(storageKey);
export const initialOrderDetailsState = storedData ? JSON.parse(storedData) : [];

export const OrderDetailsStore = createContext<{
    orderDetails: OrderDetails;
    dispatchOrder: Dispatch<any>;
}>({
    orderDetails: initialOrderDetailsState,
    dispatchOrder: () => null,
});

OrderDetailsStore.displayName = "OrderDetailsContext";

interface OrderDetailsContextProps {
    children: ReactNode;
}
function OrderDetailsContext({ children }: OrderDetailsContextProps) {
    const [orderDetails, dispatchOrder] = useReducer(
        orderDetailsReducer as (state: OrderDetails, action: AppActions) => OrderDetails,
        initialOrderDetailsState
    );

    useEffect(() => {
        console.log("Order Details updated:", orderDetails);
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    }, [orderDetails]);

    return (
        <OrderDetailsStore.Provider value={{orderDetails, dispatchOrder}}>
            {children}
        </OrderDetailsStore.Provider>
    );
}

export default OrderDetailsContext;
