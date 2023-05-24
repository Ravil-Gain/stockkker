import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};
