import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";

export default function Home() {
  const user = useAuth();
  const router = useRouter();

  if (user.authUser) {
    if(user.authUser.admin) {
      router.push("/barthender");
    } else {
      router.push("/client");
    }
  }
  return (
    <>
      <div className="overflow-x-scroll">
        <div className="relative">
          <h1>BarBuh</h1>
        </div>
      </div>
    </>
  );
}
