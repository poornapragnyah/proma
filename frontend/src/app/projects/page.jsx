"use client"; // Ensures that the component runs in client-side rendering

import React, { useEffect, useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Navbar from '@/components/Navbar';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import BackButton from '@/components/BackButton';
import AddProjectButton from '@/components/AddProjectButton';
import { useUserRole } from '@/contexts/userContext';


const Project = () => {
    const [projects, setProjects] = useState([]); // State to hold projects
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State to handle any potential errors
    const {userRole} = useUserRole(); // Access userRole from the user context
    // Fetch projects from the API
    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3001/api/projects',{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        credentials: "include",
                }); // Fetching data from the API
                // console.log("response",response);
                if (!response.ok) {
                    // throw new Error('Network response was not ok');
                    toast.error('Network response was not ok');
                }
                const data = await response.json(); // Parsing JSON response
                setProjects(data); // Setting projects state
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([])
                setError(error.message); // Handling errors
            } finally {
                setLoading(false); // Setting loading state to false
            }
        };

        fetchProjects(); // Call the fetch function
    }, []); // Empty dependency array means this effect runs once on mount

    // Loading state
    if (loading) {
        return <div className='flex justify-center items-center h-full'><PulseLoader color="#ffffff" size={8} margin={2} /></div>;
    }

    // Error state
    if (error) {
        return <div className='flex justify-center items-center h-full'>Error fetching projects: {error}</div>;
    }

    return (
        <>
        <div className='flex m-2 mr-4 justify-between'><BackButton link={"/"}/>{userRole=='admin'?<AddProjectButton/>:<div></div>}</div>
            <div className="flex flex-wrap m-4">
                
                
                {projects && projects.map((project) => (
                    <ProjectCard
                        key={project.id} // Unique key for each project
                        name={project.name}
                        description={project.description}
                        button={project.button}
                        link={project.id} // Ensure this is a valid image URL or path
                    />
                ))}
            </div>
            
        </>
    );
};

export default Project;
