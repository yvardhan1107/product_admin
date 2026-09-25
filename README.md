# Product Admin Dashboard

A robust, production-ready React application for managing products, built with a focus on edge-case handling, performance, and clean UI design.

## 🚀 Tech Stack

- **Framework:** React (Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (with Lucide React for icons)
- **Data Fetching:** Axios (with custom interceptors)
- ***Note:*** Built strictly without Next.js, React Query, SWR, or ready-made data-table/pagination libraries as per project constraints.

## 🛠️ Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 🧠 Architectural Decisions & Problem Solving

This project was built to gracefully handle several complex edge cases and API limitations. Here are the core decisions made:

### 1. Custom URL-Driven State & Pagination
Instead of using external libraries, the entire application state (pagination, search, filtering, and sorting) is strictly synchronized with the URL using `useSearchParams`. 
- **Benefit:** Users can share links, refresh the page, or use browser back/forward buttons without losing their view state.
- **Resilience:** If a user manually enters invalid URL parameters (e.g., `?page=abc` or `?page=-5`), the custom hooks immediately sanitize the values and fallback to safe defaults (`page=1`), preventing the app from crashing.

### 2. Race Conditions & Fast Typing
To prevent the classic "stale search result" bug where an older API request finishes *after* a newer one, we implemented an `AbortController` pattern inside our `useProducts` hook. 
- **How it works:** If a user types fast, the previous network request is physically canceled before the new one is sent, guaranteeing that the final data shown on screen strictly matches the user's latest input.

### 3. Handling API Limitations (Search vs. Category)
**The Problem:** The `DummyJSON` API does not support simultaneously searching by query *and* filtering by category (e.g., `/products/category/smartphones/search?q=apple` is not a valid endpoint).
**The Solution:** We made Search and Category filtering mutually exclusive in the UI. If a user is filtering by category and decides to type in the search bar, the category filter is automatically cleared (and vice versa). This provides a predictable user experience while perfectly respecting the API's constraints.

### 4. Simulating Persistent CRUD (The Mutation Overlay)
**The Problem:** The DummyJSON API simulates `POST`, `PUT`, and `DELETE` requests by returning a success response, but it does not actually update the database. If we simply re-fetch the list, the user's changes disappear.
**The Solution:** We built a local "Mutation Overlay" architecture using `ProductContext` and `localStorage`.
- When a user adds, edits, or deletes a product, the action is stored locally.
- Whenever we fetch a fresh list of products from the API, we pass it through our overlay function:
  1. It filters out items the user deleted locally.
  2. It overwrites item data with any local edits the user made.
  3. It prepends brand new local items to the top of the list.
- **Result:** The user experiences a seamless, fully persistent CRUD application on the frontend, even though the backend resets.

### 5. Multi-Click Protection (Spam Guard)
To prevent users from clicking "Save" or "Login" multiple times quickly (which would send spam requests to the API), we built a custom `useSubmitGuard` hook. It uses a synchronous `useRef` lock combined with React state to absolutely guarantee that rapid double-clicks are ignored while a transaction is in flight.

## 🤖 AI Usage Statement

AI was utilized during this project as a pair-programming assistant to:
1. Rapidly scaffold boilerplate UI components with Tailwind CSS.
2. Brainstorm architectural solutions for the "Mutation Overlay" strategy to simulate CRUD persistence.
3. Validate React hook dependency arrays to ensure zero memory leaks with the `AbortController` logic.
All complex logic (pagination math, URL synchronization, and custom request orchestration) was meticulously structured and enforced manually to strictly adhere to the rule of using no 3rd-party query or data-table libraries.
