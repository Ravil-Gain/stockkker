import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { FiArrowUpLeft } from "react-icons/fi";

export default function Home() {
  const user = useAuth();
  const router = useRouter();

  if (user.authUser) {
    if (user.authUser.admin) {
      router.push("/barthender");
    } else {
      router.push("/client");
    }
  }
  return (
    <>
      <div className="overflow-x-scroll">
        <div className="relative flex">
          <FiArrowUpLeft  className="ml-8 mr-2"/>
          <div>Login</div>
        </div>
      </div>
    </>
  );
}
