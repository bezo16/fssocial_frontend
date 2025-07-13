'use client';

import BaseButton from "@/components/ui/common/BaseButton";
import { Input } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const username = formData.get("username")
        const password = formData.get("password")

        const response = await fetch("http://localhost:4000/auth/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include", 
        });

        if (response.ok) {
            const data = await response.json();
            console.log("login successful:", data);
            router.push("/feed");
            // Handle successful registration (e.g., redirect to login page)
        } else {
            const errorData = await response.json();
            console.error("login failed:", errorData);
            // Handle registration error (e.g., show error message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1>Login Page</h1>
            <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleLogin}>
                <Input type="username" name="username" placeholder="Enter your username" variant="outline" required={true} />
                <Input type="password" name="password" placeholder="Enter your password" variant="outline" required={true} />
                <BaseButton label="login" type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" /> 
            </form>
        </div>
    );
};

export default LoginPage;
