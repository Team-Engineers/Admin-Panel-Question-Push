import React, { useContext, useState } from 'react';
import "../MocktestForm/MocktestForm.css"
import { GeneralContext } from '../../context/GeneralContext';

const MocktestForm = () => {

    const generalContext = useContext(GeneralContext);
    const [formData, setFormData] = useState(
    {
        title: '',
        description: '',
        subjects: '',
        entranceExams: '',
        timing: 0,
        totalMarks: 0,
        maximumQuestionsAllowedToAttempt: 0,
        difficulty: ''
    });

    const handleChange =  (e) => 
    {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();             
        
        let {title , description , timing , totalMarks , maximumQuestionsAllowedToAttempt , difficulty , ...rest} = formData;
        let entranceExams = formData.entranceExams.split(',');
        let subjects = formData.subjects.split(',');
        
        const newMocktest = await fetch('https://ourntamockpapers.onrender.com/api/mocktest/createMocktest',
        {
            method : "POST",
            headers :
            {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({title , description , timing , totalMarks , maximumQuestionsAllowedToAttempt , difficulty , entranceExams , subjects})
        });

        const savedNewMocktest = await newMocktest.json();

        if(savedNewMocktest.success) generalContext.fetchAllMocktests();

                
        setFormData({
        title: '',
        description: '',
        subjects: '',
        entranceExams: '',
        timing: 0,
        totalMarks: 0,
        maximumQuestionsAllowedToAttempt: 0,
        difficulty: ''
        });
    };

    return (
        <div className='formSubContainer'>
            <h2>Create New Mocktest</h2>

            <form onSubmit={handleSubmit} className='formBox'>
                <div>
                    <label for="title">Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} id='title' />
                </div>

                <div>
                    <label for="description">Description:</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} id='description'/>
                </div>

                <div>
                    <label for="subjects">Subjects (comma-separated):</label>
                    <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} id='subjects'/>
                </div>

                <div>
                    <label for="entranceExams">Entrance Exams (comma-separated):</label>
                    <input type="text" name="entranceExams" value={formData.entranceExams} onChange={handleChange} id='entranceExams'/>
                </div>

                <div>
                    <label for="timing">Timing (minutes):</label>
                    <input type="number" name="timing" value={formData.timing} onChange={handleChange} id='timing' />
                </div>

                <div>
                    <label for="totalMarks">Total Marks:</label>
                    <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} id='totalMarks' />
                </div>

                <div>
                    <label for="maximumQuestionsAllowedToAttempt">Maximum Questions Allowed To Attempt:</label>
                    <input type="number" name="maximumQuestionsAllowedToAttempt" value={formData.maximumQuestionsAllowedToAttempt} onChange={handleChange} id='maximumQuestionsAllowedToAttempt' />
                </div>

                <div>
                    <label for="difficulty">Difficulty:</label>
                    <input type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} id='difficulty' />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default MocktestForm