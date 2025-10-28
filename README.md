# 🎓 Chameleon FCDS - Educational Platform

[![Live Site](https://img.shields.io/badge/Live-chameleon--nu.tech-blue)](https://chameleon-nu.tech)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com)

**Chameleon FCDS** is a comprehensive educational platform designed for computer science and data science students at FCDS (Faculty of Computing and Data Sciences). Built with Next.js 14, featuring an interactive quiz system, tournament leaderboards, Google Drive integration, and advanced GSAP animations.

🌐 **Live:** [chameleon-nu.tech](https://chameleon-nu.tech)

🌐 **Live:** [chameleon-nu.tech](https://chameleon-nu.tech)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Core Features](#-core-features)
  - [Quiz System](#-quiz-system)
  - [Tournament System](#-tournament-system)
  - [Specializations](#-specializations)
  - [Google Drive Integration](#-google-drive-integration)
  - [Animations](#-animations)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 **Learning Management**
- **6 Specializations**: Computing & Data Sciences, Cybersecurity, AI, Media Analytics, Business Analytics, Healthcare Informatics
- **140+ Quizzes**: Multi-level questions with instant feedback
- **Level System**: Progressive difficulty from Level 1 to advanced levels
- **Personalized Dashboard**: Track progress, scores, and achievements
- **Certifications**: Earn certificates upon course completion

### 🏆 **Tournament System**
- **Real-time Leaderboards**: Separate rankings for Level 1 and Level 2
- **Competitive Scoring**: Points based on speed, mode, and completion
- **Tournament Prizes**: Exclusive rewards and recognition
- **First Attempt Scoring**: Only your first attempt counts (prevents score inflation)
- **Live Rankings**: See your rank among all participants
- **Tournament Period**: October 11, 2025 - January 11, 2026

### 📚 **Quiz Features**
- **Multiple Modes**: Traditional and Instant Feedback
- **Time Options**: 1, 5, 15, 30, 60 minutes, or unlimited
- **Smart Scoring**: Calculated based on duration, mode, and completion
- **Progress Tracking**: Visual progress indicators and statistics
- **Quiz History**: Review past attempts and scores

### 🎨 **Modern UI/UX**
- **GSAP Animations**: Smooth scroll animations, parallax effects
- **Dark Theme**: Eye-friendly dark mode design
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Magnetic buttons, floating elements
- **Accessibility**: WCAG 2.1 Level AA compliant

### 📁 **File Management**
- **Google Drive Integration**: Store and manage course materials
- **Automatic Token Refresh**: Seamless authentication
- **Folder Organization**: Department and specialization-based structure
- **Secure URLs**: Time-limited access tokens

### 📊 **Analytics & Insights**
- **Real-time Stats**: Live user enrollment and level distribution
- **Progress Visualization**: Dot plots and charts
- **Performance Metrics**: Track improvement over time
- **Tournament Analytics**: Detailed point breakdowns

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [GSAP 3](https://greensock.com/gsap/) + [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### **Backend**
- **Runtime**: Node.js
- **API Routes**: Next.js API Routes (Serverless)
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Authentication**: Custom Auth + Supabase
- **File Storage**: Google Drive API
- **Cron Jobs**: [cron-job.org](https://cron-job.org)

### **External Services**
- **OAuth**: Google OAuth 2.0
- **APIs**: Google Drive API, Google APIs Client
- **Analytics**: Vercel Analytics
- **Deployment**: [Vercel](https://vercel.com)

---

## 📁 Project Structure

```
perfect/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── admin/                    # Admin dashboard & controls
│   ├── api/                      # API routes
│   │   ├── cron/                 # Cron job endpoints (token refresh)
│   │   ├── google-drive/         # Google Drive API routes
│   │   ├── stats/                # Statistics endpoints
│   │   └── ...                   # Other API routes
│   ├── auth/                     # Authentication pages
│   ├── calculator/               # GPA calculator
│   ├── certifications/           # Certificates page
│   ├── dashboard/                # User dashboard
│   ├── drive/                    # Google Drive file manager
│   ├── profile/                  # User profile & stats
│   ├── quiz/                     # Quiz system
│   ├── specialization/           # Specialization pages
│   ├── Tournment/                # Tournament leaderboards
│   ├── upload/                   # File upload functionality
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── quiz-system/              # Quiz-specific components
│   ├── admin-controls.tsx        # Admin functionality
│   ├── navigation.tsx            # Navigation bar
│   ├── hero-geometric.tsx        # Hero section
│   ├── gsap-*.tsx                # GSAP animation components
│   └── ...                       # Other components
│
├── hooks/                        # Custom React hooks
│   ├── use-gsap-animations.ts    # GSAP animation hooks
│   ├── use-mobile.ts             # Mobile detection
│   ├── use-notifications.tsx     # Notification system
│   └── use-toast.ts              # Toast notifications
│
├── lib/                          # Utility functions & libraries
│   ├── supabase/                 # Supabase client & server
│   ├── google/                   # Google API utilities
│   ├── auth.ts                   # Authentication helpers
│   ├── tournament.ts             # Tournament logic
│   ├── utils.ts                  # General utilities
│   ├── quiz-level.ts             # Quiz level management
│   ├── metadata.ts               # SEO metadata
│   └── ...                       # Other utilities
│
├── public/                       # Static assets
│   ├── images/                   # Images
│   ├── quizzes/                  # Quiz JSON files
│   └── sw.js                     # Service worker
│
├── database/                     # Database scripts
│   ├── add_dark_mode_column.sql
│   └── add_login_attempt_tracking.sql
│
├── scripts/                      # Utility scripts
│   ├── python-backend/           # Python backend services
│   └── calculator_backend.py     # Calculator backend
│
├── styles/                       # Additional styles
├── temp/                         # Temporary files
├── data/                         # Static data files
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── next.config.mjs               # Next.js config
└── README.md                     # This file
```

---

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Cloud Console project with Drive API enabled
- Supabase project for database
- Vercel account for deployment
- cron-job.org account for scheduling

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd my-shadcn-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CRON_SECRET=your-secure-cron-secret-key
NEXT_PUBLIC_CRON_SECRET=your-secure-cron-secret-key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🎯 Core Features

### 🧠 Quiz System

The quiz system is the heart of Chameleon FCDS, providing an interactive learning experience.

#### **Quiz Modes**
- **Traditional Mode**: Answer all questions, then get results (+1.2 pts bonus)
- **Instant Feedback**: See correct answers immediately (+1.5 pts bonus)

#### **Time Options**
- **1 minute**: Quick challenge (+5 pts)
- **5 minutes**: Speed test (+4.5 pts)
- **15 minutes**: Balanced (+4 pts)
- **30 minutes**: Thorough (+3.5 pts)
- **60 minutes**: Deep dive (+3 pts)
- **Unlimited**: No pressure (+2.5 pts)

#### **Scoring System**
```
Tournament Points = (Correct Answers + Duration + Mode + Completion) ÷ 10
```

#### **Quiz Features**
- 140+ curated questions across all specializations
- Level-based difficulty progression
- First attempt scoring (retakes don't count for tournaments)
- Detailed performance analytics
- Question randomization
- Progress saving

#### **Quiz Locations**
```
public/quizzes/
├── specialization-name/
│   ├── level-1/
│   │   └── quiz-name.json
│   └── level-2/
│       └── quiz-name.json
```

---

### 🏆 Tournament System

Compete with peers in an ongoing championship spanning 3 months.

#### **Tournament Details**
- **Period**: October 11, 2025 - January 11, 2026
- **Levels**: Separate leaderboards for Level 1 and Level 2
- **Real-time**: Live ranking updates
- **Fair Play**: Only first attempts count

#### **Point Calculation**
| Category | Options | Points |
|----------|---------|--------|
| **Duration** | 1 min | +5 pts |
|  | 5 min | +4.5 pts |
|  | 15 min | +4 pts |
|  | 30 min | +3.5 pts |
|  | 60 min | +3 pts |
|  | Unlimited | +2.5 pts |
| **Mode** | Instant Feedback | +1.5 pts |
|  | Traditional | +1.2 pts |
| **Completion** | Completed | +2 pts |
|  | Timed Out | +1.5 pts |

**Final Score** = (Base Points + Bonuses) ÷ 10 (rounded)

#### **Rewards**
- 🥇 **1st Place**: Chameleon 2026 Ultimate Edition Hoodie
- 🎫 **Participation**: Administration Access to full Chameleon 2026
- 💰 **Streak Bonus**: 3-time streak wins 1000 L.E

#### **Leaderboard Features**
- Top 10 rankings displayed
- Personal rank indicator
- Level distribution breakdown
- User search and filtering
- Toggle view (all users / personal rank)

---

### 📚 Specializations

Six comprehensive learning paths tailored to modern tech careers:

#### **1. Computing and Data Sciences** 🌥️
- 45 Courses | 2,000+ Students
- Core CS fundamentals and data science
- Programming, algorithms, databases

#### **2. Cyber Security** 🛡️
- 32 Courses | 1,800+ Students
- Security protocols, ethical hacking
- Digital forensics and threat analysis

#### **3. Artificial Intelligence** 🧠
- 28 Courses | 2,000+ Students
- Machine learning, neural networks
- AI development and deployment

#### **4. Media Analytics** 📊
- 52 Courses | 300+ Students
- Full-stack development
- Software engineering practices

#### **5. Business Analytics** 💼
- 24 Courses | 400+ Students
- Management and finance
- Marketing and entrepreneurship

#### **6. Healthcare Informatics** 🏥
- 18 Courses | 200+ Students
- Medical data systems
- Health information management

---

### 📁 Google Drive Integration

Seamless file management for course materials and resources.

#### **Features**
- **OAuth 2.0 Authentication**: Secure Google account integration
- **Automatic Token Refresh**: Every 30 minutes via cron-job.org
- **Folder Mapping**: Department and specialization-based organization
- **Secure URLs**: Time-limited access tokens for file viewing
- **File Browser**: Intuitive interface for browsing materials
- **Admin Controls**: Token monitoring and management

#### **Token Refresh System**
```typescript
// Automatic refresh every 30 minutes
Cron Job → /api/cron/token-refresh
         → Checks expiry
         → Refreshes tokens
         → Updates database
```

#### **Folder Structure**
```
Google Drive/
├── Computing & Data Sciences/
│   ├── Level 1/
│   └── Level 2/
├── Cyber Security/
├── Artificial Intelligence/
└── [Other Specializations]/
```

---

### 🎨 Animations

Beautiful, performant animations powered by GSAP and Framer Motion.

#### **GSAP Scroll Animations**
- **Fade In**: Smooth opacity transitions
- **Stagger**: Sequential element animations
- **Parallax**: Depth-based scrolling effects
- **Reveal**: Directional slide-ins
- **Scale**: Growth animations with rotation
- **Morph**: Clip-path transformations
- **Magnetic Buttons**: Interactive hover effects
- **Floating Elements**: Ambient background motion

#### **Performance Optimizations**
- GPU-accelerated transforms
- Hardware acceleration
- Debounced resize handlers
- Proper cleanup on unmount
- Respects `prefers-reduced-motion`
- 60 FPS target maintained

#### **Custom Hooks**
```typescript
useGsapFadeIn(delay)      // Fade in with upward motion
useGsapStagger(delay)     // Staggered children animations
useGsapParallax(speed)    // Parallax scrolling
useGsapReveal(direction)  // Directional reveals
useGsapScale(delay)       // Scale and rotate
useGsapMorphIn(delay)     // Clip-path morphing
```

#### **Components**
- `GsapScrollWrapper`: Performance configuration
- `GsapScrollProgress`: Gradient progress bar
- `GsapMagneticButton`: Interactive buttons
- `GsapFloatingElements`: Background ambiance

---

## 🔐 Authentication

Custom authentication system with multiple security layers.

#### **Features**
- Email/Password registration and login
- Session-based authentication
- Password hashing with bcrypt
- Login attempt tracking
- Session expiration
- Remember me functionality
- Secure cookie storage

#### **User Roles**
- **Student**: Access to courses, quizzes, tournaments
- **Admin**: Full platform management access

#### **Protected Routes**
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/quiz` - Quiz system
- `/admin` - Admin panel (admin only)
- `/drive` - Google Drive files

---

## 🗄️ Database Schema

PostgreSQL database powered by Supabase.

#### **Main Tables**

**chameleons** - User profiles
```sql
- user_id (UUID, PK)
- username (TEXT)
- email (TEXT, UNIQUE)
- password (TEXT, hashed)
- current_level (INTEGER)
- specialization (TEXT)
- profile_image (TEXT)
- dark_mode (BOOLEAN)
- created_at (TIMESTAMP)
```

**quiz_data** - Quiz attempts and scores
```sql
- id (SERIAL, PK)
- user_id (UUID, FK)
- quiz_id (INTEGER)
- quiz_level (INTEGER)
- score (INTEGER)
- duration_selected (TEXT)
- answering_mode (TEXT)
- how_finished (TEXT)
- total_questions (INTEGER)
- solved_at (TIMESTAMP)
```

**google_tokens** - OAuth tokens
```sql
- id (SERIAL, PK)
- user_id (UUID, FK)
- access_token (TEXT)
- refresh_token (TEXT)
- expires_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**notifications** - User notifications
```sql
- id (SERIAL, PK)
- user_id (UUID, FK)
- title (TEXT)
- message (TEXT)
- type (TEXT)
- read (BOOLEAN)
- created_at (TIMESTAMP)
```

---

---

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### **Quiz System**
- `GET /api/quiz/[level]/[quiz-id]` - Get quiz data
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get user quiz history

### **Tournament**
- `GET /api/tournament/leaderboard/[level]` - Get leaderboard
- `GET /api/tournament/stats` - Tournament statistics

### **Statistics**
- `GET /api/stats/users` - Get user enrollment stats
- `GET /api/stats/levels` - Get level distribution

### **Google Drive**
- `GET /api/google-drive/auth` - Initiate OAuth flow
- `GET /api/google-drive/callback` - OAuth callback
- `GET /api/google-drive/files` - List files
- `GET /api/google-drive/folders` - List folders

### **Cron Jobs**
- `GET/POST /api/cron/token-refresh` - Automatic token refresh

### **Admin**
- `POST /api/admin/refresh-token` - Manual token refresh
- `GET /api/admin/token-status` - Check token status

---

## 🚢 Deployment

### **Environment Variables**

Create a `.env.local` file for development:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://chameleon-nu.tech

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cron Secret
CRON_SECRET=your-secure-cron-secret
NEXT_PUBLIC_CRON_SECRET=your-secure-cron-secret

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### **Vercel Deployment**

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure environment variables

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Domain Configuration**
   - Add custom domain: `chameleon-nu.tech`
   - Configure DNS settings
   - Enable automatic HTTPS

### **Cron Job Setup (cron-job.org)**

1. Create account at [cron-job.org](https://cron-job.org)
2. Add new cron job:
   - **URL**: `https://chameleon-nu.tech/api/cron/token-refresh`
   - **Schedule**: Every 30 minutes
   - **Method**: GET
   - **Headers**:
     ```
     x-cron-secret: your-secure-cron-secret
     ```
3. Enable and save

### **Google Cloud Console Setup**

1. **Create Project**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project

2. **Enable APIs**
   - Google Drive API
   - Google OAuth2 API

3. **Create OAuth Credentials**
   - OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://chameleon-nu.tech/api/google-drive/callback
     http://localhost:3000/api/google-drive/callback
     ```

4. **Copy Credentials**
   - Client ID → `GOOGLE_CLIENT_ID`
   - Client Secret → `GOOGLE_CLIENT_SECRET`

### **Supabase Setup**

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Run Database Scripts**
   ```sql
   -- Execute scripts from database/ folder
   -- Set up tables, indexes, and relationships
   ```

3. **Copy Credentials**
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

4. **Configure Policies**
   - Set up Row Level Security (RLS)
   - Configure access policies

---

## 📊 Performance Metrics

### **Lighthouse Scores**
- ⚡ Performance: 95+
- ♿ Accessibility: 98+
- 🎯 Best Practices: 100
- 🔍 SEO: 100

### **Core Web Vitals**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### **Bundle Size Optimization**
- Code splitting by route
- Dynamic imports for heavy components
- Tree shaking enabled
- Minification and compression

---

## 🛠️ Development

### **Project Setup**
```bash
# Clone repository
git clone https://github.com/your-repo/chameleon-fcds.git
cd chameleon-fcds

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **Code Style**
- ESLint for linting
- Prettier for formatting
- TypeScript for type safety
- Conventional commits

### **Testing**
```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📖 Documentation

Additional documentation available:
- [GSAP Animations Guide](./GSAP_ANIMATIONS_GUIDE.md)
- [Drive Integration Summary](./DRIVE_INTEGRATION_SUMMARY.md)
- [Security Enhancement Summary](./SECURITY_ENHANCEMENT_SUMMARY.md)
- [Notification System README](./NOTIFICATION_SYSTEM_README.md)
- [Folder Management Enhancement](./FOLDER_MANAGEMENT_ENHANCEMENT.md)
- [Metadata Guide](./METADATA_GUIDE.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

### **Common Issues**

#### **Token Refresh Fails**
```bash
# Check admin dashboard
Visit: https://chameleon-nu.tech/admin

# Verify cron secret
Ensure CRON_SECRET matches in Vercel and cron-job.org

# Check token status
Look for expired refresh tokens in database
```

#### **Quiz Not Loading**
```bash
# Verify quiz file exists
Check: public/quizzes/[specialization]/level-[x]/[quiz-name].json

# Check file format
Ensure valid JSON structure

# Clear cache
Hard refresh browser (Ctrl+Shift+R)
```

#### **Tournament Points Mismatch**
```bash
# Points are calculated as:
(Correct + Duration + Mode + Completion) ÷ 10 (rounded)

# Only first attempts count
Retakes don't affect tournament standings

# Check date range
Tournament: Oct 11, 2025 - Jan 11, 2026
```

#### **Animation Performance**
```bash
# Disable animations for testing
Add to globals.css:
* { animation: none !important; }

# Check browser support
GSAP requires modern browser

# Reduce motion preference
System Settings → Accessibility → Reduce Motion
```

#### **Database Connection**
```bash
# Verify Supabase credentials
Check environment variables

# Test connection
npm run dev
# Check console for connection errors

# Check RLS policies
Ensure proper row-level security setup
```

---

## 📞 Support

For support and questions:
- 📧 Email: tokyo9900777@gmail.com
- 💬 WhatsApp: [+201552828377](https://wa.me/+201552828377)
- 🔗 LinkedIn: [Abdo Ahmed](https://www.linkedin.com/in/abdoahmed/)

---

## 📜 License

This project is proprietary software. All rights reserved © 2025 Chameleon FCDS.

**Created by**: Levi Ackerman  
**Platform**: Chameleon FCDS Educational Platform  
**Website**: [chameleon-nu.tech](https://chameleon-nu.tech)

---

## 🙏 Acknowledgments

- **Students**: Faculty of Computing and Data Sciences
- **Technologies**: Next.js, React, Supabase, GSAP
- **UI Libraries**: shadcn/ui, Radix UI, Tailwind CSS
- **Hosting**: Vercel
- **Community**: Open source contributors

---

## 📈 Stats

![Total Users](https://img.shields.io/badge/Users-5000%2B-blue)
![Quizzes](https://img.shields.io/badge/Quizzes-140%2B-green)
![Courses](https://img.shields.io/badge/Courses-200%2B-orange)
![Solved Quizzes](https://img.shields.io/badge/Solved-30K%2B-purple)

---

**Built with ❤️ for FCDS students**

*Last Updated: October 28, 2025*
