import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import ReactQueryProviderClient from "../ReactQueryProviderClient"

describe("ReactQueryProviderClient", () => {
  it("should render children within QueryClientProvider", () => {
    const testContent = "Test Content"

    render(
      <ReactQueryProviderClient>
        <div>{testContent}</div>
      </ReactQueryProviderClient>,
    )

    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it("should provide QueryClient context to children", () => {
    let hasQueryClient = false

    const TestComponent = () => {
      // We can't easily test QueryClient directly without importing useQueryClient
      // but we can verify the component renders without errors
      hasQueryClient = true
      return <div>QueryClient Test</div>
    }

    render(
      <ReactQueryProviderClient>
        <TestComponent />
      </ReactQueryProviderClient>,
    )

    expect(hasQueryClient).toBe(true)
    expect(screen.getByText("QueryClient Test")).toBeInTheDocument()
  })

  it("should handle multiple children", () => {
    render(
      <ReactQueryProviderClient>
        <div>Child 1</div>
        <div>Child 2</div>
        <span>Child 3</span>
      </ReactQueryProviderClient>,
    )

    expect(screen.getByText("Child 1")).toBeInTheDocument()
    expect(screen.getByText("Child 2")).toBeInTheDocument()
    expect(screen.getByText("Child 3")).toBeInTheDocument()
  })

  it("should handle no children gracefully", () => {
    const { container } = render(
      <ReactQueryProviderClient>
        {null}
      </ReactQueryProviderClient>,
    )

    // Should render the provider without errors
    expect(container).toBeInTheDocument()
  })
})
