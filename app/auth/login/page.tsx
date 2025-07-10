'use client';

import BaseButton from "@/components/ui/common/BaseButton";
import { Input } from "@chakra-ui/react";

const LoginPage = () => {

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("pes")
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1>Login Page</h1>
            <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleLogin}>
                <Input type="email" placeholder="Enter your email" variant="outline" required={true} />
                <Input type="password" placeholder="Enter your password" variant="outline" required={true} />
                <BaseButton label="login" type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" /> 
            </form>
        </div>
    );
};

export default LoginPage;
