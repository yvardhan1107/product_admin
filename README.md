# 🛍️ Product Admin Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

A robust, production-ready React application for managing products. Built with a strong focus on edge-case handling, performance, resilience, and clean UI design, strictly using core React features without heavily relying on third-party data management libraries.

## ✨ Key Features
- **URL-Driven State Management**: Search, pagination, and filters are instantly shareable and synced with the URL.
- **Optimized Network Requests**: Debounced searching and `AbortController` integration to prevent race conditions during rapid typing.
- **Simulated Data Persistence**: Advanced local state overlay system to mimic persistent CRUD operations on a read-only API.
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop viewing environments.
- **Multi-Click Protection**: Custom submit guards to prevent duplicate API calls.

## 🚀 Tech Stack

- **Framework:** React 18 (via Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (with Lucide React for iconography)
- **Data Fetching:** Axios (with custom interceptors for auth)
- ***Note:*** Built strictly without Next.js, React Query, SWR, or ready-made data-table/pagination libraries.

## 🛠️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   ```
4. **Build for production**
   ```bash
   npm run build
   ```

## 🧠 Architectural Decisions & Problem Solving

This project was built to gracefully handle several complex edge cases and API limitations. Here are the core decisions made:

### 1. Custom URL-Driven State & Pagination
Instead of using external state managers or query libraries, the entire application state (pagination, search, filtering) is strictly synchronized with the URL using `useSearchParams`. 
- **Benefit:** Users can share links, refresh the page, or use browser back/forward buttons without losing their view state.
- **Resilience:** If a user manually enters invalid URL parameters (e.g., `?page=abc` or `?page=-5`), the custom hooks immediately sanitize the values and fallback to safe defaults (`page=1`), preventing the app from crashing.

### 2. Race Conditions & Fast Typing
To prevent the classic "stale search result" bug where an older API request finishes *after* a newer one, an `AbortController` pattern is implemented inside the `useProducts` hook. 
- **How it works:** If a user types fast, previous network requests are physically canceled before new ones are sent, guaranteeing that the final data shown on screen strictly matches the user's latest input.

### 3. Handling API Limitations (Search vs. Category)
**The Problem:** The backend API does not support simultaneously searching by query *and* filtering by category (e.g., `/products/category/smartphones/search?q=apple` is not a valid endpoint).
**The Solution:** Search and Category filtering are mutually exclusive in the UI. If a user is filtering by category and decides to type in the search bar, the category filter is automatically cleared (and vice versa). This provides a predictable user experience while perfectly respecting the API's constraints.

### 4. Simulating Persistent CRUD (The Mutation Overlay)
**The Problem:** The API simulates `POST`, `PUT`, and `DELETE` requests by returning a success response, but it does not actually update the backend database. If we simply re-fetch the list, the user's changes disappear.
**The Solution:** A local "Mutation Overlay" architecture was built using `ProductContext` and `localStorage`.
- When a user adds, edits, or deletes a product, the action is stored locally.
- Whenever a fresh list of products is fetched from the API, it passes through the overlay function:
  1. It filters out items the user deleted locally.
  2. It overwrites item data with any local edits the user made.
  3. It prepends brand new local items to the top of the list.
- **Result:** The user experiences a seamless, fully persistent CRUD application on the frontend, even though the backend resets.

### 5. Multi-Click Protection (Spam Guard)
To prevent users from clicking "Save" or "Login" multiple times quickly (which would send spam requests to the API), a custom `useSubmitGuard` hook is utilized. It uses a synchronous `useRef` lock combined with React state to absolutely guarantee that rapid double-clicks are ignored while a transaction is in flight.
