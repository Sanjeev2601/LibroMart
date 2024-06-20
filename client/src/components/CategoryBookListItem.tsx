import '../assets/css/CategoryBookListItem.css';
import '../types'
import "../types";
import ReadNow from '../assets/images/books/Dialogue_box.png';
import ReadNowPopup from './ReadNowPopup'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import {BookItem} from "../types";
import {useContext, useEffect, useState} from 'react';
import {CartTypes} from "../reducers/CartReducer";
import {CartStore} from "../contexts/CartContext";

const bookImageFileName =  (book:BookItem) => {
  let name = book.title;
  name = name.replace(/ /g, " ");
  name = name.replace(/'/g, "");
  return `${name}.jpg`;
};

function CategoryBookListItem(props:BookItem) {
  const renderStars = (rating: number) => {
    const starArray = [];
    for (let i = 0; i < props.rating; i++) {
      starArray.push(<FontAwesomeIcon key={i} icon={faStar} className="stars-icon" />);
    }
    return starArray;
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const { carts, dispatch } = useContext(CartStore);

  const [bookCount, setBookCount] = useState(() => {
    const item = carts.find(item => item.id === props.bookId);
    return item ? item.quantity : 0;
  });

  useEffect(() => {
    const item = carts.find(item => item.id === props.bookId);
    setBookCount(item ? item.quantity : 0);
  }, [carts, props.bookId]);
  const addBookToCart = () => {
    console.log("Adding book to cart:", props);
    dispatch({ type: CartTypes.ADD, item: props, id: props.bookId });
    console.log(bookCount);
  };
  const removeBookFromCart = () => {
    console.log("Removing book from cart:", props);
    dispatch({ type: CartTypes.REMOVE, item: props, id: props.bookId });
    console.log(bookCount);
  };

  // const updateBookCount = (increment: number) => {
  //   const newCount = bookCount + increment;
  //   if (newCount <= 0) {
  //     dispatch({ type: CartTypes.REMOVE, id: props.bookId });
  //     setBookCount(0);
  //   } else {
  //     // Remove the item and add it again with the new count
  //     dispatch({ type: CartTypes.REMOVE, id: props.bookId });
  //     dispatch({ type: CartTypes.ADD, item: { ...props, count: newCount }, id: props.bookId });
  //     setBookCount(newCount);
  //   }
  // };

  const isHighRating = props.rating > 4;

return (
  <>
  <ul id="book-boxes">
    <li className="book-box">
      <div className="book-image">
        <img src={require('../assets/images/books/' + bookImageFileName(props))}
          alt="book.title"
        />
      </div>
      <div className="book-title">{props.title }</div>
      <div className="book-author">{ props.author }</div>
      <div className="Price-Cart">
        <div className="stars-container">
          {renderStars(props.rating)} {/* Render stars dynamically */}
          <div className="stars-number">${(props.price / 100).toFixed(2)}</div>
        </div>
        {/*<button className="Add-Cart-Button" onClick={addBookToCart}>Add to Cart</button>*/}
        {/*<button className="Add-Cart-Button">Add to Cart</button>*/}
        {bookCount === 0 ? (
            <button className="Add-Cart-Button" onClick={addBookToCart}>Add to Cart</button>
        ) : (
            <div className="quantity-adjuster">
              <button className="btn-cart-delete" onClick={removeBookFromCart}>-</button>
              <span> {bookCount}</span>
              <button className="btn-cart-add" onClick={addBookToCart} disabled={bookCount >= 99}>+</button>
            </div>
        )}
      </div>
      {/*<div className="overlay-image" onClick={togglePopup}>*/}
      {/*<img src={ReadNow} alt="Overlay" />*/}
      {/*  <span className="overlay-text">Read Now!</span>*/}
      {/*</div>*/}
      {isHighRating && (
          <div className="overlay-image" onClick={togglePopup}>
            <img src={ReadNow} alt="Overlay" />
            <span className="overlay-text">Read Now!</span>
          </div>
      )}
    </li>
  </ul>
  {isPopupOpen && <ReadNowPopup book={props} onClose={togglePopup} />}
  </>
)
}
export default CategoryBookListItem;
