import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import BaseButton from "../BaseButton"
import { Provider } from "@/components/ui/provider"

// Wrapper component to provide Chakra UI context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

describe("BaseButton", () => {
  it("renders with the correct label", () => {
    render(
      <TestWrapper>
        <BaseButton label="Click me" />
      </TestWrapper>,
    )

    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("shows spinner when loading", () => {
    render(
      <TestWrapper>
        <BaseButton label="Click me" isLoading />
      </TestWrapper>,
    )

    // Should show spinner instead of text when loading
    expect(screen.queryByText("Click me")).not.toBeInTheDocument()
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("passes through additional props", () => {
    render(
      <TestWrapper>
        <BaseButton label="Click me" disabled data-testid="test-button" />
      </TestWrapper>,
    )

    const button = screen.getByTestId("test-button")
    expect(button).toBeDisabled()
  })

  it("has correct default styling", () => {
    render(
      <TestWrapper>
        <BaseButton label="Click me" />
      </TestWrapper>,
    )

    const button = screen.getByRole("button")
    expect(button).toHaveClass("chakra-button")
  })

  it("handles click events", () => {
    const handleClick = vi.fn()
    render(
      <TestWrapper>
        <BaseButton label="Click me" onClick={handleClick} />
      </TestWrapper>,
    )

    screen.getByRole("button").click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
