"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PulseLoader } from "react-spinners";
import { loginSchema } from "@/schemas/login";
import { Shield } from "lucide-react";

const loginUser = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(loginSchema),
    });
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:3001/api/auth/login/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            });
			console.log("response",response);
			const { token } = await response.json();
			// console.log("login",token);
			// console.log("response",response);
            if (response.ok) {
				// console.log("Login successful");
				toast.success("Login successful"); // Show success message
				localStorage.setItem("token", token); // Store token in local storage
				// console.log("token set");
				// console.log("token from local",localStorage.getItem("token"));
				await new Promise((resolve) => setTimeout(resolve, 500));
                router.push("/"); // Redirect to home page
            } else {// Extract error message from response
                const errorMessage =
                    response.error || "Please try again.";
                throw new Error(errorMessage);
            }
        } catch (error) {
            // Cast the error to an Error type for better type safety
            const errorMsg = error.message || "An unknown error occurred.";
            console.error("Login error:", error);
            toast.error("Login failed: " + errorMsg);
        } finally {
            setIsLoggingIn(false); // Stop loading
        }
    };

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-100">
			<div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-3xl font-bold mb-6 text-center text-[#3cc7e7]">
					Login as Admin <Shield size={32} className="inline-block"/>
				</h2>
				<form
					onSubmit={handleSubmit((data) => {
						if (!errors.username && !errors.password) {
							setIsLoggingIn(true);
						}
						onSubmit(data);
					})}
				>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<div className="relative mt-1">
							<input
								type="text"
								{...register("username")}
								placeholder="Enter your username"
								className="input input-bordered w-full pl-10 bg-white"
							/>
							{errors.username && (
								<p className="text-red-500 text-sm mt-1">
									{errors.username.message}
								</p>
							)}
						</div>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<div className="relative mt-1">
							<input
								type="password"
								{...register("password")}
								placeholder="Enter your password"
								className="input input-bordered w-full pl-10 bg-white"
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{errors.password.message}
								</p>
							)}
						</div>
					</div>

					<button
						type="submit"
						className="btn bg-[#3cc7e7] w-full text-slate-50 hover:bg-[#47d0ef] border-none"
					>
						{" "}
						{isLoggingIn ? (
							<PulseLoader color="#ffffff" size={8} margin={2} />
						) : (
							"Login"
						)}
					</button>
				</form>
				<p className="mt-4 text-center">
					Don't have an account?{" "}
					<a href="/register" className="text-[#3cc7e7] hover:underline">
						Register
					</a>
				</p>
				<ToastContainer position="bottom-right" />
			</div>
		</div>
	);
};

export default loginUser;