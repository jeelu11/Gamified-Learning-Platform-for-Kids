# 🎮 EduPlay - Gamified Learning Platform for Kids

A comprehensive web-based learning platform that transforms education into engaging game-based adventures for children aged 6-12. Built with React.js, Node.js, MongoDB, Firebase, and Tailwind CSS.

## 🌟 Features

### 🎓 Multi-Role Ecosystem
- **Students**: Interactive game-based learning with personalized avatars and rewards
- **Parents**: Real-time progress monitoring, performance analytics, and parental controls
- **Teachers**: Classroom management tools and student performance insights
- **Admin**: Platform-wide user management and content moderation

### 🎮 Learning Games
- **Math Games**: Arithmetic puzzles, multiplication challenges, geometry quests
- **Science Games**: Virtual experiments, animal classification, space exploration
- **Language Games**: Vocabulary building, grammar adventures, reading comprehension
- **Creative Games**: Pattern recognition, memory challenges, artistic expression

### 🏆 Gamification Engine
- Points, badges, and achievement system
- Leaderboards and social features
- Progress tracking and learning analytics
- Personalized difficulty adjustments

### 🔐 Security & Privacy
- Firebase Authentication with Google SSO
- COPPA compliance for children under 13
- Secure data encryption and privacy controls
- Role-based access control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (if running locally)

### Using Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd Gamified-Learning-Platform-for-Kids
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

### Local Development

1. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

2. **Start MongoDB**
```bash
mongod
```

3. **Set environment variables**
```bash
# Backend
cp .env.example .env
# Edit .env with your configuration

# Frontend
cp .env.example .env.local
# Edit .env.local with your Firebase configuration
```

4. **Start the development servers**
```bash
# Backend
npm run dev

# Frontend (in another terminal)
cd ../frontend
npm start
```

## 📁 Project Structure

```
Gamified-Learning-Platform-for-Kids/
├── frontend/                 # React.js Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── games/       # Game components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── common/      # Shared components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── config/          # Firebase configuration
│   │   └── contexts/        # React contexts
│   ├── public/             # Static files
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  # Node.js Backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── models/          # MongoDB models
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── config/          # App configuration
│   │   └── utils/           # Utility functions
│   ├── scripts/            # Database scripts
│   ├── Dockerfile
│   └── healthcheck.js
├── shared/                   # Shared types and utilities
│   ├── types/             # TypeScript definitions
│   └── constants/         # Shared constants
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/eduplay

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Frontend (.env.local)
```bash
# Firebase
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id

# API
REACT_APP_API_URL=http://localhost:3001
```

## 🎮 Game Development

### Adding New Games

1. **Create game data structure** in `frontend/src/pages/GamesPage.tsx`
2. **Create game component** in `frontend/src/components/games/`
3. **Add game logic** with questions, scoring, and feedback
4. **Update game container** to handle new game types

### Game Data Structure
```typescript
{
  title: string;
  description: string;
  subject: 'math' | 'science' | 'language' | 'creativity';
  category: string;
  difficulty: number; // 1-10
  ageRange: { min: number; max: number; };
  gameType: 'quiz' | 'puzzle' | 'simulation' | 'creative';
  content: {
    instructions: string;
    questions: Question[];
  };
}
```

## 🔐 Authentication

### Firebase Integration
- **Email/Password**: Traditional authentication
- **Google SSO**: One-click Google sign-in
- **Social Providers**: Extendable for other providers
- **Session Management**: Secure token handling

### User Roles
- **Student**: Play games, view progress, customize avatar
- **Parent**: Monitor children, set controls, view reports
- **Teacher**: Manage classrooms, assign activities, view analytics
- **Admin**: Platform management, user management, content moderation

## 📊 Database Schema

### MongoDB Collections
- **users**: User accounts and profiles
- **games**: Game definitions and content
- **progress**: User progress and session data
- **achievements**: Achievement definitions
- **userachievements**: User earned achievements
- **classrooms**: Teacher classroom management
- **analytics**: Platform usage analytics

### Firebase Collections
- **users**: Real-time user data
- **progress**: Live progress updates
- **leaderboards**: Real-time rankings
- **notifications**: Achievement notifications

## 🛡️ Security Features

- **COPPA Compliance**: Child data protection
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive input sanitization
- **Data Encryption**: Encrypted data storage and transmission
- **Role-Based Access**: Granular permission system

## 📱 Responsive Design

- **Mobile-First**: Optimized for tablets and phones
- **Touch-Friendly**: Large tap targets for children
- **Kid-Friendly UI**: Bright colors and engaging animations
- **Accessibility**: WCAG 2.1 AA compliance

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Considerations
- **Environment Variables**: Never commit sensitive data
- **SSL Certificates**: Use HTTPS in production
- **Database Backups**: Regular backup schedule
- **Monitoring**: Application performance monitoring
- **Scaling**: Horizontal scaling with load balancers

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

### Backend Tests
```bash
cd backend
npm test
npm run test:ci
```

### End-to-End Tests
```bash
npm run test:e2e
```

## 📈 Performance Optimization

### Frontend
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Compressed and progressive loading
- **Caching**: Browser and CDN caching strategies
- **Bundle Size**: Optimized for fast loading

### Backend
- **Database Indexing**: Optimized query performance
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: Database connection management
- **Compression**: Gzip compression for responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@eduplay.com
- **Documentation**: [Wiki](https://github.com/your-repo/eduplay/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/eduplay/issues)

## 🎉 Acknowledgments

- React.js team for the amazing framework
- Firebase for authentication and real-time services
- MongoDB for the flexible database
- Tailwind CSS for the excellent styling framework
- All the beta testers and early users who helped shape the platform