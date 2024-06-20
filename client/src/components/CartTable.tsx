import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { BookItem, ShoppingCartItem } from "../types";
import "../assets/css/CartTable.css";
import { CartTypes } from "../reducers/CartReducer";
import { CartStore } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";

const CartTable = () => {
    const [cart, setCart] = useState<ShoppingCartItem[]>([]);

    const bookImageFileName =  (book:BookItem) => {
        let name = book.title;
        name = name.replace(/ /g, " ");
        name = name.replace(/'/g, "");
        return `${name}.jpg`;
    };

    const navigate = useNavigate();

    // const { dispatch } = useContext(CartStore);
    const { carts, dispatch } = useContext(CartStore);
    useEffect(() => {
        const cartFromLocalStorage = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );
        setCart(carts);
    }, [carts]);

    const addQuantity = (id: number) => dispatch({ type: CartTypes.ADD, id });
    const removeQuantity = (id: number) => dispatch({ type: CartTypes.REMOVE, id });

    const clearCart = () => {
        setCart([]);
        dispatch({ type: CartTypes.CLEAR });
        // localStorage.removeItem("cart");
    };

    const getTotalCost = (): number => {
        return cart.reduce(
            (total, cartItem) => total + (cartItem.book.price / 100) * cartItem.quantity,
            0
        );
    };

    const getEstTotalCost = (): number => {
        return ((getTotalCost() * 1.043) - (getTotalCost() * 0.1));
    };

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

    const [isTrue, setIsTrue] = useState(false);

    const handleSubscribeClick = () => {
        const promoInput = (document.getElementById("promoInput") as HTMLInputElement)?.value;
        if (promoInput === "LEBROGEMS") { // Replace "YOUR_COUPON_CODE" with the actual coupon code
            (document.getElementById("errorMessage") as HTMLElement).style.display = "none"; // Hide the error message
            (document.getElementById("DiscountMessage") as HTMLElement).style.display = "block";
            setIsTrue(true);
        } else {
            (document.getElementById("errorMessage") as HTMLElement).style.display = "block"; // Show the error message
            (document.getElementById("DiscountMessage") as HTMLElement).style.display = "none";
            setIsTrue(false);
        }
    };


    if (cart.length === 0) {
        return (
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
        );
    } else {
        return (
            <>
                <div className="cart-container">
                    <div className="cart-table-container">
                        <div>
                            <div className="cart-table">
                                <ul className="cart2">
                                    {/*<li className="table-heading list">*/}
                                    {/*    <div className="heading-book">Book</div>*/}
                                    {/*    <div className="heading-price">Price</div>*/}
                                    {/*    <div className="heading-quantity">Quantity</div>*/}
                                    {/*    <div className="heading-subtotal">Amount</div>*/}
                                    {/*</li>*/}
                                    <thead>
                                    <tr>
                                        <th>Book</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                    </tr>
                                    </thead>
                                    {cart.map(
                                        (item, index) =>
                                            item.quantity > 0 && (
                                                <tr key={item.book.bookId}>
                                                    <td>
                                                        <div className="books-info">
                                                            <img
                                                                src={require("../assets/images/books/" + bookImageFileName(item.book))}
                                                                alt={item.book.title}/>
                                                            <div>
                                                                <span className="book-title">{item.book.title}</span>
                                                                <span className="book-author1">{item.book.author}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="book-price1">
                                                            ${(item.book.price / 100).toFixed(2)}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="book-quantity1">
                                                            <button className="icon-button"
                                                                    onClick={() => removeQuantity(item.book.bookId)}>
                                                                <FontAwesomeIcon icon={faMinus}/>
                                                            </button>
                                                            <span className="quantity">{item.quantity}</span>
                                                            <button className="icon-button"
                                                                    onClick={() => addQuantity(item.book.bookId)} disabled={item.quantity >= 99}>
                                                                <FontAwesomeIcon icon={faPlus}/>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="book-amount1">
                                                            ${((item.book.price / 100) * item.quantity).toFixed(2)}
                                                        </div>
                                                    </td>
                                                </tr>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="cart-summary-container1">
                        <div className="cart-summary-container">
                            <h4 className="cart-summary-title">Promos</h4>
                            <div className="promo-container">
                                <input id="promoInput" type="text" placeholder="Promo Code"/>
                                <button id="subscribeButton" className="promo_code" type="submit"
                                        onClick={handleSubscribeClick}>Apply
                                </button>
                            </div>
                            <div id="errorMessage"
                                 style={{display: 'none', color: 'red', fontSize: 16, marginTop: -25}}>This coupon code
                                doesn't
                                exist
                            </div>
                            <hr/>
                            <h4 className="cart-summary-title">Order Summary</h4>
                            <div className="subtotal-section">
                                <h4>Items: <span style={{fontWeight: 'normal'}}> ${getTotalCost().toFixed(2)} </span>
                                </h4>
                                <h4 id="DiscountMessage" className="DiscountMessage">Discount Applied! (10%)
                                </h4>
                                <h4>Shipping U.S. Standard: <span style={{fontWeight: 'normal'}}> FREE </span></h4>
                                <h4>Sales Tax: <span
                                    style={{fontWeight: 'normal'}}> ${(getTotalCost() * 0.043).toFixed(2)} </span></h4>
                                <hr/>
                                <h4 className="cart-book-title">
                                    {isTrue ?
                                        `Estimated Total: $${getEstTotalCost().toFixed(2)}` :
                                        `Estimated Total: $${(getTotalCost() * 1.043).toFixed(2)}`
                                    }
                                </h4>
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="continue-shopping" onClick={continueShopping}>
                                Continue Shopping
                            </button>
                            <Link to='/checkout'>
                                <button className="proceed-to-checkout">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                        <button className="clear-cart" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                </div>
            </>
        );
    }
};

export default CartTable;
