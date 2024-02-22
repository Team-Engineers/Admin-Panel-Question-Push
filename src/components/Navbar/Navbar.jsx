import React, { useContext } from "react";
import "../Navbar/Navbar.css";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../../context/GeneralContext";

const Navbar = () => {
  const generalContext = useContext(GeneralContext);
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <h2>Admin Dashboard</h2>

      <ul>
        <li
          onClick={() => {
            generalContext.setIsMocktestMenu(true);
            navigate("/");
          }}
        >
          Mocktest List{" "}
          {/* {generalContext.isMocktestMenu && <div className="underline"></div>} */}
        </li>
        <li
          onClick={() => {
            generalContext.setIsMocktestMenu(false);
            generalContext.setMocktestId("");
            navigate("/new-question");
          }}
        >
          Create Questions{" "}
          {/* {!generalContext.isMocktestMenu && <div className="underline"></div>} */}
        </li>

        <li
          onClick={() => {
            generalContext.setIsMocktestMenu(false);
            generalContext.setMocktestId("");
            navigate("/all-question");
          }}
        >
          Pushed Questions{" "}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
