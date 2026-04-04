# AI Customer Support Ticket System (Frontend)

A modern, responsive, and intelligent React application built to streamline customer support operations. This application features automated AI-generated responses using RAG (Retrieval-Augmented Generation) based on an organizational Knowledge Base, seamless role-based ticket management, and an intuitive user interface powered by Material UI.

## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Distinct experiences for `customer` and `ticket_admin` users, powered by Clerk authentication.
* **Customer Dashboard:** Allows customers to create new support tickets, view their own ticket history, and read automated AI resolutions or admin responses.
* **Admin Dashboard:** Empowers support agents to monitor all organizational tickets, interact with customers via a live chat interface, and manage ticket lifecircles (e.g., closing tickets).
* **AI-Powered Responses:** Seamlessly integrates with the backend to trigger automated, context-aware responses to new tickets based on uploaded knowledge base documents.
* **Knowledge Base Management:** Admins can create and manage organizational knowledge bases by uploading documents (PDF, DOCX, TXT), which are processed into embeddings for the AI pipeline.
* **Real-time Data Fetching:** Optimized API interactions via Axios with global state management using Redux Toolkit.

## 🛠️ Tech Stack

* **Core:** React 19, React Router DOM v7
* **Build Tool:** Vite
* **Styling & UI:** Material UI (MUI), Emotion, Vanilla CSS
* **Authentication:** Clerk (`@clerk/clerk-react`)
* **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
* **API Client:** Axios
* **Notifications:** React Toastify

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

* **Node.js** (v18 or higher recommended)
* **npm** (Node Package Manager)
* A running instance of the **AI Support Backend API** (FastAPI/Python based).

## 💻 Local Setup Workflow

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd AI_UI
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add the necessary environment variables. You will need your Clerk Publishable Key and the URL where your backend API is running.
   
   Example `.env`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   REACT_BASE_URL=http://127.0.0.1:8000/
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or another port depending on Vite's assignment).

## 📂 Project Structure

```text
src/
├── app/               # Redux store and global slices
├── components/        # Reusable UI components
│   ├── KnowledgeBase/ # KB Dashboard & Creation components
│   ├── Ticket/        # Ticket Dashboard, Overviews, and Detail Modals
│   └── ...
├── hooks/             # Custom React hooks (e.g., useAxios for API calls)
├── pages/             # Route-level page components
├── styles/            # Global/CSS files
└── main.jsx           # App entry point and Provider wrapping
```

## 📜 Available Scripts

* `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
* `npm run build`: Bundles the app for production.
* `npm run lint`: Runs ESLint to check for code quality and style issues.
* `npm run preview`: Locally previews the production build.

## 🔒 Authentication & Roles

This application relies on [Clerk](https://clerk.com/) for identity management. To test the complete flow, ensure you have set up users with appropriate metadata specifying their roles (e.g., `ticket_admin`). This dictates which views and actions are rendered upon login.
