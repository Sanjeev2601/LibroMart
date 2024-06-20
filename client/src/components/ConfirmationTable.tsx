import '../assets/css/ConfirmationTable.css'

import { asDollarsAndCents } from "./Utils";

import { BookItem, OrderDetails, LineItem } from '../types'

import {useContext} from "react";

import {OrderDetailsStore} from "../contexts/OrderDetailContext";

function ConfirmationTable() {
    const { orderDetails} = useContext(OrderDetailsStore);
    const findQuantityByBookId = (bookId: number) => {
        const item: LineItem | undefined = orderDetails.lineItems.find((item: LineItem) => item.bookId === bookId);
        return item ? item.quantity : 0;
    };
    const calculateTotal = () => {
        return orderDetails.books?.reduce((total, book) => {
            const quantity = findQuantityByBookId(book.bookId);
            return total + (book.price * quantity);
        }, 0);
    };

    const total = calculateTotal();

    return (
        <table className="confirmation_table">
            <thead>
            <tr>
                <th className="confirmation_th">Title</th>
                <th className="confirmation_th">Book ID</th>
                <th className="confirmation_th">Quantity</th>
                <th className="confirmation_th">Price</th>
            </tr>
            </thead>
            <tbody>
            {
                orderDetails.books?.map((book, i) => (
                    <tr className="confirmation_tr" key={i}>
                        <td className="confirmation_td">
                            {book.title}
                        </td>
                        <td className="confirmation_td">{book.bookId}</td>
                        <td className="confirmation_td">
                            {findQuantityByBookId(book.bookId)}
                        </td>
                        <td className="confirmation_td">{asDollarsAndCents((book.price))}</td>
                    </tr>
                ))}
            <tr className="confirmation_tr">
                <td className="confirmation_td" colSpan={3}><b>Total :</b></td>
                <td className="confirmation_td"
                    style={{fontWeight: 'bold', textAlign: 'right'}}>{asDollarsAndCents(total)}</td>
            </tr>
            </tbody>
        </table>
    )
}

export default ConfirmationTable;