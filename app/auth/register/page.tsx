'use client';
import BaseButton from "@/components/ui/common/BaseButton";
import { Input } from "@chakra-ui/react";



const RegisterPage = () => {

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const username = formData.get("username")
        const email = formData.get("email")
        const password = formData.get("password")

        const response = await fetch("http://localhost:4000/auth/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Registration successful:", data);
            // Handle successful registration (e.g., redirect to login page)
        } else {
            const errorData = await response.json();
            console.error("Registration failed:", errorData);
            // Handle registration error (e.g., show error message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1>Register Page</h1>
            <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleRegister}>
                <Input type="text" name="username" placeholder="Enter your username" variant="outline" required={true} />
                <Input type="email" name="email" placeholder="Enter your email" variant="outline" required={true} />
                <Input type="password" name="password" placeholder="Enter your password" variant="outline" required={true} />
                <BaseButton label="register" type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" /> 
            </form>
        </div>
    );
};

export default RegisterPage;