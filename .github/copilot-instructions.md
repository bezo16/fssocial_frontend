# Frontend Project Guide for Social Platform

## Quick Orientation

This is the frontend for a two-part application, built with Next.js.

- **Framework**: Next.js (App Router)
- **UI**: Chakra UI
- **State Management**: TanStack React Query for server state.
- **Forms**: React Hook Form for all form handling.
- **API Communication**: A custom `axiosApiCall` wrapper for all backend interactions.

To understand the project patterns, inspect files in `app/`, `components/`, and `lib/`.

## High-level Architecture

- **Routing**: Next.js App Router is used for all page-based routing. Use `<Link>` from `next/link` for navigation, not `<a>` tags.
- **API Calls**: All communication with the backend API is handled by a dedicated Axios instance located in `lib/api/axiosApiCall.ts`. This wrapper automatically handles attaching authentication tokens from `localStorage`. **Never use `fetch()` or `axios()` directly.**
- **Authentication**: JWT tokens are stored in `localStorage`. The `middleware.ts` file protects routes that require authentication by verifying the token.
- **UI Components**: The UI is built with Chakra UI. Custom, reusable components are located in `components/common/`. Page-specific components are in `components/<feature>/`.

## Key Directories

- `app/`: Contains all routes and pages, following the Next.js App Router convention.
- `components/`: Reusable React components.
  - `components/common/`: Generic, shared components like `BaseButton`, `TextInput`.
  - `components/users/`: Components related to user profiles, lists, etc.
  - `components/posts/`: Components for creating and displaying posts.
- `lib/`: Core logic, hooks, and type definitions.
  - `lib/api/`: Contains the configured Axios instance (`axiosApiCall.ts`).
  - `lib/auth/`: Authentication-related utilities.
  - `lib/hooks/`: Custom TanStack Query hooks for interacting with the backend API. This is the primary way to fetch and mutate data.
  - `lib/types/`: TypeScript type definitions for API data structures.

## Developer Workflows & Commands

- **Install Dependencies**: `npm install`
- **Run Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Run Production Build**: `npm run start`
- **Run Tests**: `npm run test`

## Important Environment Variables

- `NEXT_PUBLIC_API_URL`: The base URL for the backend API (e.g., `http://localhost:4000`). This is required for the application to connect to the backend.

## Project-specific Conventions & Rules

- **TypeScript First**: Always write code in TypeScript. Avoid vanilla JavaScript.
- **API Client**: Always use the `axiosApiCall` wrapper from `lib/api/axiosApiCall.ts` for making API requests.
- **State Management**: Use TanStack Query hooks from `lib/hooks/` for all server state management.
- **Error Handling**: Implement proper error handling for API calls and user interactions, using `try/catch` and component-level error states.
- **Next.js Features**: Utilize Next.js-specific features like the App Router for routing and data fetching.
- **UI Library**: Use Chakra UI for all UI components to maintain a consistent look and feel.

## State Management with TanStack Query

The project heavily relies on custom hooks that wrap `useQuery` and `useMutation` from TanStack Query.

- **Query Hooks**: Used for fetching data. Examples:
  - `lib/hooks/users/useUserData.ts`: Fetches a specific user's profile by ID.
  - `lib/hooks/users/useUserDataMe.ts`: Fetches the currently logged-in user's profile.
  - `lib/hooks/posts/useFeedPosts.ts`: Fetches the main content feed.
  - `lib/hooks/users/useRandomUsers.ts`: Fetches a list of random users for discovery.
  - `lib/hooks/users/useSearchUsers.ts`: Fetches users based on a search query.

- **Mutation Hooks**: Used for creating, updating, or deleting data. They often handle query invalidation to keep the UI in sync. Examples:
  - `lib/hooks/follows/useFollowUser.ts`: Sends a request to follow a user and invalidates relevant user data on success.
  - `lib/hooks/follows/useUnfollowUser.ts`: Sends a request to unfollow a user.

When adding new data-fetching or mutation logic, create a new hook in the appropriate directory within `lib/hooks/`.

## Files to Inspect for Common Patterns

- **API Client**: `lib/api/axiosApiCall.ts` (shows Axios instance configuration with interceptors)
- **Authentication**: `middleware.ts`, `lib/auth/verifyJwtToken.ts`
- **Custom Hooks**: `lib/hooks/**/*` (essential for understanding data flow)
- **Reusable Components**: `components/common/**/*`
- **Form Implementation**: `app/auth/login/page.tsx` or `app/auth/register/page.tsx`
- **Profile Page**: `app/profile/[id]/page.tsx` (good example of using multiple hooks)

## Example Code Snippets

### Form with React Hook Form and `axiosApiCall`

```tsx
"use client"

import BaseButton from "@/components/common/BaseButton"
import TextInput from "@/components/common/TextInput"
import { toaster } from "@/components/ui/toaster"
import axiosApiCall from "@/lib/api/axiosApiCall" // Correct import
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

type LoginFormInputs = {
  username: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>()

  const handleLogin = async (data: LoginFormInputs) => {
    try {
      // Use the custom axiosApiCall instance
      await axiosApiCall.post(`/auth/login`, data)
      router.push("/feed")
    }
    catch (error) {
      console.error("Login error:", error)
      toaster.error({ title: "Login failed", description: "Invalid username or password", closable: true })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>Login Page</h1>
      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSubmit(handleLogin)}>
        <TextInput errorText={errors.username?.message} label="username" {...register("username", { required: "Username is required" })} type="username" />
        <TextInput errorText={errors.password?.message} label="password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} type="password" />
        <BaseButton disabled={isSubmitting} isLoading={isSubmitting} label="login" type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" />
      </form>
    </div>
  )
}

export default LoginPage
```
