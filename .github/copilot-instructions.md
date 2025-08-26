# FSocial Frontend Development Instructions

FSocial Frontend is a Next.js 15.3.5 social media application built with React 19, TypeScript, Chakra UI, TanStack React Query, React Hook Form, and Axios. This is the frontend component of a social media platform featuring user authentication, posts, profiles, notifications, and social interactions.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Initial Setup and Dependencies
- Install dependencies: `npm install` -- takes ~22 seconds. NEVER CANCEL.
- Node.js version in use: v20.19.4
- npm version in use: 10.8.2

### Build Process
- **CRITICAL**: Build: `npm run build` -- takes ~26 seconds. NEVER CANCEL. Set timeout to 60+ minutes for safety.
- The build process includes:
  - TypeScript compilation and type checking
  - Static page generation (11 pages)
  - Optimization and bundling
  - Linting validation
- Build warnings about invalid next.config.ts options (`optimizePackageImports`) are expected and do not affect functionality.
- Build warnings about axios and Edge Runtime compatibility are expected and do not affect functionality.

### Development Workflow
- **Development server**: `npm run dev` -- starts in ~1.4 seconds using Turbopack
  - Runs on http://localhost:3000
  - Uses Turbopack for fast hot reloading
  - Auto-compiles middleware in ~467ms
- **Production server**: `npm run start` -- starts in ~463ms
  - Must run `npm run build` first
  - Runs optimized production build
- **Linting**: `npm run lint` -- takes ~3 seconds. NEVER CANCEL.
  - Includes automatic fixing with `--fix` flag
  - Must pass for successful builds

