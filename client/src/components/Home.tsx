import '../assets/css/global.css';
import '../assets/css/Home.css'
import BlackPantherImage from '../assets/images/books/Black Panther.jpg';
import B1Image from '../assets/images/books/Miles Morales.jpg';
import B2Image from '../assets/images/books/Shot Clock.jpg';
import B3Image from '../assets/images/books/Diary of a Wimpy Kid - The  GetAway.jpg';
import B4Image from '../assets/images/books/Dr Strange.jpg';
import B5Image from '../assets/images/books/Big Nate - Hug It Out.jpg';
import { Link } from 'react-router-dom';


function Home() {
    return (

        <div className="home-page">
      <section className="category-images container">
        <div className="book-of-the-day">
          <div className="book-image">
            <img src={BlackPantherImage} alt="Black Panther: Battle For Wakanda" />
          </div>
          <div className="book-info">
            <h1>BOOK OF THE DAY</h1>
            <h2>Black Panther: Battle For Wakanda</h2>
            <p className="author">By Brandon T Snider</p>
            <p className="description">
              "Experience the thrilling world of Wakanda in 'Black Panther: Battle for Wakanda'! Dive into a gripping tale of power, loyalty, and heroism as the Black Panther defends his kingdom against formidable foes. Don't miss this action-packed comic that brings the rich culture and unyielding spirit of Wakanda to life! Join the adventure and immerse yourself in the vibrant world of Wakanda like never before, preparing for an exhilarating journey that will leave you on the edge of your seat until the very last page!"</p>
            <div className="index_add_to_cart">
              {/*<button type="button">Add to Cart</button>*/}
            </div>
          </div>
        </div>
      </section>
      <section className="welcome-text flow-content container dark-background">
        <div className="rectangle">
          <h2>Buy 5 books today and get 20% discount!</h2>
        </div>
        <div className="promotion">
            <div className="book-carousel">
              <div className="carousel-track">
                <img src={B1Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B2Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B3Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B4Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B5Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B1Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B2Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B3Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B4Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B5Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B1Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B2Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B3Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B4Image} alt="Black Panther: Battle For Wakanda" />
                <img src={B5Image} alt="Black Panther: Battle For Wakanda" />
              </div>
            </div>
          <div className="shop-now">
            <Link to = "/categories/comics">
              <button type="button">SHOP NOW!</button>
            </Link>
          </div>
        </div>     
      </section>
    </div>
  );
}

export default Home;
