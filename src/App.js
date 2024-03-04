import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import NewQuestionPage from "./pages/NewQuestionPage/NewQuestionPage";
import AllQuestion from "./pages/AllQuestion/AllQuestion";
import EditQuestion from "./pages/EditQuestion/EditQuestion";
import Login from "./pages/login/Login";
import PrivateRoutes from "./utils/PrivateRoutes";
import Nopage from "./pages/NoPage/NoPage";

function App() {
  const isUserSignedIn = () => {
    const tokenData = JSON.parse(localStorage.getItem("accessToken"));
    return tokenData && new Date().getTime() < tokenData.expiry;
  };

  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route exact path="/" element={<HomePage />} />

          <Route exact path="/new-question" element={<NewQuestionPage />} />
          <Route exact path="/all-question" element={<AllQuestion />} />
          <Route exact path="/editQuestion/:id" element={<EditQuestion />} />
          <Route path="*" element={<Nopage />} />
        </Route>  
        {isUserSignedIn() ? (
          <Route exact path="/" element={<HomePage />} />
        ) : (
          <Route exact path="/login" element={<Login />} />
        )}
      </Routes>
    </>
  );
}

export default App;
