import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import QuestionForm from '../../components/QuestionForm/QuestionForm'

const NewQuestionPage = () => {
  return (
    <div className='container'>
        <Navbar/>
        <QuestionForm/>
    </div>
  )
}

export default NewQuestionPage