import { render, screen, fireEvent } from "@testing-library/react"
import { expect, test, describe } from "vitest"
import {
  ColorModeButton,
  useColorMode,
  useColorModeValue,
} from "../color-mode"
import { ReactNode } from "react"

import { Provider } from "../provider"

// Wrapper component to provide the necessary context for testing
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <Provider>{children}</Provider>
)

describe("ColorMode", () => {
  test("ColorModeButton should toggle color mode", () => {
    render(
      <TestWrapper>
        <ColorModeButton />
      </TestWrapper>,
    )

    const button = screen.getByRole("button", { name: /toggle color mode/i })

    // Default theme is light
    expect(document.documentElement.classList.contains("dark")).toBe(false)

    // Click to toggle to dark mode
    fireEvent.click(button)

    // Now it should be dark mode
    expect(document.documentElement.classList.contains("dark")).toBe(true)

    // Click to toggle back to light mode
    fireEvent.click(button)
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })

  test("useColorMode hook should return current color mode and allow toggling", () => {
    let initialMode: string | undefined
    const TestComponent = () => {
      const { colorMode, toggleColorMode } = useColorMode()
      if (!initialMode) {
        initialMode = colorMode
      }
      return (
        <div>
          <span data-testid="color-mode">{colorMode}</span>
          <button onClick={toggleColorMode}>Toggle</button>
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>,
    )

    const modeSpan = screen.getByTestId("color-mode")
    const toggleButton = screen.getByText("Toggle")

    expect(modeSpan.textContent).toBe(initialMode)

    fireEvent.click(toggleButton)

    expect(modeSpan.textContent).toBe(initialMode === "light" ? "dark" : "light")
  })

  test("useColorModeValue should return the correct value for the current mode", () => {
    let initialMode: string | undefined
    const TestComponent = () => {
      const { colorMode, toggleColorMode } = useColorMode()
      if (!initialMode) {
        initialMode = colorMode
      }
      const value = useColorModeValue("Light Value", "Dark Value")
      return (
        <div>
          <span>{value}</span>
          <button onClick={toggleColorMode}>Toggle</button>
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>,
    )

    const toggleButton = screen.getByText("Toggle")

    if (initialMode === "light") {
      expect(screen.getByText("Light Value")).toBeDefined()
      expect(screen.queryByText("Dark Value")).toBeNull()

      fireEvent.click(toggleButton)

      expect(screen.getByText("Dark Value")).toBeDefined()
      expect(screen.queryByText("Light Value")).toBeNull()
    }
    else {
      expect(screen.getByText("Dark Value")).toBeDefined()
      expect(screen.queryByText("Light Value")).toBeNull()

      fireEvent.click(toggleButton)

      expect(screen.getByText("Light Value")).toBeDefined()
      expect(screen.queryByText("Dark Value")).toBeNull()
    }
  })
})
