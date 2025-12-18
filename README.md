# Club Sphere

An advanced, full-stack management platform designed to streamline club operations, event coordination, and financial tracking. Built with the MERN stack and secured with Firebase and JWT, Club Sphere provides a robust role-based experience for Administrators, Managers, and Members.

### 🔗 [Live Deployment URL](https://club-sphere-client-new-62n4.vercel.app/)

---

## 🚀 Project Purpose
The primary goal of Club Sphere is to bridge the gap between club organizers and members. It automates the heavy lifting of management—handling memberships, event registrations, and revenue tracking—allowing club managers to focus on building their communities while ensuring administrators have total visibility over platform health and security.

---

## ✨ Key Features

### 🛡️ Secure Role-Based Access Control (RBAC)
* **Admin Dashboard:** Comprehensive control over the platform, user role management, and global analytical insights.
* **Manager Console:** Dedicated tools for club creation, member approval workflows, and event pipeline management.
* **Member Portal:** User-friendly interface to discover clubs, join communities, and pay for event tickets securely.

### 📊 Data-Driven Insights
* **Dynamic Dashboards:** Real-time KPI cards showing Active Clubs, Total Members, and Upcoming Events.
* **Visual Analytics:** Interactive charts built with **Recharts** to visualize revenue streams and engagement trends.

### 💳 Integrated Payments
* **Stripe Secure Checkout:** Full integration with Stripe for handling membership fees and event registrations.
* **Transaction History:** Automated revenue tracking and payment status management.

### ⚡ Performance & UX
* **Modern UI/UX:** A sleek, responsive interface built with **Tailwind CSS v4** and **DaisyUI**.
* **Smooth Transitions:** Enhanced user experience with **Framer Motion** animations.
* **Optimized Data Fetching:** Utilizes **TanStack Query** (React Query) for efficient caching and synchronization.

---

## 📦 Important npm Packages Used

| Category | Packages |
| :--- | :--- |
| **Frontend Framework** | `react` (v19), `vite`, `react-router-dom` |
| **State Management** | `@tanstack/react-query`, `axios` |
| **Security & Auth** | `firebase`, `json-web-token` (Backend integration) |
| **Payments** | `@stripe/react-stripe-js`, `@stripe/stripe-js` |
| **UI & Styling** | `tailwindcss`, `daisyui`, `framer-motion` |
| **Icons & Feedback** | `lucide-react`, `react-icons`, `sweetalert2`, `react-hot-toast` |
| **Forms & Data** | `react-hook-form`, `recharts` |

---

## 🛠️ Local Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/club-sphere.git](https://github.com/your-username/club-sphere.git)
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file and add your credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_key
    VITE_STRIPE_PUBLIC_KEY=your_key
    VITE_API_URL=http://localhost:5000
    ```

4.  **Launch Development Server:**
    ```bash
    npm run dev
    ```

---

## 🛡️ Author
**Roksana Dilshad** Full-Stack Developer  
[GitHub Profile](https://github.com/roksanadilshad)