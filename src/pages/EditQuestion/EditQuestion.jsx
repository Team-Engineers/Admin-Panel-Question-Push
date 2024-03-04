import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import QuestionUpdate from "../../components/QuestionUpdate/QuestionUpdate";
import SidePanel from "../../components/SidePanel/SidePanel";
import QuestionPreview from "../../components/QuestionPreview/QuestionPreview";

const EditQuestion = () => {
  return (
    <div className="containerWrapper">
      <Navbar />

      <div className="subContainer">

        <SidePanel width = "5%"/>
        <div className="formContainer mt-3 w-100" style={{ marginLeft: "5%" }}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-7">
                <QuestionUpdate />
              </div>
              <div className="col-md-5">
                <QuestionPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
