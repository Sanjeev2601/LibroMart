import '../assets/css/global.css'
import '../assets/css/HeaderDropdown.css';
import { catProp} from '../types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../contexts/CategoryContext';
import { CategoryItem } from '../types';
import {useContext} from "react";

function HeaderDropdown()
{
  const categories = useContext<CategoryItem[]>(Category);
  return (
    <li className="header-dropdown">
    <div className="categories-button">Categories <FontAwesomeIcon icon={faCaretDown} /></div>
    <ul className="dropdown-menu">
        {categories.map((item) => (
          <li key={item.categoryId}>
            <Link to={`/categories/${item.name.toLowerCase()}`}>{item.name}</Link>
          </li>
        ))}
    </ul>
  </li>
)
}
export default HeaderDropdown

