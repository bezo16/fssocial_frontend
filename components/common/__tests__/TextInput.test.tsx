import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import TextInput from "../TextInput"
import { Provider } from "@/components/ui/provider"

// Wrapper component to provide Chakra UI context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

describe("TextInput", () => {
  it("renders with the correct label", () => {
    render(
      <TestWrapper>
        <TextInput label="Username" />
      </TestWrapper>,
    )

    expect(screen.getByLabelText("Username")).toBeInTheDocument()
  })

  it("displays error text when provided", () => {
    render(
      <TestWrapper>
        <TextInput label="Username" errorText="This field is required" />
      </TestWrapper>,
    )

    expect(screen.getByText("This field is required")).toBeInTheDocument()
  })

  it("does not display error text when empty string", () => {
    render(
      <TestWrapper>
        <TextInput label="Username" errorText="" />
      </TestWrapper>,
    )

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("passes through input props", () => {
    render(
      <TestWrapper>
        <TextInput
          label="Password"
          type="password"
          placeholder="Enter password"
          data-testid="password-input"
        />
      </TestWrapper>,
    )

    const input = screen.getByTestId("password-input")
    expect(input).toHaveAttribute("type", "password")
    expect(input).toHaveAttribute("placeholder", "Enter password")
  })

  it("handles user input", async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <TextInput label="Username" data-testid="username-input" />
      </TestWrapper>,
    )

    const input = screen.getByTestId("username-input")
    await user.type(input, "testuser")

    expect(input).toHaveValue("testuser")
  })

  it("applies invalid state when error text is provided", () => {
    render(
      <TestWrapper>
        <TextInput label="Username" errorText="Invalid username" />
      </TestWrapper>,
    )

    const input = screen.getByLabelText("Username")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("has outline variant by default", () => {
    render(
      <TestWrapper>
        <TextInput label="Username" />
      </TestWrapper>,
    )

    const input = screen.getByLabelText("Username")
    expect(input).toHaveClass("chakra-input")
  })
})
