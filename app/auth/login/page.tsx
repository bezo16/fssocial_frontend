'use client';

import BaseButton from "@/components/common/BaseButton";
import { Input } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster"
import axios from "axios";

type LoginFormInputs = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const router = useRouter();
    const {  register, handleSubmit , formState: { errors, isSubmitting} } = useForm<LoginFormInputs>();

    const handleLogin = async (data: LoginFormInputs) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data, {withCredentials: true});
            router.push("/feed");
        }
        catch (error) {
                console.error("Login error:", error);
                toaster.error({ title: "Login failed", description: "Invalid username or password", closable: true });
            }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1>Login Page</h1>
            <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSubmit(handleLogin)}>
                <Input {...register("username", { required: "Username is required" })} type="username" name="username" placeholder="Enter your username" variant="outline" required={true} />
                {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                <Input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} type="password" name="password" placeholder="Enter your password" variant="outline" required={true} />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                <BaseButton disabled={isSubmitting} isLoading={isSubmitting} label="login" type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" /> 
            </form>
        </div>
    );
};

export default LoginPage;
