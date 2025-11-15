# StreamVibe - Modern Video Streaming Platform

A complete, modern streaming platform with a clean UI/UX design, featuring video uploads, user authentication, analytics, and social features.

## 🚀 **LIVE DEMO**

**Deploy to GitHub Pages in 2 minutes!**

1. Go to **Settings** → **Pages**
2. Select branch: `claude/streaming-platform-design-01WjbFvg9pMd4Xw4yifC46DG`
3. Select folder: `/ (root)`
4. Click **Save**
5. Visit: `https://[username].github.io/[repo-name]/`

**Full deployment guide:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🎯 Features

### Core Features
- **Video Management**: Upload, view, and manage videos (MP4, WebM, etc.)
- **User Authentication**: Complete auth system with login, signup, and password reset
- **Social Features**: Likes, comments, subscriptions, and notifications
- **Analytics**: User dashboard with detailed video analytics
- **Playlists**: History and watch-later functionality
- **Search & Discovery**: Advanced search with categories and trending videos

### UI/UX
- **Dark Mode**: Modern, Netflix-meets-YouTube aesthetic
- **Responsive Design**: Optimized for desktop and mobile
- **Smooth Animations**: Professional transitions and micro-interactions
- **Clean Interface**: Simplified, intuitive navigation

## 📁 Project Structure

```
streaming-platform/
├── README.md
├── DATABASE_SCHEMA.md
├── API_DOCUMENTATION.md
├── frontend/
│   ├── index.html              # Homepage
│   ├── login.html              # Login page
│   ├── signup.html             # Signup page
│   ├── reset-password.html     # Password reset
│   ├── video.html              # Video player page
│   ├── dashboard.html          # User dashboard
│   ├── profile.html            # User profile
│   ├── upload.html             # Upload video
│   ├── history.html            # Watch history
│   ├── watch-later.html        # Watch later playlist
│   ├── css/
│   │   ├── main.css            # Global styles
│   │   ├── components.css      # Reusable components
│   │   └── animations.css      # Animation definitions
│   └── js/
│       ├── app.js              # Main application logic
│       ├── auth.js             # Authentication handling
│       ├── video-player.js     # Video player functionality
│       ├── upload.js           # Upload handling
│       └── api.js              # API client
├── backend/
│   ├── server.js               # Express server
│   ├── routes/
│   │   ├── auth.js             # Auth endpoints
│   │   ├── videos.js           # Video endpoints
│   │   ├── users.js            # User endpoints
│   │   └── analytics.js        # Analytics endpoints
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── Video.js            # Video model
│   │   ├── Comment.js          # Comment model
│   │   └── Subscription.js     # Subscription model
│   └── middleware/
│       ├── auth.js             # Auth middleware
│       └── upload.js           # File upload middleware
└── uploads/                    # Video storage directory
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- Modern web browser

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start MongoDB
mongod

# Run the application
npm start
```

### Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/streamvibe
JWT_SECRET=your-secret-key
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=500MB
```

## 🎨 Design System

### Color Palette
- **Primary**: #FF0050 (Vibrant Pink)
- **Secondary**: #8B5CF6 (Purple)
- **Background**: #0F0F0F (Dark Black)
- **Surface**: #1A1A1A (Dark Gray)
- **Text**: #FFFFFF (White)
- **Text Secondary**: #A0A0A0 (Gray)

### Typography
- **Headings**: Inter, system-ui
- **Body**: -apple-system, BlinkMacSystemFont

### Components
- Cards with hover effects
- Smooth transitions (0.3s ease)
- Rounded corners (8px-16px)
- Shadow elevation system

## 📊 Technology Stack

### Frontend
- HTML5
- CSS3 (with CSS Grid & Flexbox)
- Vanilla JavaScript (ES6+)
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (file uploads)

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT token authentication
- CSRF protection
- Rate limiting
- Input validation
- XSS prevention
- Secure file upload validation

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎬 Key Pages

1. **Homepage**: Trending and recommended videos with search
2. **Video Player**: Full player with comments and suggestions
3. **Dashboard**: Analytics and uploaded videos management
4. **Profile**: User information and channel page
5. **Upload**: Video upload with metadata editing
6. **Authentication**: Login, signup, password reset flows

## 📈 Analytics Tracked

- Total views
- Daily views
- Watch time
- Engagement rate (likes/views)
- Click-through rate
- Audience retention
- Traffic sources

## 🤝 Contributing

This is a demonstration project showcasing a complete streaming platform implementation.

## 📄 License

MIT License - feel free to use this as a template for your own projects.
