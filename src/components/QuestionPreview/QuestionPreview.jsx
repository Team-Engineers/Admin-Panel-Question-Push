import React, { useContext } from "react";
import { GeneralContext } from "../../context/GeneralContext";
import "./QuestionPreview.css";
import { MathText } from "../MathJax/MathText";
const QuestionPreview = () => {
  const generalContext = useContext(GeneralContext);
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <section className="ps-2 vertical-line h-100 mt-5">
      <div className="questionPreview">
        {generalContext.previewData.subQuestions ? (
          <>
            <div>
              <h4>Paragraph:</h4>
              {generalContext.previewData?.questionTextAndImages?.map(
                (item, index) => (
                  <div key={index}>
                    <MathText
                      className="mb-2 question-wrapper"
                      text={item.text}
                      textTag="h6"
                    />
                    <img
                      className="question-image"
                      src={item.image}
                      alt={`Img ${index + 1}`}
                    />
                  </div>
                )
              )}
            </div>
          </>
        ) : null}

        <div className="subQuestionContainer">
          <h4>
            {generalContext.previewData?.subQuestions && "Sub"} Question
            {generalContext.previewData?.subQuestions && "s"}:
          </h4>

          <div>
            {generalContext.previewData?.subQuestions?.map(
              (subQuestion, index) => (
                <div key={index} className="subQuestion">
                  {generalContext.previewData?.subQuestions && (
                    <h5>Sub Question {index + 1}</h5>
                  )}

                  <div id="question-details flex-grow">
                    <div>
                      <p>
                        Correct Option Index:
                        {
                          generalContext.previewData?.subQuestions
                            ?.correctOptionIndex
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    {/* Input section for questionTextAndImages */}
                    <h5>Question Text and Images:</h5>
                    {subQuestion.questionTextAndImages.map((item, idx) => (
                      <div key={idx}>
                        <MathText
                          className="mb-2 question-wrapper"
                          text={item.text}
                          textTag="h6"
                        />
                        <img
                          className="question-image"
                          src={item.image}
                          alt={`Img ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <h5>Options :</h5>
                    {subQuestion.options.map((item, idx) => (
                      <div key={idx} className="option-wrapper">
                        <span className="option-alphabet">
                          {alphabets[idx]}
                        </span>
                        <div className="d-flex align-items-center justify-content-start gap-3 w-100 align-items-center ">
                          <MathText
                            className="mb-2  question-wrapper"
                            text={item.text}
                            textTag="h6"
                          />
                          <img
                            className="question-image"
                            src={item.image}
                            alt={`Img ${idx + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h5>Explanations :</h5>
                    <div className="explanation-wrapper">
                      {subQuestion.explanation.map((item, idx) => (
                        <div key={idx}>
                          <MathText
                            className="mb-2 question-wrapper"
                            text={item.text}
                            textTag="h6"
                          />
                          <img
                            className="question-image"
                            src={item.image}
                            alt={`Img ${idx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionPreview;
