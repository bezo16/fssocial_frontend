"use client"
import { useState } from "react"
import BaseButton from "@/components/common/BaseButton"
import useUserDataMe from "@/lib/hooks/users/useUserDataMe"
import { useForm } from "react-hook-form"
import { Box, Text, Input, Image } from "@chakra-ui/react"
import axiosApiCall from "@/lib/api/axiosApiCall"

interface AvatarFormInputs {
  file: FileList
}

const EditAvatarSection = () => {
  const { data: user, refetch } = useUserDataMe()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<AvatarFormInputs>()

  const onSubmit = async (data: AvatarFormInputs) => {
    const file = data.file?.[0]
    if (!file) {
      setError("Vyberte obrázok")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      await axiosApiCall.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      await refetch()
      reset()
      setPreviewUrl(null)
    }
    catch (err) {
      console.error("Error uploading image:", err)
      setError("Error uploading image")
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
    else {
      setPreviewUrl(null)
    }
  }

  return (
    <Box mb={8} p={6} borderRadius="xl" boxShadow="md" bg="white" maxW="md" mx="auto">
      <Text
        fontWeight="bold"
        fontSize="xl"
        mb={4}
        color="blue.700"
      >
        Zmeniť profilovku
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" alignItems="center" gap={4} mb={4}>
          <Image
            src={previewUrl || user?.avatarUrl || "/default-avatar.png"}
            alt="Náhľad profilovky"
            boxSize="80px"
            borderRadius="full"
            objectFit="cover"
            border="2px solid #3182ce"
          />
          <Input
            type="file"
            accept="image/*"
            {...register("file")}
            onChange={(e) => {
              handleFileChange(e)
            }}
            disabled={isLoading}
            size="sm"
            variant="flushed"
            width="auto"
          />
        </Box>
        {error && (
          <Text color="red.500" mb={2}>
            {error}
          </Text>
        )}
        <BaseButton
          label="Uložiť profilovku"
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          style={{ width: "100%", fontWeight: "bold", fontSize: "15px", background: "#3182ce", color: "white", marginTop: "18px" }}
          _hover={{ background: "#2563eb !important" }}
        />
      </form>
    </Box>
  )
}

export default EditAvatarSection
