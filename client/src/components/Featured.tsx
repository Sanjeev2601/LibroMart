// import CartList from "./FeaturedList";
import '../assets/css/Featured.css';
import {Link} from "react-router-dom";
import B1Image from "../assets/images/books/Black Panther.jpg";
import B2Image from "../assets/images/books/The Fox Wife.jpg";
import B3Image from "../assets/images/books/Pride and Prejudice.jpg";
import B4Image from "../assets/images/site/F1.jpg";
import B5Image from "../assets/images/site/F2.jpg";
import B6Image from "../assets/images/books/It Ends with Us.jpg";
import B7Image from "../assets/images/books/Bridgerton.jpg";

function Featured() {
    return (
        <div className="featured-page">
            {/*<FeaturedList />*/}
            {/*<div className="text-background">*/}
            {/*    <h3 className="wait-text">*/}
            {/*        Page will be implemented soon, Thank you for your patience! (:*/}
            {/*    </h3>*/}
            {/*</div>*/}
            <div className="fcontainer">
                <div className="fcategory">
                    <div className="NewsImage">
                        <img src={B5Image} alt="Black Panther: Battle For Wakanda"/>
                        <Link to="https://www.gamesradar.com/ultimate-black-panther-1-is-a-perfect-comic-jumping-on-point-for-fans-of-the-mcu-tchalla//">
                            Ultimate Black Panther #1 is a perfect comic jumping on point for fans of the MCU T'Challa
                        </Link>
                        <img src={B4Image} alt="Black Panther: Battle For Wakanda"/>
                        <Link to="https://people.com/camille-kellogg-debuts-queer-pride-and-prejudice-retelling-7547489">
                            Camille Kellogg Decided ‘Pride & Prejudice’ Needed a Queer Retelling, so She Wrote One
                        </Link>
                    </div>
                </div>
                <div className="fcategory">
                    <div className = "fImage">
                        <div className="fbooks">
                            <img src={B1Image} alt="Black Panther: Battle For Wakanda"/>
                            <img src={B2Image} alt="Black Panther: Battle For Wakanda"/>
                            <img src={B3Image} alt="Black Panther: Battle For Wakanda"/>
                        </div>
                        <div className="fshop-now">
                            <Link to="/categories/comics">
                                <button type="button">SHOP NOW!</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="fcategory">
                    <div className="fbg">
                        <div className="fbook-carousel">
                            <div className="fcarousel-track">
                                <img src={B1Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B2Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B3Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B6Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B7Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B1Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B2Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B3Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B6Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B7Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B1Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B2Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B3Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B6Image} alt="Black Panther: Battle For Wakanda"/>
                                <img src={B7Image} alt="Black Panther: Battle For Wakanda"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Featured;
