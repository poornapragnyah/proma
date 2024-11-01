"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { validateToken } from "../utils/auth";
import ProjectDashboard from "@/components/ProjectManagement";

export function Home() {
  const router = useRouter();

  useEffect(() => {
    validateToken(router);
  }, [router]);

  return (<>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-base-100">
        <ProjectDashboard active={10} total={22}/>
        </div>        
      </>);
}

export default Home;
