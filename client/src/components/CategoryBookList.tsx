import   '../types';
import '../assets/css/CategoryBookList.css';
import { useParams } from 'react-router-dom';
import CategoryBookListItem from './CategoryBookListItem';
import CategoryNav from './CategoryNav';
import  "../types";
import {BookItem, catProp} from "../types";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import { CategoryItem } from '../types';
import { Category } from '../contexts/CategoryContext';

function CategoryBookList(props:catProp) {
  const { catId } = useParams();
  const [books, setBooks] = useState([]);

    const categories = useContext<CategoryItem[]>(Category);

    useEffect(() => {
      axios
          .get(`/SanjeevBookstoreReactTransact/api/categories/name/${catId}/books/`)
          .then((response) => setBooks(response.data))
  }, [catId]);
  return (
    <div className ="category-page">
      <CategoryNav categories = {categories}/>
          <ul className="book-lists">
              {books.map((book:BookItem) => (
                  <CategoryBookListItem  
                    key={book.bookId}
                    bookId={book.bookId} 
                    isPublic={book.isPublic} 
                    rating={book.rating}
                    price={book.price} 
                    title={book.title} 
                    author={book.author}
                    description={book.description}
                    category={book.category}
                    categoryId={book.categoryId}
                  />))}
          </ul>
      
    </div>
)
}

export default CategoryBookList;
