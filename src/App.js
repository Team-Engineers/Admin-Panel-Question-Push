import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import NewQuestionPage from "./pages/NewQuestionPage/NewQuestionPage";
import AllQuestion from "./pages/AllQuestion/AllQuestion";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/new-question" element={<NewQuestionPage />} />
        <Route exact path="/all-question" element={<AllQuestion />} />

      </Routes>
    </>
  );
}

export default App;
