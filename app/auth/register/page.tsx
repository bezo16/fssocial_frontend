"use client"

import BaseButton from "@/components/common/BaseButton"
import TextInput from "@/components/common/TextInput"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toaster } from "@/components/ui/toaster"
import axiosApiCall from "@/lib/api/axiosApiCall"

type RegisterFormInputs = {
  username: string
  email: string
  password: string
}

const RegisterPage = () => {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>()

  const handleRegister = async (data: RegisterFormInputs) => {
    try {
      await axiosApiCall.post(
        "/auth/register",
        data,
        { withCredentials: true },
      )
      router.push("/feed")
    }
    catch (error) {
      console.error("Registration error:", error)
      toaster.error({
        title: "Registration failed",
        description: "Something went wrong",
        closable: true,
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>Register Page</h1>
      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSubmit(handleRegister)}>
        <TextInput
          errorText={errors.username?.message}
          label="username"
          {...register("username", { required: "Username is required" })}
          type="text"
        />
        <TextInput
          errorText={errors.email?.message}
          label="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          type="email"
        />
        <TextInput
          errorText={errors.password?.message}
          label="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
          type="password"
        />
        <BaseButton
          disabled={isSubmitting}
          isLoading={isSubmitting}
          label="register"
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        />
      </form>
    </div>
  )
}

export default RegisterPage
