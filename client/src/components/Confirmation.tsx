import '../assets/css/Confirmation.css'
import ConfirmationTable from "./ConfirmationTable";
import {useContext} from "react";
import {OrderDetailsStore} from "../contexts/OrderDetailContext";


function Confirmation()
{
    const { orderDetails} = useContext(OrderDetailsStore);

    const orderDate =  () => {
        let date = new Date(orderDetails.order.dateCreated);
        return ( date.toLocaleString());
    };
    const ccExpDate =  (): Date =>{
        const expiryDate = new Date(orderDetails.customer.ccExpDate)
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        expiryDate.setDate(expiryDate.getDate() - 1);
        return expiryDate;
    };

    const formatCreditCardNumber = (ccNumber: string) => {
        if (ccNumber && ccNumber.length >= 16) {
            return '**** **** **** ' + ccNumber.slice(-4);
        }
        return '';
    };

    if (!orderDetails) {
        return <div>Loading order details...</div>;
    }

    return (
        <div className="confirmationView">
            <div className="confirmationDetails">
                <div className="OrderConfirmation">
                    <p><span className="bold">Confirmation #:</span> <span className="normal">{orderDetails.order.confirmationNumber}</span></p>
                    <p><span className="bold">Order placed at:</span> <span className="normal" id="date">{orderDate()}</span></p>
                </div>
                <div className="orderDetailsTable">
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Credit Card</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{orderDetails.customer.customerName}</td>
                            <td>{orderDetails.customer.address}</td>
                            <td>{orderDetails.customer.email}</td>
                            <td>{orderDetails.customer.phone}</td>
                            <td>{formatCreditCardNumber(orderDetails.customer.ccNumber)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="confirmationTableWrapper">
                <ConfirmationTable/>
            </div>
            <div className="customerInfo">
                <p>Thank you for shopping with us today!</p>
            </div>
        </div>
    )
}

export default Confirmation;