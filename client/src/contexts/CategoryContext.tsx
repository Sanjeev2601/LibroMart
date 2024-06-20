import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { CategoryItem } from '../types';

export const Category = createContext<CategoryItem[] | []>([]);
Category.displayName = 'CategoryContext';

interface CategoryContextProps {
    children: ReactNode; // Add a type for the children prop
}
function CategoryContext({ children }: CategoryContextProps) {
    const [categories, setCategories] = useState<CategoryItem[]>([]);

    useEffect(() => {
        axios
            .get('/SanjeevBookstoreReactTransact/api/categories/')
            .then((response) => setCategories(response.data));
    }, []);

    return (
        <Category.Provider value={categories}>{children}</Category.Provider>
    );
}

export default CategoryContext;