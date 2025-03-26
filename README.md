# Tally - Your AI Tax & Finance Assistant

Tally is your friendly AI assistant for all things tax and finance. Whether you're looking for tax-saving tips, insights on deductions, or financial planning advice, Tally makes it easy to navigate the world of personal finance. From tracking tax brackets to explaining credits and deductions, Tally helps you stay informed and make smarter financial decisions—keeping track of your taxes, one number at a time.

![cursorful-video-1743027793362](https://github.com/user-attachments/assets/174b1a52-3b74-4c6c-b328-e19a330503b4)

## 🚀 Features

### 🌐 Project Initialization
- **Next.js** for a seamless, server-rendered experience  
- **Tailwind CSS** for a clean, responsive UI  
- Hosted on **Vercel** for smooth deployment  

### 💬 Chat Interface
- **Vercel AI SDK (useChat)** powers an interactive chat UI  
- **Chat bubbles** for a conversational experience  
- **Chat history sidebar** for easy access to past conversations  
- Options to **delete chat history** or **start a new chat**  

### 📂 File Upload Capability
- Upload **PDFs and images** (e.g., W-2 forms, receipts)  
- Placeholder logic to **simulate document analysis**  
- AI can reference uploaded files in responses  

### 🤖 AI-Powered Tax Insights
- **Pre-prompted outputs** for tax brackets, standard deductions, and financial advice  
- Clickable **quick-reply buttons** (e.g., “How do tax brackets work?”, “Tell me about deductions”)  
- Supports **multimedia responses** (e.g., HTML tables, basic bar charts for tax breakdowns)  

### ⚡ Performance & Optimization
- **TanStack Query (useQuery)** to handle async operations efficiently  
- **State management** for file uploads and chat history  
- **Intuitive UI/UX** for a smooth user experience  

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/your-repo/tally-ai.git
cd tally-ai
```

### 2️⃣ Create an `.env.local` file
```sh
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
```

### 3️⃣ Install dependencies
```sh
npm install
```

### 4️⃣ Run the development server
```sh
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🔜 Next Steps

- **AI Model Upgrade**: Implement an AI model that can analyze financial documents  
- **Branding Enhancements**: Create Logos, Favicons, etc..
- **Expanded File Analysis**: Enable real-time tax document parsing and summary generation  

---

🚀 Built with **Next.js, Tailwind CSS, Vercel AI SDK, TanStack Query, and Gemini AI SDK**.  

Want to contribute? Open an issue or submit a PR! 😊

