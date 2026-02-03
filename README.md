📊 Personal Finance Tracker
A modern, full-stack web application designed to help users monitor their personal finances, track daily expenses, and manage long-term savings goals.

🚀 Key Features
Transaction Management: Easily log income and expenses with specific categories.
Savings Goals: Set financial targets (e.g., "New Laptop") and visualize your progress with real-time progress bars.
Dynamic Analytics: Interactive Pie Charts to analyze spending distribution by category.
Advanced Filtering: Instant search by category, filtering by transaction type (Income/Expense), and specific month/year selection.
Multi-currency Support: Toggle between EUR and PLN, with user preferences stored in localStorage.
User Authentication: Secure sign-in and data protection powered by Supabase Auth.

🛠 Tech Stack
Frontend: Next.js 14+ (App Router)
Language: TypeScript
Styling: Tailwind CSS
UI Components: shadcn/ui
Backend-as-a-Service: Supabase (PostgreSQL)
Charts: Recharts
Icons: Lucide React

🏗 Data Architecture & Logic
The application follows a Client-Side Rendering (CSR) pattern, ensuring a snappy and interactive user experience.
State Management: Utilizes React's useState and useEffect hooks to manage local data flow and synchronization with the database.
Data Transformation: * Complex data manipulation using .reduce() to group flat transaction lists into date-based sections.
  Real-time calculation of monthly balances, total income, and total expenses directly on the client side.
Database: Two relational tables (transactions and savings_goals) linked via goal_id to track specific savings contributions.


💡 Core Competencies Demonstrated:
Backend Integration: Implementing a BaaS (Supabase) for authentication and real-time database operations.
Data Handling: Transforming and filtering large arrays of objects to provide meaningful insights.
UI/UX Design: Building a responsive, "Mobile First" dashboard with a focus on scannability and ease of use.
State Persistence: Using browser APIs like localStorage to enhance user experience across sessions.
