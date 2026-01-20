# Frolic Event Management System

A comprehensive full-stack event management platform built with React, Node.js, Express, and MongoDB. This system allows students, coordinators, and administrators to manage events, registrations, and competitions effectively.

## 🚀 Features

### For Students
- Browse and register for events
- View personal event registrations
- Profile management
- Payment integration for event fees
- Real-time event updates

### For Coordinators
- Manage assigned events
- View participant registrations
- Update event details
- Handle group formations

### For Administrators
- Complete user management (CRUD operations)
- Event creation and management
- Institute and department management
- Coordinator assignments
- Activity logging and reporting
- Gallery management
- Payment monitoring
- Result management

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **CSS3** with modern animations
- **Responsive design**

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for image uploads
- **Multer** for file handling

### Key Libraries
- **React Hook Form** for form management
- **React Toastify** for notifications
- **Date-fns** for date handling
- **ExcelJS** for report generation

## 📋 Prerequisites

Before running this application, make sure you have:
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- GitHub account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/frolic-event-management.git
   cd frolic-event-management
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Copy the example environment file:
   ```bash
   cd ../server
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/frolic
   JWT_SECRET=your_secure_jwt_secret_here
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASS=secure_admin_password
   ADMIN_PHONE=9999999999
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## 🚀 Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

3. **Create admin user** (first time setup)
   ```bash
   cd server
   npm run create-admin
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Default Admin Credentials

- Email: admin@gmail.com
- Password: admin@123

## 🗂️ Project Structure

```
frolic-event-management/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── context/       # React context
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── package.json
├── .gitignore            # Git ignore rules
├── .env.example         # Environment variables template
└── README.md            # Project documentation
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/events` - Get all events
- `GET /api/admin/institutes` - Get all institutes
- `POST /api/admin/institutes` - Create institute
- `PUT /api/admin/institutes/:id` - Update institute
- `DELETE /api/admin/institutes/:id` - Delete institute

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **FrolicEvent-Developer** - *Initial work*

## 🙏 Acknowledgments

- React community for excellent documentation
- MongoDB Atlas for database hosting
- Cloudinary for image hosting
- All contributors and testers

## 📞 Support

For support, email frolic.event.dev@example.com or create an issue in the repository.

---

**Note:** This is a college project developed for educational purposes. Make sure to update the environment variables with your own credentials before deploying.