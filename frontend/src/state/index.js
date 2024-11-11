import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  questions: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    /* setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    }, */
    setQuestions: (state, action) => {
      state.questions = action.payload.questions;
    },
    setQuestion: (state, action) => {
      const updatedQuestions = state.questions.map((question) => {
        if (question._id === action.payload.question._id) return action.payload.question;
        return question;
      });
      state.questions = updatedQuestions;
    },
  },
});

export const { setMode, setLogin, setLogout, setQuestions, setQuestion } =
  authSlice.actions;
export default authSlice.reducer;