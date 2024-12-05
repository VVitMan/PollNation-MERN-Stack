import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
        const provider = new GoogleAuthProvider()
        const auth = getAuth(app);

        const result = await signInWithPopup(auth, provider);
        // console.log(result);
        const res = await fetch('api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
            }),
        })
        const data = await res.json();
        console.log(data);
        dispatch(signInSuccess(data));
        // navigate to home page
        navigate('/');
        
    } catch (error) {
        console.log("couldn't login to Google", error);
    }
  };
  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={handleGoogleClick}
      sx={{ mt: 2 }}
    >
      Sign in with Google
    </Button>
  );
}
