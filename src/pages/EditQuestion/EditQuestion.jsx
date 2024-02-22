import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import QuestionUpdate from "../../components/QuestionUpdate/QuestionUpdate";
import SidePanel from "../../components/SidePanel/SidePanel";

const EditQuestion = () => {
  return (
    <div className="containerWrapper">
      <Navbar />

      <div className="subContainer">
        <SidePanel />

        <div className="formContainer mt-3" style={{marginLeft:"20%"}}>
          <QuestionUpdate />
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
