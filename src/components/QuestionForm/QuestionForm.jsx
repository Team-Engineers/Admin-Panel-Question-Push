import React, { useContext, useState } from "react";
import "../QuestionForm/QuestionForm.css";
import { GeneralContext } from "../../context/GeneralContext";
import { storage } from "../../config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import slugify from "slugify";
import { API, subdivision } from "../../utils/constant";

const QuestionForm = () => {
  const generalContext = useContext(GeneralContext);

  const [entranceExamNames, setEntranceExamNames] = useState([]);
  const [isSubquestion, setIsSubquestion] = useState(false);

  const changeIsSubquestion = (event) => {
    setIsSubquestion(!isSubquestion);
  };

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
  });
  const [imagePreviews, setImagePreviews] = useState({
    paragraph: [],
    questionTextAndImages: [],
    options: [],
    explanation: [],
  });

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
          const reader = new FileReader();
          const file = files[0];

          reader.onloadend = () => {
            const newImagePreviews = { ...imagePreviews };

            // Update image preview based on subFieldName and subIndex
            newImagePreviews[subFieldName][subIndex] = reader.result;

            // Update state with new image previews
            setImagePreviews(newImagePreviews);

            // Update form data with file object
            newFormData[fieldName][index][subFieldName][subIndex][name] = file;
          };

          if (file) {
            reader.readAsDataURL(file);
          }
        } else {
          newFormData[fieldName][index][subFieldName][subIndex][name] = value;
        }
      } else {
        newFormData[fieldName][index][name] = value;
      }
    } else if (fieldName === "questionTextAndImages") {
      if (name === "image") {
        const reader = new FileReader();
        const file = files[0];

        reader.onloadend = () => {
          setImagePreviews((prevState) => ({
            ...prevState,
            paragraph: [...prevState.paragraph, reader.result],
          }));

          // Update form data with file object
          newFormData[fieldName][index][name] = file;
        };

        if (file) {
          reader.readAsDataURL(file);
        }
      } else {
        newFormData[fieldName][index][name] = value;
      }
    } else {
      newFormData[fieldName] = value;
    }

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

  generalContext.setPreviewData(formData);

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
      if (obj.image === "" || !obj.image?.name) continue;

      const name = +new Date() + "-" + obj.image.name;
      const imageRef = ref(storage, `questionImage/${name}`);

      await uploadBytes(imageRef, obj.image)
        .then(() => {})
        .catch((error) => alert(error));

      await getDownloadURL(imageRef)
        .then((url) => (obj.image = url))
        .catch((error) => alert(error));
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
          : `${API}/question/create-question`;
        const newQuestion = await fetch(url, {
          method: generalContext.mocktestId.length ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        });

        const addedNewQuestion = await newQuestion.json();

        if (addedNewQuestion.success) {
          alert(addedNewQuestion.msg);
          // window.location.reload();
        }
      })
      .catch((error) => console.log(error));
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

  const handleDeleteParagraph = (index) => {
    const newFormData = { ...formData };
    newFormData.questionTextAndImages.splice(index, 1);
    setFormData(newFormData);
  };

  const handleDeleteImage = async (url, index, idx, type) => {
    const updatedFormData = { ...formData };
    if (type === "paragraph") {
      updatedFormData.questionTextAndImages[index].image = "";
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        paragraph: prevPreviews.paragraph.filter((_, i) => i !== idx),
      }));
    }
    if (type === "options") {
      updatedFormData.subQuestions[index].options[idx].image = "";
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        options: prevPreviews.options.filter((_, i) => i !== idx),
      }));
    }
    if (type === "explanation") {
      updatedFormData.subQuestions[index].explanation[idx].image = "";
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        explanations: prevPreviews.explanations.filter((_, i) => i !== idx),
      }));
    }
    if (type === "questionTextAndImages") {
      updatedFormData.subQuestions[index].questionTextAndImages[idx].image = "";
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        questionTextAndImages: prevPreviews.questionTextAndImages.filter(
          (_, i) => i !== idx
        ),
      }));
    }
    setFormData(updatedFormData);
  };

  return (
    // Version 2
    <div className="questionContainer">
      {generalContext.mocktestId.length ? (
        <h2>Add New Question in {generalContext.mocktestName}</h2>
      ) : (
        <h2>Create New Question</h2>
      )}

      <div style={{ width: "100%" }}>
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
      </div>

      <form onSubmit={handleSubmit} className="questionForm">
        <div
          id="question-details"
          className="flex-wrap justify-content-start gap-2"
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
                {subdivision.map((subjectObj, index) => (
                  <MenuItem key={index} value={subjectObj.name}>
                    {subjectObj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {formData.subject &&
            subdivision.find((sub) => sub.name === formData.subject)
              ?.children && (
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
                    {subdivision
                      .find((sub) => sub.name === formData.subject)
                      ?.children.map((topicObj, index) => (
                        <MenuItem key={index} value={topicObj.name}>
                          {topicObj.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            )}

          {/* Render subtopics if topic is selected */}
          {formData.topic &&
            subdivision
              .find((sub) => sub.name === formData.subject)
              ?.children.find((topicObj) => topicObj.name === formData.topic)
              ?.topics && (
              <div className="input-form">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    SubTopic
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.subTopic}
                    label="SubTopic"
                    onChange={(e) => handleChange(e, null, "subTopic")}
                  >
                    {subdivision
                      .find((sub) => sub.name === formData.subject)
                      ?.children.find(
                        (topicObj) => topicObj.name === formData.topic
                      )
                      ?.topics.map((subtopicName, index) => (
                        <MenuItem key={index} value={subtopicName}>
                          {subtopicName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            )}

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
                  <div>
                    <input
                      type="file"
                      name="image"
                      onChange={(e) =>
                        handleChange(e, index, "questionTextAndImages")
                      }
                    />
                    {imagePreviews?.paragraph?.[index] && (
                      <img
                        src={imagePreviews?.paragraph?.[index]}
                        alt={`Paragraph ${index + 1} Preview`}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    )}
                    {item.image && (
                      <button
                        type="button"
                        class="btn btn-danger m-2"
                        onClick={() =>
                          handleDeleteImage(
                            item.image,
                            index,
                            null,
                            "paragraph"
                          )
                        }
                      >
                        Delete Image
                      </button>
                    )}
                    <button
                      type="button"
                      class="btn btn-danger m-2"
                      onClick={() => handleDeleteParagraph(index)}
                    >
                      Delete Paragraph
                    </button>
                  </div>
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
            {formData.subQuestions.map((subQuestion, index) => (
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
                        {imagePreviews?.questionTextAndImages?.[idx] && (
                          <img
                            src={imagePreviews?.questionTextAndImages?.[idx]}
                            alt={`questionTextAndImages ${idx + 1} Preview`}
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        )}
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
                        {imagePreviews?.options?.[idx] && (
                          <img
                            src={imagePreviews?.options?.[idx]}
                            alt={`option ${idx + 1} Preview`}
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        )}
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
                        {imagePreviews?.explanation?.[idx] && (
                          <img
                            src={imagePreviews?.explanation?.[idx]}
                            alt={`Explanation ${idx + 1} Preview`}
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        )}
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

export default QuestionForm;
