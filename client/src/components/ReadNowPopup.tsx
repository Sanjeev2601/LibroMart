import React, {useContext, useState} from 'react';
import '../types'
import "../types";
import '../assets/css/Popup.css'; 
import { BookItem } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMinus, faPlus, faStar} from '@fortawesome/free-solid-svg-icons';
import {CartTypes} from "../reducers/CartReducer";
import {CartStore} from "../contexts/CartContext";

interface ReadNowPopupProps {
    book: BookItem;
    onClose: () => void;
  }

  const bookImageFileName =  (book:BookItem) => {
    let name = book.title;
    name = name.replace(/ /g, " ");
    name = name.replace(/'/g, "");
    return `${name}.jpg`;
  };

function ReadNowPopup({ book, onClose }: ReadNowPopupProps) {
  // You can manage the open/close state of the popup if needed
  // const [isOpen, setIsOpen] = useState(true);
  React.useEffect(() => {
    document.body.classList.add('no-scroll');
    // When the popup closes, re-enable scrolling on the body
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const imageFileName = bookImageFileName(book);

  const renderStars = (rating: number) => {
    const starArray = [];
    for (let i = 0; i < book.rating; i++) {
      starArray.push(<FontAwesomeIcon key={i} icon={faStar} className="stars-icon" />);
    }
    return starArray;
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-container">
        <button className="popup-close-button" onClick={onClose}>×</button>
        <div className="popup-header">
          <div className='popup-image'>
            <img src={require(`../assets/images/books/${imageFileName}`)}
                alt={book.title}
            />
          </div>
          <div className="popup-book-info">
            <h1 className="popup-book-title">{book.title}</h1>
            <p className="popup-book-author">By {book.author}</p>
            {/*<h4 className='popup-category'>Category : {book.category}</h4>*/}
            <h4 className='popup-rating'>Rating : {renderStars(book.rating)} </h4>
            <h4 className='popup-price'>${ (book.price / 100).toFixed(2) }</h4>
          </div>
        </div>
        <div className="popup-content">
          <p>{book.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ReadNowPopup;
