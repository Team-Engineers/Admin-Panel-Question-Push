import { useState, useEffect, createContext } from "react";
import { API } from "../utils/constant";

export const GeneralContext = createContext();

export const GeneralContextProvider = ({ children }) => {
  let pathname = window.location.pathname;
  const [mocktestList, setMocktestList] = useState([]);
  const [isMocktestForm, setIsMocktestForm] = useState(true);
  const [mocktestId, setMocktestId] = useState("");
  const [mocktestName, setMocktestName] = useState("");
  const [isMocktestMenu, setIsMocktestMenu] = useState(
    pathname === "/new-question" ? false : true
  );
  const [subject, setSubject] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [topic, setTopic] = useState([]);
  const [subtopic, setSubtopic] = useState([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [entranceExams, setEntranceExams] = useState([]);
  const [otherQuestions, setOtherQuestions] = useState([]);
  const [previewData, setPreviewData] = useState({
    questionTextAndImages: [{ text: "", image: "" }],
    difficulty: "",
    topic: "",
    subTopic: "",
    subject: "",  
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

  const fetchAllMocktests = async () => {
    const allMocktest = await fetch(`${API}/mocktest/get-all-mocktests`, {
      method: "GET",
    });

    const allMocktestData = await allMocktest.json();

    if (allMocktestData.success) {
      setMocktestList(allMocktestData.allMocktests);
    }
  };

  const fetchAllSelectFields = async () => {
    const allSelectFields = await fetch(
      `${API}/select-fields/get-select-fields`,
      {
        method: "GET",
      }
    );

    const allSelectFieldsData = await allSelectFields.json();

    // console.log(allSelectFieldsData);

    if (allSelectFieldsData.success) {
      setSubject(allSelectFieldsData.allSelectFields[0].subject);
      setDifficulty(allSelectFieldsData.allSelectFields[0].difficulty);
      setTopic(allSelectFieldsData.allSelectFields[0].topic);
      setSubtopic(allSelectFieldsData.allSelectFields[0].subTopic);
      setEntranceExams(allSelectFieldsData.allSelectFields[0].entranceExams);
    }
  };

  useEffect(() => {
    fetchAllMocktests();

    fetchAllSelectFields();

    setIsMocktestMenu(pathname === "/new-question" ? false : true);
  }, [pathname]);

  return (
    <GeneralContext.Provider
      value={{
        mocktestList,
        setMocktestList,
        fetchAllMocktests,
        isMocktestForm,
        setIsMocktestForm,
        mocktestId,
        setMocktestId,
        subject,
        difficulty,
        topic,
        subtopic,
        entranceExams,
        mocktestName,
        setMocktestName,
        isMocktestMenu,
        setIsMocktestMenu,
        setOtherQuestions,
        otherQuestions,
        setCurrentTopic,
        currentTopic,
        setPreviewData,
        previewData,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
