# HolaChat - Modern AI Chat Application

HolaChat is a feature-rich, real-time chat application built with React, TypeScript, and Supabase. It offers a seamless chat experience with AI integration, code formatting, and beautiful UI components.

![HolaChat Screenshot](./public/Screenshot.png)

## ✨ Features

- 🔐 **Authentication** - Secure user authentication with Supabase
- 🤖 **AI-Powered** - Integrated with Groq for intelligent responses
- 💬 **Real-time Chat** - Instant messaging with real-time updates
- 📝 **Markdown Support** - Rich text formatting with markdown
- 💻 **Code Highlighting** - Beautiful syntax highlighting for code blocks
- 🌓 **Dark/Light Theme** - Built-in theme support
- 🚀 **Blazing Fast** - Built with Vite for optimal performance
- 📱 **Responsive Design** - Works on all device sizes

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase
- **AI Integration**: Groq
- **UI Components**: React Icons
- **Markdown**: React Markdown with rehype/remark plugins
- **State Management**: React Context API
- **Routing**: React Router v6

## 📁 Project Structure

```
holachat/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and static files
│   ├── components/        # Reusable React components
│   │   ├── LLMMessageRenderer.tsx  # AI message renderer with code highlighting
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── ProtectedRoute.tsx  # Authentication guard
│   │   └── ...
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── ChatContext.tsx    # Chat state management
│   ├── lib/               # Utility functions and API clients
│   │   ├── supabaseClient.ts  # Supabase client configuration
│   │   ├── groq.ts            # Groq API client
│   │   └── database.types.ts  # TypeScript types for database
│   ├── pages/             # Page components
│   │   ├── Chat.tsx       # Main chat interface
│   │   ├── Login.tsx      # Login page
│   │   └── Landing.tsx    # Landing page
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── .env.example          # Environment variables example
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.ts        # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn (v1.22 or higher)
- Supabase account (for authentication)
- Groq API key (for AI chat)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayush-patel-29/holachat.git
   cd holachat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your Supabase and Groq API credentials
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_SUPABASE_DB_PASSWORD=your_supabase_db_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173`

## 🏗 Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```