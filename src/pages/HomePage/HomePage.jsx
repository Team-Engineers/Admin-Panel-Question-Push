import React, { useContext } from "react";
import "../HomePage/HomePage.css";
import SidePanel from "../../components/SidePanel/SidePanel";
import MocktestForm from "../../components/MocktestForm/MocktestForm";
import QuestionFrom from "../../components/QuestionForm/QuestionForm";
import Navbar from "../../components/Navbar/Navbar";
import { GeneralContext } from "../../context/GeneralContext";

const HomePage = () => {
  const generalContext = useContext(GeneralContext);

  return (
    <div className="homeContainer">
      <Navbar />

      <div className="subContainer">
        <SidePanel />

        <div className="formContainer" style={{ marginLeft: "20%" }}>
          {generalContext.isMocktestForm ? <MocktestForm /> : <QuestionFrom />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
