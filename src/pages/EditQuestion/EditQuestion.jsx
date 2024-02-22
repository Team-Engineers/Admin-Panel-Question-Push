import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import QuestionUpdate from "../../components/QuestionUpdate/QuestionUpdate";

const EditQuestion = () => {
  return (
    <div className="containerWrapper">
      <Navbar />
      <QuestionUpdate />
    </div>
  );
};

export default EditQuestion;
