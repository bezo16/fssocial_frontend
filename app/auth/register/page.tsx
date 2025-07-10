'use client';
import BaseButton from "@/components/ui/common/BaseButton";
import { Input } from "@chakra-ui/react";



const RegisterPage = () => {

    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("register");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1>Register Page</h1>
            <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleRegister}>
                <Input type="text" placeholder="Enter your nickname" variant="outline" required={true} />
                <Input type="email" placeholder="Enter your email" variant="outline" required={true} />
                <Input type="password" placeholder="Enter your password" variant="outline" required={true} />
                <BaseButton label="register" type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" /> 
            </form>
        </div>
    );
};

export default RegisterPage;