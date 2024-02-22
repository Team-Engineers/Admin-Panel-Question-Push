import React, { useContext, useState } from "react";
import "./TopicWiseQuestion.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import { API } from "../../utils/constant";
import { GeneralContext } from "../../context/GeneralContext";
import slugify from "slugify";
const TopicWiseQuestion = () => {
  const generalContext = useContext(GeneralContext);
  const [questionData, setQuestionData] = useState(null);
  const [topic, setTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const fetchAllQuestion = async () => {
    const params = {
      topic: topic,
      limit : 20,
      offset : 0
      // subtopic: subTopic,
    };
    try {
      const response = await axios.get(
        `${API}/question/find-questions`
        , {
          params: params,
        }
      );
      console.log("response", response.data.allQuestions);
      setQuestionData(response.data.allQuestions);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="filter d-flex m-4 gap-3">
            <div className="input-form">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Topic</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={topic}
                  label="Topic"
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {generalContext.topic.map((diff, index) => (
                    <MenuItem value={slugify(diff, "_")} key={index}>
                      {diff}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="input-form">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sub Topic</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={subTopic}
                  label="Sub Topic"
                  onChange={(e) => setSubTopic(e.target.value)}
                >
                  {generalContext.subtopic.map((diff, index) => (
                    <MenuItem value={slugify(diff, "_")} key={index}>
                      {diff}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="col-md-12 text-center p-2">
          <div className="btn btn-primary" onClick={() => fetchAllQuestion()}>
            Fetch Question
          </div>
        </div>
        <div className="col-md-12">
          <div className="d-flex flex-wrap ">
            {questionData?.map((question, index) => (
              <div key={index} className="m-2">
                <div class="card" style={{ width: "18rem", height: "10rem" }}>
                  <img class="card-img-top" src="..." alt="Card image cap" />
                  <div class="card-body">
                    <h5 class="card-title">{question.topic}</h5>
                    <p class="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="#" class="btn btn-primary">
                      Go somewhere
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicWiseQuestion;
