

import  "../assets/css/Checkout.css"

import { isCreditCard, isMobilePhone, isValidEmail } from '../components/Utils';
import {BookItem, CustomerForm, months, OrderDetails,  years} from "../types";
import {CartStore} from "../contexts/CartContext";
import React, {ChangeEvent, FormEvent, useContext, useState} from "react";
import { useNavigate} from "react-router-dom";
import {CartTypes} from "../reducers/CartReducer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons/faMinusCircle";
import axios from "axios";
import {OrderDetailTypes} from "../reducers/OrderDetailReducer";
import {OrderDetailsStore} from "../contexts/OrderDetailContext";

function CheckoutPage()
{

    const getBookImageUrl =  (book:BookItem) => {
        let name = book.title;
        name = name.replace(/ /g, " ");
        name = name.replace(/'/g, "");
        return `${name}.jpg`;
    };

    function yearFrom(index: number) {
        return new Date().getFullYear() + index;
    }

    function formatCurrency(value: number) {
        return `${value.toFixed(2)}`;
    }

    const {carts, dispatch} = useContext(CartStore);
    // const { orderDetails, dispatchOrder} = useContext(OrderDetailsStore);
    const { dispatchOrder } = useContext(OrderDetailsStore);

    const navigate = useNavigate();

    const SURCHARGE_RATE = 1.5;
    const calculateCartSummaryValues = () => {
        let cartTotalPrice = 0;
        let subtotal = 0;

        carts.forEach((item) => {
            subtotal += item.quantity * (item.book.price / 100);
        });

        const surcharge = SURCHARGE_RATE;

        cartTotalPrice = subtotal + surcharge;

        return {
            cartTotalPrice,
            subtotal,
            surcharge,
        };
    };

    const cartValues = calculateCartSummaryValues();
    const cartTotalPrice = cartValues.cartTotalPrice;
    const subtotal = cartValues.subtotal;
    const surcharge = cartValues.surcharge;

    const cartQuantity = carts.reduce((total, item) => total + item.quantity, 0);

    const [nameError, setNameError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [ccNumberError, setCcNumberError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        address:"",
        phone:"",
        email: "",
        ccNumber: "",
        ccExpiryMonth: 4, ccExpiryYear:2024});

    const [checkoutStatus, setCheckoutStatus] = useState("");

    const continueShopping = () => {
        const recentCategory = localStorage.getItem('recentCategory');
        if (recentCategory) {
            navigate(`/categories/${recentCategory}`);
        } else {
            navigate('/categories/comics');
        }
        console.log("Continue Shopping clicked, Navigating to:", recentCategory ? `/categories/${recentCategory}` : "/categories");
        console.log("Continue Shopping clicked");
    };

    function isValidForm(formData: {
        name: string;
        address: string;
        phone: string;
        email: string;
        ccNumber: string;
        ccExpiryMonth: number;
        ccExpiryYear: number;
    }): boolean {
        let valid = true;

        if (formData.name.length < 4 || formData.name.length > 45) {
            valid = false;
        }
        if (formData.address.length < 5 || formData.address.length > 100) {
            valid = false;
        }
        if (!isMobilePhone(formData.phone)) {
            valid = false;
        }
        if (!isValidEmail(formData.email)) {
            valid = false;
        }
        if (!isCreditCard(formData.ccNumber)) {
            valid = false;
        }

        return valid;
    }

    const isFormInvalid = (formData.name.length === 0 || formData.address.length === 0 || formData.phone.length === 0 || formData.email.length === 0 || formData.ccNumber.length === 0);

    const [isFormValid, setIsFormValid] = useState(false);

    function handleInputChange(event: ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
        const { name, value } = event.target;

        setFormData(prevFormData => {
            const newFormData = {...prevFormData, [name]: value};

            validateInput(name, value, newFormData);

            const formIsValid = isValidForm(newFormData);
            setIsFormValid(formIsValid);

            return newFormData;
        });
    }

    function validateInput(name: string, value: string, formData: {
        name: string;
        address: string;
        phone: string;
        email: string;
        ccNumber: string;
        ccExpiryMonth: number;
        ccExpiryYear: number;
    }) {
        switch (name) {
            case 'name':
                setNameError(value.length < 4 || value.length > 45 ? "Name must be between 4 and 45 characters" : "");
                break;
            case 'address':
                setAddressError(value.length < 4 || value.length > 45 ? "Address must be between 4 and 45 characters" : "");
                break;
            case 'phone':
                setPhoneError(!isMobilePhone(value) ? "Invalid phone number" : "");
                break;
            case 'email':
                setEmailError(!isValidEmail(value) ? "Invalid email address" : "");
                break;
            case 'ccNumber':
                const formattedCCNumber = value.replace(/\D/g, '').substring(0, 16);
                setCcNumberError(!isCreditCard(formattedCCNumber) ? "Invalid credit card number" : "");
                break;
        }
    }

    const placeOrder =  async (customerForm: CustomerForm) =>  {

        const order = { customerForm: customerForm, cart:{items:carts} };

        const orders = JSON.stringify(order);
        console.log(orders);
        const url = 'api/orders';
        const orderDetails: OrderDetails = await axios.post(url, orders,
            {headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response: { data: any; }) => {
                dispatch({type: CartTypes.CLEAR});
                return response.data;
            })
            .catch((error: any)=>console.log(error));
        console.log("order details: ", orderDetails);
        return orderDetails;
    }

    async function submitOrder(event:FormEvent) {
        event.preventDefault();
        console.log("Submit order");
        const isFormCorrect =  isValidForm(formData);
        console.log("Form valid status:", isFormCorrect);
        if (!isFormCorrect) {
            setCheckoutStatus("ERROR");
            console.log("Form validation failed");
        } else {
            setCheckoutStatus("PENDING");
            const orders = await placeOrder({
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                ccNumber: formData.ccNumber,
                ccExpiryMonth: formData.ccExpiryMonth,
                ccExpiryYear: formData.ccExpiryYear,
            })
            if(orders) {
                setCheckoutStatus("OK");
                dispatchOrder({ type: OrderDetailTypes.ADD, item: orders });
                navigate('/confirmation');}
            else{
                console.log("Error placing order");
            }
        }
    }

    if(carts.length == 0) {
        return (
            <div className="checkout-page">
                <div className="empty-cart-container">
                    <div className="empty-cart-box">
                        <p className="empty-cart-message">
                            Your cart is currently empty. Click the "Shop Now!" button to explore our collection and add
                            books to your cart.
                        </p>
                        <button className="continue-shopping-empty" onClick={continueShopping}>
                            Shop Now!
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="checkout-page">
                <section className="checkout-cart-table-view">
                    <div className="checkout-page-body">
                        <div>
                            <form
                                className="checkout-form"
                                onSubmit={(event) => submitOrder(event)}
                                method="post"
                            >
                                <h2 className="cart-headings">1. Shipping Details </h2>
                                <div>
                                    <label htmlFor="fname">Name</label>
                                    <input
                                        type="text"
                                        size={20}
                                        name="name"
                                        id="fname"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <> {nameError && <div className="error"> {nameError}</div>}</>
                                <div>
                                    <label htmlFor="faddress">Address</label>
                                    <input
                                        type="text"
                                        size={20}
                                        name="address"
                                        id="faddress"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <> {addressError && <div className="error"> {addressError}</div>}</>

                                <div>
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="text"
                                        size={20}
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {phoneError && <div className="error">{phoneError}</div>}

                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        size={20}
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {emailError && <div className="error">{emailError}</div>}

                                <div>
                                    <label htmlFor="ccNumber">Card</label>
                                    <input
                                        type="text"
                                        size={20}
                                        name="ccNumber"
                                        id="ccNumber"
                                        value={formData.ccNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {ccNumberError && <div className="error">{ccNumberError}</div>}
                                <div>
                                    <label htmlFor="ccExpiryMonth">Exp Date</label>
                                    <select style={{color: 'black'}} name="ccExpiryMonth" value={formData.ccExpiryMonth}
                                            onChange={handleInputChange}>
                                        {months.map((month, i) => (
                                            <option key={i} value={i + 1}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        style={{color: "black"}}
                                        name="ccExpiryYear"
                                        value={formData.ccExpiryYear}
                                        onChange={handleInputChange}
                                    >
                                        {Array.from({length: 15}, (_, i) => (
                                            <option key={i} value={yearFrom(i)}>
                                                {yearFrom(i)}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <button type="submit" className={`Complete-Purchase ${!isFormValid ? 'disabled' : ''}`}
                                        disabled={!isFormValid}>
                                    Complete Purchase
                                </button>
                            </form>
                        </div>

                        <div className="checkout-box">
                            <h2 className="cart-headings">3. Cost Summary: </h2>
                            <div className="checkout-item">
                                <div className="checkout-label">Items ({cartQuantity}):</div>
                                <div className="checkout-value">${formatCurrency(subtotal)}</div>
                            </div>
                            <div className="checkout-item">
                                <div className="checkout-label">Surcharge:</div>
                                <div className="checkout-value">${surcharge}</div>
                            </div>
                            <hr/>
                            <div className="checkout-item">
                                <div className="checkout-label">Total:</div>
                                <div className="checkout-value-total">${formatCurrency(cartTotalPrice)}</div>
                            </div>
                        </div>

                        <div>
                            {
                                checkoutStatus !== '' ?
                                    <>
                                        <section className="checkoutStatusBox">
                                            {(checkoutStatus === 'ERROR') ?
                                                <div>
                                                    Error: Please fix the problems above and try again.
                                                </div> : (checkoutStatus === 'PENDING' ?
                                                    <div>
                                                        Processing...
                                                    </div> : (checkoutStatus === 'OK' ?
                                                        <div>
                                                            Order placed...
                                                        </div> :
                                                        <div>
                                                            An unexpected error occurred, please try again.
                                                        </div>))}
                                        </section>
                                    </>
                                    : <></>}
                        </div>
                    </div>

                    <div>
                        <ul className="checkout-cart-info">
                            <h2 className="cart-headings">2. Review Items: </h2>
                            <br/>
                            <br/>
                            {
                                carts?.map((item, i) => (
                                    <div className="checkout-cart-book-item">
                                        <div className="checkout-cart-book-image" key={i}>
                                            <img src={require("../assets/images/books/" +
                                                getBookImageUrl(item.book))} alt="title"
                                                 className="checkout-cart-info-img"
                                                 width="20%"
                                                 height="20%"
                                            />
                                        </div>
                                        <div className="checkout-cart-book-info">
                                            <div className="checkout-cart-book-title">{item.book.title}</div>
                                            <div className="checkout-cart-book-author">{item.book.author}</div>
                                            <div className="checkout-cart-book-subtotal">
                                                ${((item.book.price / 100) * item.quantity).toFixed(2)}
                                            </div>
                                            <div className="quantity-adjuster-1">
                                                <button className="btn-cart-delete1"
                                                        onClick={() => {
                                                            dispatch({
                                                                type: CartTypes.REMOVE,
                                                                book: item.book,
                                                                id: item.book.bookId
                                                            });
                                                        }}>
                                                    <i className="fas fa-plus-circle"><FontAwesomeIcon
                                                        icon={faMinusCircle}/></i>
                                                </button>
                                                <span> {item.quantity}</span>
                                                <button className="btn-cart-add1"
                                                        onClick={() => {
                                                            dispatch({
                                                                type: CartTypes.ADD,
                                                                book: item.book,
                                                                id: item.book.bookId
                                                            });
                                                        }}
                                                        disabled={item.quantity >= 99}>
                                                    <i className="fas fa-plus-circle"><FontAwesomeIcon
                                                        icon={faPlusCircle}/></i>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                        </ul>
                    </div>
                </section>
            </div>
        )
    }
}

export default CheckoutPage;