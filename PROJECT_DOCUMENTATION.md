# Mottapuffs - Project Documentation 📚

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Features & Functionality](#features--functionality)
4. [Technical Implementation](#technical-implementation)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Components](#frontend-components)
8. [Deployment Guide](#deployment-guide)
9. [User Guide](#user-guide)
10. [Development Setup](#development-setup)

---

## Project Overview

**Mottapuffs** is a real-time puff inventory tracking system designed for CEP's campus food shop. The application provides students with live updates on puff availability across three categories: Chicken, Motta (Egg), and Meat puffs.

### Key Objectives
- Provide real-time puff inventory tracking
- Enhance user experience with dynamic messaging
- Implement a competitive leaderboard system
- Create an engaging UI with custom typography and animations
- Ensure seamless user authentication and data persistence

### Target Audience
- Students of College of Engineering Perumon
- Campus food shop staff
- Anyone interested in real-time puff availability

---

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Admin API     │
│   (React)       │◄──►│   Database      │◄──►│   (Express)     │
│                 │    │   & Auth        │    │                 │
│ • Home Page     │    │                 │    │ • Stats Update  │
│ • Add Puffs     │    │ • Real-time     │    │ • Admin Panel   │
│ • Leaderboard   │    │ • Authentication│    │                 │
│ • Achievements  │    │ • Row Level     │    │                 │
│ • Welcome       │    │   Security      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 19.1.1 with Vite 7.1.1
- Tailwind CSS for styling
- React Router DOM for navigation
- Custom fonts (Clash Display, Sue Ellen Francisco)

**Backend:**
- Supabase (PostgreSQL) for database
- Real-time subscriptions for live updates
- Row Level Security (RLS) for data protection
- Express.js for admin API endpoints

**Deployment:**
- Vercel for frontend hosting
- Railway/Vercel for backend APIs
- Git/GitHub for version control

---

## Features & Functionality

### 🏠 Home Page
- **Real-time Puff Stacks**: Visual representation of puff inventory with stacked images
- **Dynamic Messaging**: Malayalam-style messages that change based on puff counts
- **Search Bar Interface**: Chat-like interface with contextual messages
- **Live Updates**: Automatic refresh when puff counts change
- **Responsive Design**: Optimized for mobile and desktop

#### Dynamic Messages System
```javascript
// Examples of dynamic messages based on puff counts
totalPuffs === 0: "puffs ellam poyi, poyi nale va, loser!"
totalPuffs === 2: "randu puffs mathram baki, ippo allaengil njan thinnum!"
totalPuffs >= 3 && totalPuffs <= 5: "ningalarinjille, kalyan silksil aadi sale thodangi..."
```

### 🥟 Add Puffs Page
- **Form-based Entry**: Select puff type and quantity
- **Validation**: Mandatory field checks and quantity limits
- **Success Feedback**: Visual confirmation of successful additions
- **Auto-redirect**: Automatic navigation to home after successful submission
- **Clean UI**: No navigation clutter for focused experience

### 🏆 Leaderboard Page
- **Top Puffers**: Ranking of users by puff consumption
- **Promotional Messaging**: Monthly reward announcements
- **User Statistics**: Individual consumption tracking
- **Competitive Elements**: Badges and ranking systems

### 🏅 Achievements Page
- **Badge System**: Achievement tracking for milestones
- **Progress Indicators**: Visual progress towards goals
- **Trophy Icons**: Engaging visual rewards
- **Empty State Handling**: Graceful display when no achievements

### 🔐 Welcome Page
- **Dual Mode**: Login and Registration functionality
- **Form Validation**: Comprehensive input validation
- **Visual Design**: Decorative elements matching app theme
- **Persistent Sessions**: Remember user login state

---

## Technical Implementation

### Component Architecture

```
App.jsx
├── RequireAuth (HOC)
├── Routes
│   ├── Welcome.jsx
│   ├── Home.jsx
│   │   ├── PuffStack Component
│   │   ├── BottomNavigation Component
│   │   └── Dynamic Messaging System
│   ├── AddPuffs.jsx
│   ├── Leaderboard.jsx
│   └── Achievements.jsx
```

### State Management
- **Local State**: React useState for component-specific data
- **Global State**: Supabase real-time subscriptions for shared data
- **Persistent State**: localStorage for user authentication
- **Real-time Updates**: WebSocket connections via Supabase

### Authentication Flow
1. User enters credentials on Welcome page
2. Supabase Auth validates and creates session
3. User data stored in localStorage
4. RequireAuth HOC protects authenticated routes
5. Automatic redirect to Welcome if not authenticated

### Real-time Data Flow
1. Component mounts and fetches initial data
2. Subscribes to Supabase real-time channel
3. Receives updates via WebSocket
4. Updates local state automatically
5. UI re-renders with new data

---

## Database Schema

### Tables

#### `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `stats` Table (Global Puff Counts)
```sql
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  chicken INTEGER DEFAULT 0,
  motta INTEGER DEFAULT 0,
  meat INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_puffs` Table (Individual Consumption)
```sql
CREATE TABLE user_puffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  puff_type TEXT NOT NULL CHECK (puff_type IN ('chicken', 'motta', 'meat')),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### SQL Functions

#### `increment_stats` Function
```sql
CREATE OR REPLACE FUNCTION increment_stats(puff_type TEXT, qty INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE stats 
  SET 
    chicken = CASE 
      WHEN puff_type = 'chicken' THEN GREATEST(0, chicken - qty)
      ELSE chicken 
    END,
    motta = CASE 
      WHEN puff_type = 'motta' THEN GREATEST(0, motta - qty)
      ELSE motta 
    END,
    meat = CASE 
      WHEN puff_type = 'meat' THEN GREATEST(0, meat - qty)
      ELSE meat 
    END,
    updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql;
```

---

## API Documentation

### Supabase Client APIs

#### Authentication
```javascript
// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: user.email,
  password: user.password
});

// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: newUser.email,
  password: newUser.password
});
```

#### Data Operations
```javascript
// Fetch Global Stats
const { data, error } = await supabase
  .from('stats')
  .select('*')
  .single();

// Add Puffs
const { error } = await supabase.rpc('increment_stats', {
  puff_type: type,
  qty: quantity
});

// Real-time Subscription
const subscription = supabase
  .channel('stats-changes')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'stats' },
    (payload) => handleUpdate(payload)
  )
  .subscribe();
