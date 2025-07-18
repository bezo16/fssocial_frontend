import { Field, Input, InputProps } from "@chakra-ui/react"

interface TextInputProps extends InputProps {
  label: string
  errorText?: string
}

const TextInput: React.FC<TextInputProps> = ({ label, errorText, ...inputProps }) => {
  return (
    <Field.Root invalid={!!errorText}>
      <Field.Label className="text-black">{label}</Field.Label>
      <Input {...inputProps} variant="outline" />
      {errorText !== "" && <Field.ErrorText>{errorText}</Field.ErrorText>}
    </Field.Root>
  )
}

export default TextInput
