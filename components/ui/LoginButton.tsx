import * as React from "react";
import { signInWithGoogle } from "../../firebase/sign";
import { FiLogIn } from "react-icons/fi";
import { useRouter } from "next/router";

export function LoginButton() {
  const router = useRouter();
  const authenticate = async () => {
    const isAuth = await signInWithGoogle();
    if (isAuth) router.push("/");
  };
  return (
    <FiLogIn className="cursor-pointer ml-4 my-auto" onClick={authenticate} />
  );
}
