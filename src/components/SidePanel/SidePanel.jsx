import React, { useContext, useState } from "react";
import "../SidePanel/SidePanel.css";
import AddIcon from "@mui/icons-material/Add";
import { GeneralContext } from "../../context/GeneralContext";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate, useParams } from "react-router-dom";

const SidePanel = () => {
  const generalContext = useContext(GeneralContext);
  const [testId, setTestId] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="sidePanel">
      {!id ? (
        <>
          <div
            className="addSection"
            onClick={() => {
              generalContext.setIsMocktestForm(true);
              generalContext.setMocktestId("");
            }}
            style={{
              cursor: "pointer",
            }}
          >
            <p className="d-flex justify-content-center align-items-centerx">
              <AddIcon /> Add Mocktest
            </p>
          </div>
          <ul className="mocktestListSection">
            {generalContext?.mocktestList?.map((test) => (
              <li
                key={test._id}
                onClick={() => {
                  generalContext.setMocktestName(test.title);
                  generalContext.setMocktestId(test._id);
                  generalContext.setIsMocktestForm(false);
                  setTestId(test._id);
                }}
                style={{ cursor: "pointer" }}
              >
                <span>{test.title}</span>{" "}
                <span>
                  {testId === test._id ? <KeyboardArrowRightIcon /> : null}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul
          className="mocktestListSection overflow-y-scroll"
          style={{ height: "100vh" }}
        >
          {generalContext?.otherQuestions?.map((question, index) => (
            <div key={index} className="w-100 text-center">
              <p
                className={
                  id === question._id ? "bg-primary text-white w-100" : "none"
                }
                style={{ cursor: "pointer", padding: "10px" }}
                onClick={() => navigate(`/editQuestion/${question._id}`)}
              >
                {index + 1}
              </p>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidePanel;
