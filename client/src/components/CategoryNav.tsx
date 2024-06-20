import '../assets/css/CategoryNav.css'
import '../assets/css/global.css'
import { useLocation, Link } from 'react-router-dom';
import { CategoryItem } from '../types';

interface CategoryNavProps {
  categories: CategoryItem[];
}

function CategoryNav({categories}: CategoryNavProps) {
  const location = useLocation();

  const isSelectedCategory = (categoryName : string) => {
    // Check if the current path includes the category name
    return location.pathname.includes(categoryName.toLowerCase());
  };

  const handleCategorySelect = (categoryName: string) => {
    localStorage.setItem('recentCategory', categoryName.toLowerCase());
    console.log("Category selected: ", categoryName);
  };

  return (
  <nav className="category-nav">
    <ul className="category-buttons">
      {categories.map((category) => (
          <li key={category.categoryId}
              className={`button ${isSelectedCategory(category.name) ? 'selected-category-button' : 'unselected-category-button'}`}>
            <Link to={`/categories/${category.name.toLowerCase()}`}
                  onClick={() => handleCategorySelect(category.name)}>
              {category.name}
            </Link>
          </li>
          ))}

    </ul>
  </nav>
)
}

export default CategoryNav;

