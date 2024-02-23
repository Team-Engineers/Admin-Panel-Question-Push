import './App.css';
import { Routes , Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import NewQuestionPage from './pages/NewQuestionPage/NewQuestionPage';



function App() {

  return (
    <>
      <Routes>
        <Route exact path='/' element={<HomePage/>}/>
        <Route exact path='/new-question' element={<NewQuestionPage/>}/>
      </Routes>
    </>
  );
}

export default App;
