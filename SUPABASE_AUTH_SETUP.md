# Supabase Authentication Setup

This project uses **Supabase** for authentication, **Zustand** for state management, and **Drizzle** for database operations.

## Files Created/Modified

### 1. Authentication Store (`src/stores/auth-store.ts`)
Zustand store managing authentication state:
- `user`: Current authenticated user
- `isAuthenticated`: Auth status
- `loading`: Request loading state
- `error`: Error messages

**Available Actions:**
- `login(email, password)`: Sign in user
- `register(email, password)`: Create new account
- `logout()`: Sign out user
- `checkAuth()`: Check current session
- `clearError()`: Clear error messages

### 2. Supabase Client (`src/lib/supabase.client.ts`)
Initialized Supabase client using environment variables.

### 3. Auth Provider (`src/stores/auth-provider.tsx`)
React context provider that:
- Checks authentication status on app load
- Maintains session persistence

### 4. Protected Routes Hook (`src/hooks/use-require-auth.ts`)
Custom hook to protect routes requiring authentication:
```tsx
// Usage in protected components
export function Dashboard() {
  const { isAuthenticated, loading } = useRequireAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return null; // Will redirect to login
  
  return <div>Dashboard Content</div>;
}
```

### 5. Updated Forms
- **Login Form** (`src/app/(main)/auth/_components/login-form.tsx`)
- **Register Form** (`src/app/(main)/auth/_components/register-form.tsx`)

Both now connected to Supabase with:
- Real authentication
- Error handling
- Loading states
- Navigation after success

## Environment Setup

Your `.env` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...
```

## Usage Examples

### Login
```tsx
import { useAuthStore } from "@/stores/auth-store";

function LoginComponent() {
  const { login, user, loading, error } = useAuthStore();
  
  const handleLogin = async () => {
    try {
      await login("user@example.com", "password");
      // User is now logged in
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
}
```

### Protected Component
```tsx
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function Dashboard() {
  const { isAuthenticated, loading } = useRequireAuth();
  
  if (loading) return <Spinner />;
  
  return <div>Protected content</div>;
}
```

### Get Current User
```tsx
function UserProfile() {
  const { user } = useAuthStore();
  
  return <div>{user?.email}</div>;
}
```

## Next Steps

1. **Set up Supabase email confirmation** - Configure email templates in Supabase dashboard
2. **Add role-based access control** - Extend auth store with roles
3. **Implement password reset** - Add forgot password flow
4. **Connect Drizzle ORM** - Set up database schema and migrations
5. **Add user profiles** - Store additional user data in PostgreSQL

## Testing

- Test login at `/auth/v1/login`
- Test registration at `/auth/v1/register`
- Protected routes will redirect to login if not authenticated
