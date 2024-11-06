"use client"
import { useEffect } from "react";
import { validateToken } from "@/utils/auth";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useRouter } from "next/navigation";
import ProjectDashboard from "@/components/ProjectManagement";
import { useState } from "react";

export function Home() {
  const [totalProjects, setTotalProjects] = useState(10);
  const [activeProjects, setActiveProjects] = useState(3);
  const router = useRouter();

  useEffect(() => {
    validateToken(router);
  }, [router]);
  
  useEffect(() => {
    const fetchNumberOfProjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/projects/total',{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
        });
        const result = await response.json();
        // console.log(result.active);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setTotalProjects(result.total.toString());
        setActiveProjects(result.active.toString());
      } catch (error) {
        console.error('Error fetching projects:', error);
    }
  };
fetchNumberOfProjects();
}
, []);
  return (<>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-base-100">
        <ProjectDashboard total={totalProjects} active={activeProjects}/>
        </div>        
      </>);
}

export default Home;
