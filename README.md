# Frontend – Salesforce Dashboard

This is the frontend component of the Salesforce Dashboard application. It enables user authentication and displays Salesforce account data in a paginated and protected dashboard UI.

---

## Technologies Used

- **Vue 3 + Vite** 
- **TypeScript** 
- **Pinia** – Store for managing user authentication state
- **Axios** – API client with interceptor support
- **Vue Router** – Handles public and protected routes

---

## Features

- Login and registration flow with JWT integration
- Route protection for dashboard pages
- Paginated display of Salesforce Account records
- Axios interceptors to inject auth headers and handle errors
---

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable UI components
├── router/           # Vue Router with route guards
├── store/            # Pinia auth store
├── views/            # Login & Dashboard views
├── App.vue           # Root component
└── main.ts           # Entry point
```

---

## Architecture Overview

### 1. Authentication Flow

- User credentials are submitted via the login/register form.
- Upon successful login, the backend issues a JWT token.
- The token is:
  - Stored in `localStorage`
  - Synced to Pinia's global `authStore.token`
- On app reload, the token is rehydrated into the store.

### 2. Route Protection

- Routes like `/dashboard` are guarded via Vue Router's `beforeEach` hook.
- If no token is available, the user is redirected to `/login`.

### 3. Pinia for Auth State

- `authStore` holds the token and user email.
- Other components can access `authStore.token` without directly touching storage.
- Automatically reflects auth state changes (login/logout) across the app.

### 4. Axios Interceptor

- Injects `Authorization: Bearer <token>` header into every request (request interceptor).
- Centralized error logging and retry logic support if needed (response interceptor).

---

## API Integration

The frontend communicates with the following backend routes:

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/auth/login`   | Authenticate user        |
| POST   | `/api/auth/register`| Register new user        |
| GET    | `/api/dashboard`    | Fetch Salesforce accounts|

## Deployment (Local)
1. **Clone the repository**

```bash
git clone repoURL
```

2. **Install dependencies**

```bash
npm install
```
3. **Run the server in dev mode**

```bash
npm run dev
```


## Deployment (Render)

1. Push code to GitHub
2. Create a new **Static Site** on Render
3. Set **Build Command**:  
   ```
   npm install && npm run build
   ```
4. Set environment variable:  
   ```
   VITE_API_BASE_URL="Insert Backend URL"
   ```

---

## Challenges faced

- Loss of JWT token in the pinia store during page refresh. 
Previously, I've fetched token from pinia store in the axios request interceptor and later realised that a page refresh clears the pinia store. Updated logic to fetch directly from the local storage. (Similarly in route guard)

---

## Live Demo

Frontend: [https://sdb-frontend.onrender.com](https://sdb-frontend.onrender.com)  
Backend: [https://sf-dashboard-backend.onrender.com](https://sf-dashboard-backend.onrender.com)

