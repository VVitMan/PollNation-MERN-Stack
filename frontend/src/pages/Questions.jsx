// // File: src/pages/Questions.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000';

// // Questions Component
// function Questions() {
//   const [questions, setQuestions] = useState([]);
//   const [questionText, setQuestionText] = useState('');
//   const user = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   const fetchQuestions = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/questions`, {
//         headers: { Authorization: `Bearer ${user?.token}` }
//       });
//       setQuestions(response.data);
//     } catch (error) {
//       console.error('Error fetching questions', error);
//     }
//   };

//   const handleCreate = async () => {
//     try {
//       await axios.post(`${API_BASE_URL}/questions`, { questionText }, {
//         headers: { Authorization: `Bearer ${user?.token}` }
//       });
//       setQuestionText('');
//       fetchQuestions();
//     } catch (error) {
//       console.error('Error creating question', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/questions/${id}`, {
//         headers: { Authorization: `Bearer ${user?.token}` }
//       });
//       fetchQuestions();
//     } catch (error) {
//       console.error('Error deleting question', error);
//     }
//   };

//   return (
//     <div className="questions-container">
//       <h2>Your Questions</h2>
//       <div>
//         <input type="text" placeholder="Enter your question" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
//         <button onClick={handleCreate}>Create Question</button>
//       </div>
//       <ul>
//         {questions.map((question) => (
//           <li key={question._id}>
//             {question.questionText}
//             <button onClick={() => handleDelete(question._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Questions;