import CartTable from "./CartTable";
import '../assets/css/Cart.css';
import {Link} from "react-router-dom";

function Cart() {
    return (
        <div className="cart-page">
            <CartTable/>
            {/*<div className="text-background">*/}
            {/*    <h3 className="wait-text">*/}
            {/*        Page will be implemented soon, Thank you for your patience! (:*/}
            {/*    </h3>*/}
            {/*</div>*/}
            {/*<div className="shop-now">*/}
            {/*    <Link to="/checkout">*/}
            {/*        <button type="button">Checkout</button>*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </div>
    );
}

export default Cart;
