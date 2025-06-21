# Algorithm Athletes

A comprehensive platform for algorithm practice with AI-powered exercise form analysis.

## Features

- **User Authentication**: Secure login and registration system
- **Algorithm Practice**: Practice coding problems and track progress
- **Exercise Form Analysis**: AI-powered feedback on exercise form using Google Gemini
- **Progress Tracking**: Monitor your learning journey
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## Exercise Form Analysis

The platform now includes an advanced exercise form analysis feature powered by Google's Gemini AI:

- **Webcam Recording**: Record your exercises directly in the browser
- **Video Upload**: Upload existing exercise videos
- **AI Analysis**: Get detailed feedback on form, technique, and safety
- **Multiple Exercises**: Support for 10+ exercise types
- **Real-time Feedback**: Instant analysis and recommendations

### Supported Exercises

- Squat
- Deadlift
- Bench Press
- Overhead Press
- Pull-up
- Push-up
- Lunge
- Plank
- Burpee
- Mountain Climber

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Multer** - File upload handling
- **Google Gemini AI** - AI-powered exercise analysis

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AlgorithmAthletes
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the Backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/algorithm-athletes
   JWT_SECRET=your_jwt_secret_here
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Get Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd Backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Usage

### Exercise Form Analysis

1. **Navigate to Exercise Form Analysis**
   - Click on "Exercise Form Analysis" from the home page
   - Or visit `/exercise-form` directly

2. **Select Exercise Type**
   - Choose from the dropdown menu of supported exercises

3. **Record or Upload Video**
   - Use the webcam to record your exercise
   - Or upload an existing video file

4. **Get AI Analysis**
   - Click "Analyze Exercise Form"
   - Receive detailed feedback on your form

### Features

- **Real-time Recording**: Record exercises with your webcam
- **File Upload**: Upload existing exercise videos
- **AI Analysis**: Get comprehensive form feedback
- **Download**: Save your recordings locally
- **Multiple Formats**: Support for various video formats

## API Endpoints

### Exercise Analysis
- `POST /api/exercise/analyze` - Analyze exercise form with video

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
