import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import QuestionForm from "../../components/QuestionForm/QuestionForm";
import QuestionPreview from "../../components/QuestionPreview/QuestionPreview";

const NewQuestionPage = () => {
  return (
    <div className="containerWrapper">
      <Navbar />

      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-7">
            <QuestionForm />
          </div>
          <div className="col-md-5">
            <QuestionPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewQuestionPage;
