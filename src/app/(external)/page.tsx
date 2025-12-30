import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/default");
  // redirect("/dashboard/auth/v1/login");
  return <>Coming Soon</>;
}
