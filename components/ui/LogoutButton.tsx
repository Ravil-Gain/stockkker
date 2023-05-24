import { auth } from "../../firebase/config";
import * as React from "react";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";

export function LogoutButton() {
  const router = useRouter();
  const logOut = () => {
    auth.signOut();
    router.push("/");
  };
  return (
      <FiLogOut className="cursor-pointer ml-4 my-auto" onClick={logOut}/>
  );
}
