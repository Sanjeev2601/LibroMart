import '../assets/css/AppFooter.css'
import '../assets/css/global.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {Link} from "react-router-dom";


function AppFooter(){
return(
  <footer className="footer">
        <div className="social-media">
          <h5>Follow us</h5>
          <div className="icons">
            <a href="#" className="icon"><FontAwesomeIcon icon={faFacebook} className="icon-facebook" /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faInstagram} className="icon-instagram" /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faTwitter} className="icon-twitter" /></a>
          </div>
        </div>
        <div className="newsletter">
          {/*<p>Sign up for our newsletter!</p>*/}
          <input type="email" placeholder="E-Mail" /> <button  className="subscribe_footer" type="submit">Subscribe</button>
          <div className="checkbox-container">
            <input type="checkbox" id="subscribe"/> 
            <p>I would like to receive the newsletter. I have read the privacy terms.</p>
          </div>
          <p>© Copyright 2024 | LibroMart</p>
        </div>
        <div className="footer-links">
          <a href="#">Location</a>
          <a href="#">FAQs</a>
          <a href="#">Contact</a>
        </div>
        <div className="copyright">
        </div>
      </footer>
)
}
export default AppFooter;
