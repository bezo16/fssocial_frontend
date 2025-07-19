import { useForm, SubmitHandler } from "react-hook-form"
import TextInput from "../common/TextInput"
import BaseButton from "../common/BaseButton"
import axios from "axios"
import { toaster } from "../ui/toaster"
import { useQueryClient } from "@tanstack/react-query"

type FormValues = {
  title: string
  content: string
  imageUrl?: string
}

const CreatePostForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, data, { withCredentials: true })
      toaster.success({ title: "Post created", description: "Your post has been created successfully", closable: true })
      queryClient.invalidateQueries({ queryKey: ["profilePostsMe"] })
      reset()
    }
    catch (error) {
      console.error("Post creation error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        id="title"
        label="Title"
        placeholder="Title"
        errorText={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />
      <TextInput
        id="content"
        label="Content"
        placeholder="Content"
        type="textarea"
        errorText={errors.content?.message}
        {...register("content", { required: "Content is required" })}
      />
      <TextInput
        id="imageUrl"
        label="Image URL"
        placeholder="Image URL"
        errorText={errors.imageUrl?.message}
        {...register("imageUrl", {
          pattern: {
            value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/,
            message: "Invalid image URL format",
          },
        })}
      />
      <BaseButton isLoading={isSubmitting} type="submit" label="Create Post" className="!my-4" disabled={isSubmitting} />
    </form>
  )
}

export default CreatePostForm
