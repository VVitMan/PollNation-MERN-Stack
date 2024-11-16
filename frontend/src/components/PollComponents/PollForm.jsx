// import { useState } from "react";

// export default function PollForm() {
//   const [title, setTitle] = useState("");
//   const [options, setOptions] = useState([
//     { option: "", explanation: "", isCorrect: false },
//     { option: "", explanation: "", isCorrect: false }
//   ]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("/api/poll/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title, options }),
//         credentials: "include", // ส่ง Cookies ไปกับคำขอ
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create poll");
//       }

//       alert("Poll created successfully!");
//       setTitle("");
//       setOptions([
//         { option: "", explanation: "", isCorrect: false },
//         { option: "", explanation: "", isCorrect: false }
//       ]);
//     } catch (error) {
//       if (error.name === "Error") {
//         alert(`Failed to create poll: ${error.message}`);
//       } else {
//         alert("Failed to create poll: No response from server.");
//       }
//       console.error(error);
//     }
//   };

//   const handleOptionChange = (index, key, value) => {
//     let newOptions = [...options];

//     // หากกำลังอัปเดต `isCorrect` ให้เป็น true จะตั้งค่าของตัวเลือกอื่นให้เป็น false อัตโนมัติ
//     if (key === "isCorrect" && value === true) {
//       newOptions = newOptions.map((option, i) => ({
//         ...option,
//         isCorrect: i === index // ให้ isCorrect เป็น true เฉพาะตัวเลือกที่ถูกเลือก
//       }));
//     } else {
//       newOptions[index][key] = value; // กำหนดค่าอื่นๆ
//     }

//     setOptions(newOptions);
//     console.log(newOptions);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
//       <h2 className="text-xl font-semibold mb-4">Create Poll</h2>
//       <input
//         type="text"
//         placeholder="Poll Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="border p-2 w-full mb-3 rounded"
//       />
//       {options.map((option, index) => (
//         <div key={index} className="mb-3">
//           <input
//             type="text"
//             placeholder={`Option ${index + 1}`}
//             value={option.option}
//             onChange={(e) => handleOptionChange(index, "option", e.target.value)}
//             className="border p-2 w-full mb-1 rounded"
//           />
//           <input
//             type="text"
//             placeholder="Explanation"
//             value={option.explanation}
//             onChange={(e) => handleOptionChange(index, "explanation", e.target.value)}
//             className="border p-2 w-full mb-1 rounded"
//           />
//           <label className="inline-flex items-center">
//             <input
//               type="checkbox"
//               checked={option.isCorrect}
//               onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
//               className="mr-2"
//             />
//             Correct Answer
//           </label>
//         </div>
//       ))}
//       <button
//         type="submit"
//         className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//       >
//         Create Poll
//       </button>
//     </form>
//   );
// }
