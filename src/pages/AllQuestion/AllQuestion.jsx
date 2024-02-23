import React from "react";
import "../HomePage/HomePage.css";
import Navbar from "../../components/Navbar/Navbar";
import TopicWiseQuestion from "../../components/TopicWiseQuestion/TopicWiseQuestion";
const AllQuestion = () => {

  return (
    <div className="containerWrapper mt-5">
      <Navbar />
      <TopicWiseQuestion/>
    </div>
  );
};

export default AllQuestion;