### Manual Validation Requirements
- **ALWAYS** test the application manually after making changes
- Navigate to http://localhost:3000 to see the home page with "bezo social app" title
- Test navigation to login page via "Sign in !!" button (http://localhost:3000/auth/login)
- Test navigation to register page via "Register !!" button (http://localhost:3000/auth/register)
- Verify login form displays username and password fields with proper validation
- **CRITICAL**: The application displays a photo of "Misko Javornik" on the homepage - this is expected behavior

## Build Issues and Troubleshooting

### Known Build Fixes Applied
- **Google Fonts Issue**: The original layout.tsx used Google Fonts which fail in isolated environments. This has been fixed by using local fonts from Next.js distribution:
  ```typescript
  import localFont from "next/font/local"
  
  const geistSans = localFont({
    src: "../node_modules/next/dist/client/components/react-dev-overlay/font/geist-latin.woff2",
    variable: "--font-geist-sans",
  })
  ```
- **Linting Issues**: Removed unused import `NotificationsSection` from `app/profile/me/page.tsx`

### Environment Requirements
- **Network Restrictions**: Google Fonts access fails in sandboxed environments - use local fonts only
- **Build Dependencies**: All required dependencies are available via npm install
- **No Additional SDKs Required**: Node.js and npm are sufficient

## Project Architecture

### Key Directories and Files
```
/app                    - Next.js App Router pages
  /auth                 - Authentication pages (login, register)
  /feed                 - Social feed functionality
  /profile              - User profile pages
  /api                  - API routes
/components             - Reusable React components
  /common               - Base components (BaseButton, TextInput, etc.)
  /feed                 - Feed-specific components
  /posts                - Post-related components
  /ui                   - UI framework components
  /users                - User-related components
/lib                    - Utility libraries
  /api                  - API configuration (axiosApiCall)
  /auth                 - Authentication utilities
  /hooks                - Custom React hooks
  /providers            - React context providers
  /types                - TypeScript type definitions
/public                 - Static assets
/middleware.ts          - Next.js middleware for route protection
```

### Core Technologies
- **Framework**: Next.js 15.3.5 with App Router
- **Runtime**: React 19
- **Language**: TypeScript (strict mode enabled)
- **UI Framework**: Chakra UI v3.22.0
- **Forms**: React Hook Form v7.60.0
- **Data Fetching**: TanStack React Query v5.83.0
- **HTTP Client**: Axios v1.10.0 (wrapped in custom axiosApiCall)
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Local Geist fonts (Geist Sans and Geist Mono)

### Authentication & Routing
- Protected routes: `/feed`, `/profile/*` (via middleware)
- Authentication uses JWT tokens stored in cookies
- Middleware redirects unauthenticated users to `/auth/login`
- Custom axiosApiCall wrapper handles authentication headers

## Development Rules and Standards

### Code Style Requirements (from ai_context.txt)
- **ALWAYS write TypeScript code, never vanilla JavaScript**
- **NEVER use builtin fetch, always use axiosApiCall wrapper**
- **ALWAYS use Chakra UI for UI components**
- **ALWAYS use Next.js routing (next/navigation), never HTML anchor tags**
- **ALWAYS check package versions and write compatible code**
- **ALWAYS fix all errors and warnings**

### Form Development Pattern
Use this exact pattern for forms:
```typescript
"use client"

import BaseButton from "@/components/common/BaseButton"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toaster } from "@/components/ui/toaster"
import TextInput from "@/components/common/TextInput"
import axiosApiCall from "@/lib/api/axiosApiCall"

type FormInputs = {
  // Define form fields here
}

const FormPage = () => {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>()

  const handleSubmit = async (data: FormInputs) => {
    try {
      await axiosApiCall.post(`/your-endpoint`, data)
      router.push("/success-page")
    }
    catch (error) {
      console.error("Error:", error)
      toaster.error({ title: "Operation failed", description: "Error message", closable: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmit)}>
      <TextInput errorText={errors.field?.message} label="field" {...register("field", { required: "Field is required" })} />
      <BaseButton disabled={isSubmitting} isLoading={isSubmitting} label="Submit" type="submit" />
    </form>
  )
}
```

## Testing and Validation

### Pre-commit Validation
- **ALWAYS run**: `npm run lint` before committing changes
- **ALWAYS run**: `npm run build` to ensure build succeeds
- **ALWAYS manually test**: Navigation and core functionality

### Manual Testing Scenarios
1. **Homepage Load Test**: Navigate to http://localhost:3000
   - Verify "bezo social app" heading displays
   - Verify "Sign in !!" and "Register !!" buttons are clickable
   - Verify Misko Javornik image loads correctly
2. **Authentication Flow Test**: 
   - Click "Sign in !!" button → should navigate to `/auth/login`
   - Verify login form displays with username/password fields
   - Click "Register !!" button → should navigate to `/auth/register`
3. **Protected Route Test**: 
   - Navigate directly to `/feed` → should redirect to login (when not authenticated)

### Build Time Expectations
- **npm install**: ~22 seconds - NEVER CANCEL
- **npm run build**: ~26 seconds - NEVER CANCEL, set timeout to 60+ minutes
- **npm run lint**: ~3 seconds - NEVER CANCEL
- **npm run dev**: ~1.4 seconds startup time
- **npm run start**: ~463ms startup time

## Common Tasks and Quick Reference

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API base URL (used in axiosApiCall)
- No environment files are tracked in the repository

### Key Components to Reference
- `@/components/common/BaseButton`: Standard button component
- `@/components/common/TextInput`: Form input component with validation
- `@/lib/api/axiosApiCall`: HTTP client wrapper with authentication
- `@/components/ui/toaster`: Toast notification system

### Development Server Behavior
- Uses Turbopack for fast development builds
- Hot reloading enabled for all file changes
- Middleware compilation happens automatically
- Console warnings about React DevTools are normal

### Production Considerations
- Build includes static page generation for performance
- All pages are optimized and pre-rendered where possible
- Image optimization is enabled for Next.js Image components
- Bundle analysis shows efficient code splitting

## Troubleshooting

### Build Failures
1. **Google Fonts errors**: Already fixed - uses local fonts
2. **Type errors**: Run `npm run lint` to identify and fix
3. **Missing dependencies**: Run `npm install`
4. **Network timeouts**: Increase timeout values, builds may take up to 30+ minutes in some environments

### Runtime Issues
1. **404 on protected routes**: Check middleware configuration
2. **API call failures**: Verify `NEXT_PUBLIC_API_URL` environment variable
3. **Authentication issues**: Check JWT token in browser cookies
4. **Styling issues**: Verify Chakra UI provider is correctly set up in layout

### Development Issues
1. **Slow hot reload**: Turbopack should provide fast reloads, restart dev server if issues persist
2. **TypeScript errors**: Enable strict mode compliance in all files
3. **Linting failures**: Use `npm run lint` with auto-fix enabled

Remember: **NEVER CANCEL long-running builds or commands. Builds can take 30+ minutes in some environments. Always wait for completion.**