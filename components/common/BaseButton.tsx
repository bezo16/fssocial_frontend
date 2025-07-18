"use client"
import { Button, ButtonProps, Spinner } from "@chakra-ui/react"
import React from "react"

interface BaseButtonProps extends ButtonProps {
  label: string
  isLoading?: boolean
}

const BaseButton: React.FC<BaseButtonProps> = ({ label, isLoading = false, ...props }) => {
  return (
    <Button
      colorScheme="teal"
      size="md"
      borderRadius="md"
      {...props}
      variant="surface"
    >
      {isLoading ? <Spinner size="md" /> : label}
    </Button>
  )
}

export default BaseButton
