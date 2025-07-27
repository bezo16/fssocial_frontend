import { useForm } from "react-hook-form"
import { Box, Text } from "@chakra-ui/react"
import { AvatarRoot, AvatarImage, AvatarFallback } from "@chakra-ui/react"
import TextInput from "@/components/common/TextInput"
import BaseButton from "@/components/common/BaseButton"
import useUserDataMe from "@/lib/hooks/users/useUserDataMe"
import axiosApiCall from "@/lib/api/axiosApiCall"
import { useState } from "react"

interface EditProfileFormInputs {
  bio: string
  avatarUrl: string
}

const EditProfileSection = () => {
  const { data: user, refetch } = useUserDataMe()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<EditProfileFormInputs>({
    defaultValues: {
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    },
  })

  const onSubmit = async (data: EditProfileFormInputs) => {
    setIsLoading(true)
    try {
      await axiosApiCall.patch("/users/me", data)
      await refetch()
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Box mb={8} p={6} borderRadius="xl" boxShadow="md" bg="white" maxW="md" mx="auto">
      <Text fontWeight="bold" fontSize="xl" mb={4} color="blue.700">Upraviť profil</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" alignItems="center" gap={4} mb={4}>
          <AvatarRoot size="xl">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback name={user?.username} />
          </AvatarRoot>
          <Text fontWeight="bold" color="gray.700">{user?.username}</Text>
        </Box>
        <TextInput
          label="Avatar URL"
          errorText={errors.avatarUrl?.message}
          {...register("avatarUrl", { required: false })}
          type="text"
          placeholder="Zadaj URL obrázka"
        />
        <TextInput
          label="Bio"
          errorText={errors.bio?.message}
          {...register("bio", { required: false, maxLength: { value: 200, message: "Max 200 znakov" } })}
          type="text"
          placeholder="Napíš niečo o sebe..."
        />
        <BaseButton
          label="Uložiť zmeny"
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

export default EditProfileSection
