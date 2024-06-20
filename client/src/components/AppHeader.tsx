import HeaderDropdown from './HeaderDropdown';
import '../assets/css/global.css'
import '../assets/css/AppHeader.css';
import { Link } from 'react-router-dom';
import LogoImage from '../assets/images/site/Logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faUser, faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import {useContext} from "react";
import {CartStore} from "../contexts/CartContext";
function AppHeader(){
  const {carts} = useContext(CartStore);
  const cartCount = carts.reduce((total, item) => total + item.quantity, 0);
  // const cartCount = 3;
  return(
  
  <header className="header">
      <div className="header-container">  
        <div className="logo">
          <Link to="/">
            <img src={LogoImage} alt="LibroMart Logo" className="logo-image"/>
          </Link>
        </div>
        <div className="top-row">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 className="text-logo">LibroMart</h2>
          </Link>
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="search" placeholder="Search books, authors or ISBNs"/>            
          </div>
          <div className="icons">
            <Link to="#" className="icon-link"><FontAwesomeIcon icon={faHeart} /></Link>
            <Link to="/cart" className="icon-link">
              <FontAwesomeIcon icon={faShoppingCart}/>
              <span className="cart-count">{cartCount}</span>
            </Link>
            <Link to="#" className="icon-link"><FontAwesomeIcon icon={faUser} /></Link>
          </div>
        </div>
      </div>
      <nav className="navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          {/* <li className="header-dropdown"> */}
            {/* <div className="categories-button">Categories <FontAwesomeIcon icon={faCaretDown} /></div> */}
            {/*<HeaderDropdown catList={props.catList}/>*/}
          <HeaderDropdown />
          {/* </li> */}
          <li><Link to="/Featured">Featured</Link></li>
          <li><Link to="/Deals">Deals & Coupons</Link></li>
        </ul>
      </nav>
    </header>
)
}
export default AppHeader;

