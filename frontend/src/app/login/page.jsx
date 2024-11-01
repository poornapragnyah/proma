"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, Users, Shield } from 'lucide-react'; // Import icons from Heroicons
import "react-toastify/dist/ReactToastify.css";

const loginRedirect = () => {
    const router = useRouter();

    // Redirects to the appropriate registration page based on the selected role
    const redirectToRolePage = (role) => {
        switch (role) {
            case "teamMember":
                router.push("/login/team-member");
                break;
            case "teamManager":
                router.push("/login/team-manager");
                break;
            case "admin":
                router.push("/login/admin");
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-4xl font-bold mb-6 text-center text-[#3cc7e7]">
                    Login As
                </h2>
                <p className="mb-4 text-center text-gray-700">
                    Please select your role to continue to the login page.
                </p>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => redirectToRolePage("teamMember")}
                        className="btn bg-[#3cc7e7] border-none hover:bg-[#52c7e1] w-full flex items-center justify-center gap-2 text-slate-50"
                    >
                        <User className="w-6 h-6 text-white" />
                        Login as Team Member
                    </button>
                    <button
                        onClick={() => redirectToRolePage("teamManager")}
                        className="btn bg-[#3cc7e7] border-none hover:bg-[#52c7e1] w-full flex items-center justify-center gap-2 text-slate-50"
                    >
                        <Users className="w-6 h-6 text-white" />
                        Login as Team Manager
                    </button>
                    <button
                        onClick={() => redirectToRolePage("admin")}
                        className="btn bg-[#3cc7e7] border-none hover:bg-[#52c7e1] w-full flex items-center justify-center gap-2 text-slate-50"
                    >
                        <Shield className="w-6 h-6 text-white" />
                        Login as Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default loginRedirect;
