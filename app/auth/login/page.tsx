"use client"

import BaseButton from "@/components/common/BaseButton"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toaster } from "@/components/ui/toaster"
import axios from "axios"
import TextInput from "@/components/common/TextInput"

type LoginFormInputs = {
  username: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>()

  const handleLogin = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post(`/api/auth/login`, data, { withCredentials: true })
      const token = response.data.token
      localStorage.setItem("authToken", token)
      router.push("/feed")
    }
    catch (error) {
      console.error("Login error:", error)
      toaster.error({ title: "Login failed", description: "Invalid username or password", closable: true })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>Login Page</h1>
      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSubmit(handleLogin)}>
        <TextInput errorText={errors.username?.message} label="username" {...register("username", { required: "Username is required" })} type="username" />
        <TextInput errorText={errors.password?.message} label="password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} type="password" />
        <BaseButton disabled={isSubmitting} isLoading={isSubmitting} label="login" type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" />
      </form>
    </div>
  )
}

export default LoginPage
