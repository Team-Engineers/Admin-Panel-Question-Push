import React from "react";
import "./TopicWiseQuestion.css";
import { Button } from "@mui/material";
import axios from "axios";
import { API } from "../../utils/constant";
const TopicWiseQuestion = () => {
  const fetchAllQuestion = async () => {
    try {
      const response = await axios.get(`${API}/all-questions`);
      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container">
      <div className="col-md-6">
        <Button onClick={() => fetchAllQuestion()}>Fetch Question</Button>
      </div>
      <div className="col-md-6"></div>
    </div>
  );
};

export default TopicWiseQuestion;
