import React, { useContext, useEffect, useState } from "react";
import "../QuestionForm/QuestionForm.css";
import { GeneralContext } from "../../context/GeneralContext";
import { storage } from "../../config/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import slugify from "slugify";
import { API } from "../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const QuestionUpdate = () => {
  const { id } = useParams();
  const generalContext = useContext(GeneralContext);

  const [entranceExamNames, setEntranceExamNames] = useState([]);
  const [isSubquestion, setIsSubquestion] = useState(false);
  const [otherQuestions, setOtherQuestions] = useState([]);

  // Version 2
  const [formData, setFormData] = useState({
    questionTextAndImages: [{ text: "", image: "" }],
    difficulty: "",
    topic: "",
    subject: "",

    subTopic: "",
    entranceExam: [],
    subQuestions: [
      {
        questionTextAndImages: [{ text: "", image: "" }],
        options: [{ text: "", image: "" }],
        correctOptionIndex: "",
        explanation: [{ text: "", image: "" }],
        difficulty: "",
        positiveMarks: "",
        negativeMarks: "",
      },
    ],
    createdBy: "",
    source: "",
  });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const changeIsSubquestion = (event) => {
    setIsSubquestion(!isSubquestion);
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        _id: id,
      };
      try {
        const response = await axios.get(`${API}/question/find-questions`, {
          params: params,
        });
        setFormData(response.data.requestedData[0]);
        const params2 = {
          subject: response.data.requestedData[0].subject,
          topic: response.data.requestedData[0].topic,
        };
        if (response.data.requestedData[0].subTopic) {
          params2.subTopic = response.data.requestedData[0].subTopic;
        }
        try {
          const response2 = await axios.get(`${API}/question/find-questions`, {
            params: params2,
          });
          setOtherQuestions(response2.data.requestedData);
        } catch (error) {
          // console.log("error", error);
        }
      } catch (error) {
        // console.log("error", error);
      }
    };
    fetchData();
  }, [id]);

  generalContext.setCurrentTopic(formData?.topic);
  generalContext.setPreviewData(formData);
  generalContext.setOtherQuestions(otherQuestions);

  const handleChange = (e, index, fieldName, subFieldName, subIndex) => {
    const { name, value, files } = e.target;
    const newFormData = { ...formData };

    if (subFieldName) {
      if (
        subFieldName === "questionTextAndImages" ||
        subFieldName === "options" ||
        subFieldName === "explanation"
      ) {
        if (name === "image") {
          newFormData[fieldName][index][subFieldName][subIndex][name] =
            files[0];
        } else {
          newFormData[fieldName][index][subFieldName][subIndex][name] = value;
        }
      } else {
        newFormData[fieldName][index][name] = value;
      }
    } else if (fieldName === "questionTextAndImages") {
      if (name === "image") {
        newFormData[fieldName][index][name] = files[0];
      } else {
        newFormData[fieldName][index][name] = value;
      }
    } else {
      newFormData[fieldName] = value;
    }
    // console.log("noew form data",newFormData)
    setFormData(newFormData);
  };

  const handleAddField = (fieldName, index, subFieldName) => {
    const newFormData = { ...formData };

    if (subFieldName) {
      newFormData[fieldName][index][subFieldName].push({ text: "", image: "" });
    } else {
      newFormData[fieldName].push({ text: "", image: "" });
    }
    setFormData(newFormData);
  };

  const handleAddSubQuestion = () => {
    const newSubQuestions = [
      ...formData.subQuestions,
      {
        questionTextAndImages: [{ text: "", image: "" }],
        options: [{ text: "", image: "" }],
        correctOptionIndex: "",
        explanation: [{ text: "", image: "" }],
        difficulty: "",
        positiveMarks: "",
        negativeMarks: "",
      },
    ];
    setFormData({ ...formData, subQuestions: newSubQuestions });
  };

  const handleAddQuestionTextAndImages = (index) => {
    handleAddField("subQuestions", index, "questionTextAndImages");
  };

  const handleAddOption = (index) => {
    handleAddField("subQuestions", index, "options");
  };

  const handleAddExplanation = (index) => {
    handleAddField("subQuestions", index, "explanation");
  };

  const handleChangeEntranceExams = (event) => {
    const {
      target: { value },
    } = event;
    setEntranceExamNames(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    // formData.entranceExam = entranceExamNames;
  };

  const handleImageUpload = async (arr) => {
    for (let obj of arr) {
      if (!obj.image) continue;

      if (
        typeof obj?.image === "string" &&
        obj?.image?.startsWith("https://firebasestorage.googleapis.com")
      ) {
        // console.log("Image already uploaded:", obj.image);
        continue;
      }

      // console.log("Uploading image:", obj.image);

      const name = +new Date() + "-" + obj.image.name;
      const imageRef = ref(storage, `questionImage/${name}`);

      // console.log("Image reference created:", imageRef);

      try {
        await uploadBytes(imageRef, obj.image);
        const url = await getDownloadURL(imageRef);
        obj.image = url;
        // console.log("Image uploaded and URL updated:", obj.image);
      } catch (error) {
        toast.error(error?.data?.msg);
      }
    }
  };

  const handleAllFilesUpload = () => {
    const anArray = [];
    anArray.push(formData.questionTextAndImages);
    for (let subquestion of formData.subQuestions) {
      anArray.push(subquestion.questionTextAndImages);
      anArray.push(subquestion.options);
      anArray.push(subquestion.explanation);
    }
    return anArray;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const updatedEntranceExam = entranceExamNames;
    // const updatedFormData = generalContext.mocktestId.length ? {...formData , entranceExam : updatedEntranceExam , mocktestId : generalContext.mocktestId} : {...formData , entranceExam : updatedEntranceExam };
    // console.log(updatedFormData);

    const anArray = handleAllFilesUpload();

    await Promise.all(anArray.map(handleImageUpload))
      .then(async () => {
        const updatedEntranceExam = entranceExamNames;
        const updatedFormData = generalContext.mocktestId.length
          ? {
              ...formData,
              entranceExam: updatedEntranceExam,
              mocktestId: generalContext.mocktestId,
            }
          : { ...formData, entranceExam: updatedEntranceExam };

        let url = generalContext.mocktestId.length
          ? `${API}/mocktest/add-question`
          : `${API}/question/update-question`;
        const newQuestion = await fetch(url, {
          method: generalContext.mocktestId.length ? "PATCH" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        });

        const addedNewQuestion = await newQuestion.json();

        if (addedNewQuestion.success) {
          // alert(addedNewQuestion.msg);
          toast.success("Question Updated Successfully");
          // window.location.reload();
        }
      })
      .catch((error) => console.log(error));
  };

  const confirmDelete = async () => {
    const password = prompt("Please enter the admin password:");

    if (password === null) {
      return;
    }

    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (password.trim() === adminPassword.trim()) {
      await handleDeleteAndNavigate();
    } else {
      toast.error("Incorrect admin password");
    }
  };
  const handleDeleteAndNavigate = async (id) => {
    try {
      // Find the index of the question in the array
      const index = otherQuestions.findIndex((question) => question.id === id);

      if (index !== -1) {
        otherQuestions.splice(index, 1);
        const nextIndex = index === otherQuestions.length ? 0 : index;
        let moveTo;
        if (otherQuestions.length > 0) {
          const nextQuestionId = otherQuestions[nextIndex]._id;
          moveTo = `/editQuestion/${nextQuestionId}`;
          // console.log("nextqeution id", nextQuestionId);
        } else {
          moveTo = "/";
        }
        await handleDelete(moveTo);
      } else {
        // Question not found
        toast.error("Question not found");
      }
    } catch (error) {
      // console.error("Error deleting question:", error);
      toast.error("Error deleting question");
    }
  };

  const handleDelete = async (moveTo) => {
    // console.log("moveto value", moveTo);
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
    navigate(moveTo);
  };

  const handleDeleteExplanation = (index, idx) => {
    const newFormData = { ...formData };
    newFormData.subQuestions[index].explanation.splice(idx, 1);
    setFormData(newFormData);
  };

  const handleDeleteOption = (index, idx) => {
    const newFormData = { ...formData };
    newFormData.subQuestions[index].options.splice(idx, 1);
    setFormData(newFormData);
  };

  const handleDeleteQuestionTextandImages = (index, idx) => {
    const newFormData = { ...formData };
    newFormData.subQuestions[index].questionTextAndImages.splice(idx, 1);
    setFormData(newFormData);
  };

  const handleDeleteImage = async (url, index, idx, type) => {
    const updatedFormData = { ...formData };
    if (type === "options") {
      updatedFormData.subQuestions[index].options[idx].image = "";
    }
    if (type === "explanation") {
      updatedFormData.subQuestions[index].explanation[idx].image = "";
    }
    if (type === "questionTextAndImages") {
      updatedFormData.subQuestions[index].questionTextAndImages[idx].image = "";
    }
    setFormData(updatedFormData);

    // If the image has been uploaded to Firebase, delete it from Firebase storage
    if (
      typeof url === "string" &&
      url.startsWith("https://firebasestorage.googleapis.com")
    ) {
      await deleteImage(url);
    } else {
      console.error(
        "Invalid URL or URL does not start with 'https://firebasestorage.googleapis.com'"
      );
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log(
        `Image '${imageUrl}' deleted successfully from Firebase Storage.`
      );
    } catch (error) {
      console.error(
        `Failed to delete image '${imageUrl}' from Firebase Storage:`,
        error
      );
    }
  };

  // console.log(formData);

  return (
    // Version 2
    <div className="questionContainer m-0">
      <ToastContainer />
      {generalContext.mocktestId.length ? (
        <h2>Add New Question in {generalContext.mocktestName}</h2>
      ) : (
        <h2>Update Question</h2>
      )}

      <div
        className="d-flex justify-content-between align-items-center"
        style={{ width: "100%" }}
      >
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Does Question have further subquestions ?
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={isSubquestion}
            onChange={(e) => changeIsSubquestion(e)}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        <div className="btn btn-danger" onClick={toggleModal}>
          Delete
        </div>
      </div>

      <form onSubmit={handleSubmit} className="questionForm">
        <div
          id="question-details"
          className="flex-wrap gap-2 justify-content-start"
        >
          <div className="input-form">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.subject}
                label="Subject"
                onChange={(e) => handleChange(e, null, "subject")}
              >
                {generalContext.subject.map((diff, index) => (
                  <MenuItem value={slugify(diff, "_")} key={index}>
                    {diff}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="input-form">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.topic}
                label="Topic"
                onChange={(e) => handleChange(e, null, "topic")}
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
                value={formData.subTopic}
                label="Sub Topic"
                onChange={(e) => handleChange(e, null, "subTopic")}
              >
                {generalContext.subtopic.map((diff, index) => (
                  <MenuItem value={slugify(diff, "_")} key={index}>
                    {diff}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="input-form">
            <FormControl>
              <InputLabel id="demo-multiple-name-label">
                Entrance Exams
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={entranceExamNames}
                onChange={(e) => handleChangeEntranceExams(e)}
                input={<OutlinedInput label="Entrance Exams" />}
                sx={{ paddingLeft: "2rem" }}
              >
                {generalContext.entranceExams.map((diff, index) => (
                  <MenuItem key={index} value={slugify(diff, "_")}>
                    {diff}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="input-form">
            <FormControl fullWidth>
              <TextField
                id="created-by"
                label="Created By"
                value={formData.name}
                variant="outlined"
                disabled
              />
            </FormControl>
          </div>
          {/* <div className="input-form">
            <FormControl fullWidth>
              <TextField
                id="source"
                value = {formData.source}
                onChange={(e) => handleChange(e, null, "source")}
                label="Source"
                variant="outlined"
              />
            </FormControl>
          </div> */}
          <div className="input-form">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="source-label">Source</InputLabel>
              <Select
                labelId="source-label"
                id="source"
                value={formData.source}
                onChange={(e) => handleChange(e, null, "source")}
                label="Source"
              >
                {/* <MenuItem value="">Select Source</MenuItem> */}
                <MenuItem value="adda247">Adda 247</MenuItem>
                <MenuItem value="ncert">NCERT</MenuItem>
                <MenuItem value="career360">Career 360</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {isSubquestion ? (
          <>
            <div className="input-form">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Difficulty
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.difficulty}
                  label="Paragraph Difficulty"
                  onChange={(e) => handleChange(e, null, "difficulty")}
                >
                  {generalContext.difficulty.map((diff, index) => (
                    <MenuItem value={slugify(diff, "_")} key={index}>
                      {diff}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <h3>Paragraph:</h3>
              {formData.questionTextAndImages.map((item, index) => (
                <div key={index}>
                  <textarea
                    className="textInput"
                    rows={8}
                    name="text"
                    placeholder="Enter Paragraph..."
                    value={item.text}
                    onChange={(e) =>
                      handleChange(e, index, "questionTextAndImages")
                    }
                  ></textarea>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) =>
                      handleChange(e, index, "questionTextAndImages")
                    }
                  />
                </div>
              ))}
              <button
                className="allButtons"
                type="button"
                onClick={() =>
                  handleAddField("questionTextAndImages", null, null)
                }
              >
                Add Paragraph Text and Image
              </button>
            </div>
          </>
        ) : null}

        <div className="subQuestionContainer">
          <h3>
            {isSubquestion && "Sub"} Question{isSubquestion && "s"}:
          </h3>

          <div>
            {formData?.subQuestions?.map((subQuestion, index) => (
              <div key={index} className="subQuestion">
                {isSubquestion && <h4>Sub Question {index + 1}</h4>}

                <div id="question-details flex-grow">
                  <div className="input-form">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Difficulty
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={subQuestion.difficulty}
                        label="Difficulty"
                        name="difficulty"
                        onChange={(e) =>
                          handleChange(e, index, "subQuestions", "difficulty")
                        }
                      >
                        {generalContext.difficulty.map((diff, index) => (
                          <MenuItem value={slugify(diff, "_")} key={index}>
                            {diff}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    <label>Correct Option Index:</label>
                    <input
                      className="textInput"
                      type="number"
                      name="correctOptionIndex"
                      value={subQuestion.correctOptionIndex}
                      onChange={(e) =>
                        handleChange(
                          e,
                          index,
                          "subQuestions",
                          "correctOptionIndex"
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>Positive Marks:</label>
                    <input
                      className="textInput"
                      type="number"
                      name="positiveMarks"
                      value={subQuestion.positiveMarks}
                      onChange={(e) =>
                        handleChange(e, index, "subQuestions", "positiveMarks")
                      }
                    />
                  </div>

                  <div>
                    <label>Negative Marks:</label>
                    <input
                      className="textInput"
                      type="number"
                      name="negativeMarks"
                      value={subQuestion.negativeMarks}
                      onChange={(e) =>
                        handleChange(e, index, "subQuestions", "negativeMarks")
                      }
                    />
                  </div>
                </div>

                <div>
                  {/* Input section for questionTextAndImages */}
                  <h5>Question Text and Images:</h5>
                  {subQuestion.questionTextAndImages.map((item, idx) => (
                    <div key={idx}>
                      <textarea
                        className="textInput"
                        rows={8}
                        name="text"
                        placeholder="Enter Question Text..."
                        value={item.text}
                        onChange={(e) =>
                          handleChange(
                            e,
                            index,
                            "subQuestions",
                            "questionTextAndImages",
                            idx
                          )
                        }
                      ></textarea>
                      <div>
                        <input
                          type="file"
                          name="image"
                          onChange={(e) =>
                            handleChange(
                              e,
                              index,
                              "subQuestions",
                              "questionTextAndImages",
                              idx
                            )
                          }
                        />
                        {item.image && (
                          <button
                            type="button"
                            class="btn btn-danger m-2"
                            onClick={() =>
                              handleDeleteImage(
                                item.image,
                                index,
                                idx,
                                "questionTextAndImages"
                              )
                            }
                          >
                            Delete Image
                          </button>
                        )}
                        <button
                          type="button"
                          class="btn btn-danger m-2"
                          onClick={() =>
                            handleDeleteQuestionTextandImages(index, idx)
                          }
                        >
                          Delete Question
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="allButtons"
                    type="button"
                    onClick={() => handleAddQuestionTextAndImages(index)}
                  >
                    Add Question Text and Image
                  </button>
                  {/* End of input section for questionTextAndImages */}
                </div>

                <div>
                  {/* Input section for options */}
                  <h5>Options :</h5>
                  {subQuestion.options.map((item, idx) => (
                    <div key={idx}>
                      <input
                        className="textInput"
                        type="text"
                        name="text"
                        placeholder="Enter option text"
                        value={item.text}
                        onChange={(e) =>
                          handleChange(e, index, "subQuestions", "options", idx)
                        }
                      />
                      <div>
                        <input
                          type="file"
                          name="image"
                          onChange={(e) =>
                            handleChange(
                              e,
                              index,
                              "subQuestions",
                              "options",
                              idx
                            )
                          }
                        />
                        {item.image && (
                          <button
                            type="button"
                            class="btn btn-danger m-2"
                            onClick={() =>
                              handleDeleteImage(
                                item.image,
                                index,
                                idx,
                                "options"
                              )
                            }
                          >
                            Delete Image
                          </button>
                        )}
                        <button
                          type="button"
                          class="btn btn-danger m-2"
                          onClick={() => handleDeleteOption(index, idx)}
                        >
                          Delete Option
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="allButtons"
                    type="button"
                    onClick={() => handleAddOption(index)}
                  >
                    Add Options
                  </button>
                  {/* End of input section for questionTextAndImages */}
                </div>

                <div>
                  {/* Input section for Explanations */}
                  <h5>Explanations :</h5>
                  {subQuestion.explanation.map((item, idx) => (
                    <div key={idx}>
                      <textarea
                        className="textInput"
                        rows={8}
                        name="text"
                        placeholder="Enter Explanation..."
                        value={item.text}
                        onChange={(e) =>
                          handleChange(
                            e,
                            index,
                            "subQuestions",
                            "explanation",
                            idx
                          )
                        }
                      ></textarea>
                      <div>
                        <input
                          type="file"
                          name="image"
                          onChange={(e) =>
                            handleChange(
                              e,
                              index,
                              "subQuestions",
                              "explanation",
                              idx
                            )
                          }
                        />
                        {item.image && (
                          <button
                            type="button"
                            class="btn btn-danger m-2"
                            onClick={() =>
                              handleDeleteImage(
                                item.image,
                                index,
                                idx,
                                "explanation"
                              )
                            }
                          >
                            Delete Image
                          </button>
                        )}
                        <button
                          type="button"
                          class="btn btn-danger"
                          onClick={() => handleDeleteExplanation(index, idx)}
                        >
                          Delete Explanation
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="allButtons"
                    type="button"
                    onClick={() => handleAddExplanation(index)}
                  >
                    Add Explanations
                  </button>

                  {/* End of input section for questionTextAndImages */}
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
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Are you sure you want to delete?
                    </Typography>
                    <Button
                      onClick={() => confirmDelete()}
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
                {/* Add input fields for options, correctOptionIndex, explanation */}
              </div>
            ))}
          </div>
          {isSubquestion && (
            <button
              className="allButtons"
              type="button"
              onClick={handleAddSubQuestion}
            >
              Add Sub Question
            </button>
          )}
        </div>

        {/* Add input fields for other fields as needed */}
        <button className="allButtons" type="submit">
          Submit
        </button>

        <button
          className="allButtons"
          onClick={() => {
            setFormData({
              questionTextAndImages: [{ text: "", image: "" }],
              difficulty: "",
              topic: "",
              subTopic: "",
              entranceExam: "",
              subQuestions: [
                {
                  questionTextAndImages: [{ text: "", image: "" }],
                  options: [{ text: "", image: "" }],
                  correctOptionIndex: "",
                  explanation: [{ text: "", image: "" }],
                  difficulty: "",
                  positiveMarks: "",
                  negativeMarks: "",
                },
              ],
            });
          }}
        >
          Reset Form
        </button>
      </form>
    </div>
  );
};

export default QuestionUpdate;
