import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import Home from './components/Home'
import CategoryBookList from './components/CategoryBookList';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom"
import {useContext} from "react";
import { Category } from './contexts/CategoryContext';
import { CategoryItem } from './types';
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Deals from "./components/Deals";
import Featured from "./components/Featured";
import Confirmation from "./components/Confirmation";

function App() {
    const categories = useContext<CategoryItem[]>(Category);

    return (
        <Router basename = {"SanjeevBookstoreReactTransact"}>
            <AppHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<CategoryBookList catList={categories} />}>
                    <Route path=":catId" element={<CategoryBookList catList={categories} />} />
                </Route>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/featured" element={<Featured />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>

            <AppFooter />

        </Router>
    );
}

export default App;