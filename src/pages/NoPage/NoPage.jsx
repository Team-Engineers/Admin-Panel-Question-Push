import React from "react";
import "./NoPage.css";
import { Link } from "react-router-dom";

const Nopage = () => {
  return (
    <section className="noPage">
      <div id="notfound">
        <div className="notfound-bg">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="notfound">
          <div className="notfound-404">
            <h1>404</h1>
          </div>
          <h2>Page Not Found</h2>
          <p>
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </p>
          <Link to="https://cuet-alpha.vercel.app/">Homepage</Link>
          <div className="notfound-social d-none">
            <a href="https://www.facebook.com/officialTIET">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/tietofficial/">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="https://in.pinterest.com/pin/1061160730921621150/">
              <i className="fa fa-pinterest"></i>
            </a>
            <a href="https://www.linkedin.com/school/tietofficial/">
              <i className="fa fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nopage;
