import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // state.currentUser = null; /* ล้างข้อมูลผู้ใช้เมื่อเข้าสู่ระบบล้มเหลว ไว้ใช้ใน logoutSuccess */
        }
    }
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;


export default userSlice.reducer;