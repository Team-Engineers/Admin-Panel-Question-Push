import React, { useContext, useState } from "react";
import "./TopicWiseQuestion.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Box,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { API } from "../../utils/constant";
import { GeneralContext } from "../../context/GeneralContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
const TopicWiseQuestion = () => {
  const navigate = useNavigate();
  const generalContext = useContext(GeneralContext);
  const [questionData, setQuestionData] = useState(null);
  const [topic, setTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const confirmDelete = async (id) => {
    const password = prompt("Please enter the admin password:");

    if (password === null) {
      return;
    }

    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (password.trim() === adminPassword.trim()) {
      await handleDelete(id);
    } else {
      toast.error("Incorrect admin password");
    }
  };
  // Function to handle delete action
  const handleDelete = async (id) => {

    try {
      const url = `${API}/question/delete-question/${id}`;
      await fetch(url, {
        method: "DELETE",
      });

      toast.success("Item deleted successfully!");
    } catch (error) {
      // console.log("error", error);
      toast.error("Error in deleting!");
    }
    toggleModal();
  };
  const fetchAllQuestion = async () => {
    const params = {
      topic: topic,
    };
    if (subTopic) {
      params.subTopic = subTopic;
    }
    try {
      const response = await axios.get(`${API}/question/find-questions`, {
        params: params,
      });
      console.log("response", response.data.requestedData);
      setQuestionData(response.data.requestedData);
      generalContext.setOtherQuestions(response.data.requestedData);
    } catch (error) {
      // console.log("error", error);
    }
  };

  return (
    <div className="container-fluid">
      <ToastContainer />

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
                <div class="card" style={{ width: "18rem", height: "12rem" }}>
                  <div class="card-body">
                    <h5 class="card-title">{question.topic}</h5>
                    <p class="card-text">
                      subQuestions -{" "}
                      {question.subQuestions ? question.subQuestions.length : 0}
                    </p>
                    <p class="card-text d-flex flex-grow gap-2">
                      entranceExam -{" "}
                      {question.entranceExam?.map((exam, index) => (
                        <div key={index}>
                          <p>{exam}</p>
                        </div>
                      ))}
                    </p>
                    <p>
                      updatedAt -{" "}
                      {new Date(question.updatedAt).toLocaleString()}
                    </p>
                    <div className="action d-flex justify-content-between align-items-center">
                      <div
                        onClick={() =>
                          navigate(`/editQuestion/${question._id}`)
                        }
                        class="btn btn-primary mt-2"
                      >
                        <i class="fa-regular fa-pen-to-square"></i>
                      </div>

                      <div className="btn btn-danger" onClick={toggleModal}>
                        <i className="fa-solid fa-trash"></i>
                      </div>
                      <Modal
                        open={showModal}
                        onClose={toggleModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            p: 4,
                          }}
                        >
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            Confirm Delete
                          </Typography>
                          <Typography
                            id="modal-modal-description"
                            sx={{ mt: 2 }}
                          >
                            Are you sure you want to delete?
                          </Typography>
                          <Button
                            onClick={() => confirmDelete(question._id)}
                            variant="contained"
                            color="primary"
                            sx={{ mr: 2, mt: 2 }}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={toggleModal}
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 2 }}
                          >
                            No
                          </Button>
                        </Box>
                      </Modal>
                    </div>
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
