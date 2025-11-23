# Authentication Integration Guide

## Overview

This project now has a complete authentication system integrated with the backend API using TanStack Query (Vue Query). The system includes:

- ✅ Login and Registration forms with validation
- ✅ TanStack Query for API calls
- ✅ Form validation utilities
- ✅ Error handling
- ✅ Loading states
- ✅ Token management
- ✅ Auth state management

## File Structure

```
src/
├── components/
│   └── LoginPopup.vue          # Login/Register modal component
├── composables/
│   └── useAuth.ts              # Auth state management composable
├── services/
│   ├── api.ts                  # API client with error handling
│   └── auth.service.ts         # Authentication service
├── types/
│   └── api.ts                  # TypeScript types for API
└── utils/
    └── validation.ts           # Form validation utilities
```

## Usage

### 1. Using the Login Popup

The `LoginPopup` component is already integrated into your app. To use it:

```vue
<template>
  <LoginPopup v-model="showLoginPopup" />
</template>

<script setup>
import { ref } from 'vue'
import LoginPopup from '~/components/LoginPopup.vue'

const showLoginPopup = ref(false)

// Show the popup
const openLogin = () => {
  showLoginPopup.value = true
}
</script>
```

### 2. Using the Auth Composable

The `useAuth` composable provides global authentication state:

```vue
<script setup>
import { useAuth } from '~/composables/useAuth'

const { isAuthenticated, logout } = useAuth()

const handleLogout = () => {
  logout()
  // Optionally redirect to home
  navigateTo('/')
}
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Welcome back!</p>
    <button @click="handleLogout">Logout</button>
  </div>
  <div v-else>
    <p>Please login</p>
  </div>
</template>
```

### 3. Making Authenticated API Calls

Use the auth headers for protected endpoints:

```typescript
import { useAuth } from '~/composables/useAuth'
import { apiClient } from '~/services/api'

const { getAuthHeaders } = useAuth()

// Example: Fetch user profile
const fetchUserProfile = async () => {
  return apiClient('/users/me', {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}
```

### 4. Using TanStack Query for Other Endpoints

Example for fetching tours:

```vue
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { apiClient } from '~/services/api'
import type { Tour } from '~/types/api'

const { data: tours, isLoading, isError } = useQuery({
  queryKey: ['tours'],
  queryFn: () => apiClient<Tour[]>('/tours'),
})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isError">Error loading tours</div>
  <div v-else>
    <div v-for="tour in tours" :key="tour.id">
      {{ tour.title }}
    </div>
  </div>
</template>
```

## Form Validation

The validation system is built-in and easy to use:

```typescript
import { validateForm, validationRules } from '~/utils/validation'

// Define validation rules
const rules = {
  email: [
    validationRules.required('Email is required'),
    validationRules.email(),
  ],
  password: [
    validationRules.required('Password is required'),
    validationRules.minLength(6),
  ],
}

// Validate form
const errors = validateForm(formData, rules)

if (Object.keys(errors).length === 0) {
  // Form is valid, submit
}
```

### Available Validation Rules

- `required(message?)` - Field is required
- `email(message?)` - Valid email format
- `minLength(length, message?)` - Minimum character length
- `maxLength(length, message?)` - Maximum character length
- `pattern(regex, message)` - Custom regex pattern
- `match(otherValue, message)` - Match another field value

## API Configuration

The API base URL is configured in `src/services/api.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:3001'
```

Change this to your production API URL when deploying.

## Error Handling

The system handles errors gracefully:

1. **Validation Errors**: Shown inline below each field
2. **API Errors**: Shown in an alert box above the form
3. **Network Errors**: Caught and displayed with user-friendly messages

## Features

### Login Form
- Email validation
- Password validation
- Error display
- Loading state
- Success handling

### Register Form
- Name validation (min 2 characters)
- Email validation
- Password validation (min 6 characters)
- Error display
- Loading state
- Success handling

### Security
- JWT tokens stored in localStorage
- Tokens automatically added to authenticated requests
- Token management utilities

## Next Steps

### Recommended Enhancements

1. **Add Toast Notifications**
   - Install a toast library (e.g., `vue-toastification`)
   - Show success/error messages

2. **Add User Profile Management**
   - Create a user profile page
   - Fetch and display user data
   - Update user information

3. **Add Protected Routes**
   - Create a middleware to check authentication
   - Redirect unauthenticated users

4. **Add Password Reset**
   - Create forgot password flow
   - Implement reset password functionality

5. **Add Social Login**
   - Implement Google/Facebook OAuth
   - Handle OAuth callbacks

## Example: Protected Route Middleware

Create `middleware/auth.ts`:

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
```

Use in pages:

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your backend allows requests from your frontend origin.

### Token Expiration
Currently, tokens are stored indefinitely. Consider implementing token refresh logic or expiration handling.

### TypeScript Errors
Make sure all types are properly imported from `~/types/api`.

## Support

For issues or questions, refer to:
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/vue/overview)
- [API Documentation](./API_DOCUMENTATION.md)