```

### Admin API Endpoints

#### Set Puff Counts (Admin Only)
```http
POST /api/stats/set
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "chicken": 50,
  "motta": 30,
  "meat": 25
}
```

#### Health Check
```http
GET /health

Response: { "ok": true }
```

---

## Frontend Components

### Home Component Features
- **Real-time Data**: Live puff count updates
- **Visual Stacks**: Dynamic puff stack rendering based on counts
- **Multi-stack Logic**: Handles counts > 15 with multiple stacks
- **Responsive Layout**: Adapts to different screen sizes
- **Performance Optimized**: Efficient re-rendering with proper dependency arrays

### PuffStack Component Logic
```javascript
// Stack calculation (15 puffs per stack)
const stacksNeeded = Math.ceil(count / 15);

// Individual stack creation
for (let stackIndex = 0; stackIndex < stacksNeeded; stackIndex++) {
  const remainingPuffs = count - stackIndex * 15;
  const puffsInThisStack = Math.min(remainingPuffs, 15);
  // Render stack with proper z-index and positioning
}
```

### Navigation System
- **Bottom Navigation**: Consistent across all pages
- **Active State**: Visual indication of current page
- **Icon Integration**: Emoji icons for better UX
- **Responsive Design**: Adapts to mobile and desktop

---

## Deployment Guide

### Frontend Deployment (Vercel)

1. **Prepare Configuration**
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. **Environment Variables**
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Deploy**
```bash
vercel --prod
```

### Backend Deployment (Railway)

1. **Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

2. **Environment Variables**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_TOKEN=your_admin_token
NODE_ENV=production
```

---

## User Guide

### Getting Started
1. **Access Application**: Visit https://mottapuffs.vercel.app
2. **Create Account**: Use the Welcome page to register
3. **Login**: Enter credentials to access the dashboard

### Using the App
1. **View Puff Counts**: Home page shows real-time inventory
2. **Add Puffs**: Use Add page to record puff purchases
3. **Check Leaderboard**: See top puffers and rankings
4. **Track Achievements**: Monitor your progress and badges

### Features Overview
- **Real-time Updates**: No need to refresh, data updates automatically
- **Mobile Friendly**: Works seamlessly on mobile devices
- **Offline Handling**: Graceful degradation when connection is lost
- **Fast Loading**: Optimized for quick page loads

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Supabase account

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd mottapuffs

# Install frontend dependencies
cd client
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

### Database Setup
1. Create Supabase project
2. Run SQL migrations in Supabase SQL editor
3. Set up Row Level Security policies
4. Configure real-time settings

### Testing
```bash
# Run build test
npm run build

# Check for linting issues
npm run lint

# Preview production build
npm run preview
```

---

## Performance Optimizations

### Frontend Optimizations
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Compressed PNG assets
- **Bundle Splitting**: Vite automatic code splitting
- **Caching**: Browser caching for static assets
- **Real-time Throttling**: Debounced real-time updates

### Database Optimizations
- **Indexing**: Proper indexes on frequently queried columns
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Efficient SQL queries with proper joins
- **Real-time Filters**: Targeted subscriptions to reduce overhead

---

## Security Considerations

### Authentication Security
- **Password Hashing**: Secure password storage with Supabase Auth
- **Session Management**: Secure session handling
- **CSRF Protection**: Built-in protection with Supabase
- **Row Level Security**: Database-level access control

### Data Protection
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Proper input sanitization
- **HTTPS Enforcement**: Secure communication

---

## Future Enhancements

### Planned Features
- **Push Notifications**: Real-time alerts for puff availability
- **Mobile App**: React Native implementation
- **Analytics Dashboard**: Detailed consumption analytics
- **Inventory Predictions**: ML-based stock predictions
- **Social Features**: User interactions and sharing

### Technical Improvements
- **Caching Layer**: Redis for improved performance
- **CDN Integration**: Global content distribution
- **Monitoring**: Application performance monitoring
- **Testing**: Comprehensive test suite
- **Documentation**: API documentation with Swagger

---

*This documentation was created for the Mottapuffs project by Team Ex for TinkerHub Useless Projects 2025.*
