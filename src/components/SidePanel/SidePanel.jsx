import React, { useContext, useState } from "react";
import "../SidePanel/SidePanel.css";
import AddIcon from "@mui/icons-material/Add";
import { GeneralContext } from "../../context/GeneralContext";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const SidePanel = () => {
  const generalContext = useContext(GeneralContext);
  const [testId, setTestId] = useState("");

  return (
    <div className="sidePanel">
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
        <AddIcon />
        <p>Add Mocktest</p>
      </div>

      <ul className="mocktestListSection">
        {generalContext.mocktestList.map((test) => (
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
    </div>
  );
};

export default SidePanel;
