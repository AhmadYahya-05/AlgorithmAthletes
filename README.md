# Algorithm Athletes

A comprehensive platform for algorithm practice with AI-powered exercise form analysis.

## Features

- **User Authentication**: Secure login and registration system
- **Algorithm Practice**: Practice coding problems and track progress
- **Exercise Form Analysis**: AI-powered feedback on exercise form using Google Gemini
- **MediaPipe Analysis**: Advanced pose detection for precise biomechanical analysis
- **Progress Tracking**: Monitor your learning journey
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## Exercise Form Analysis

The platform includes two advanced exercise form analysis features:

### 1. Google Gemini AI Analysis
- **Webcam Recording**: Record your exercises directly in the browser
- **Video Upload**: Upload existing exercise videos
- **AI Analysis**: Get detailed feedback on form, technique, and safety
- **Multiple Exercises**: Support for 10+ exercise types
- **Real-time Feedback**: Instant analysis and recommendations

### 2. MediaPipe Pose Detection Analysis
- **Advanced Pose Detection**: Real-time body landmark tracking
- **Biomechanical Analysis**: Precise angle and alignment measurements
- **Frame-by-Frame Analysis**: Detailed analysis of each movement
- **Quantitative Scoring**: Numerical scores for different form aspects
- **Technical Feedback**: Specific biomechanical corrections

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

**MediaPipe Analysis Currently Supports**: Squat, Push-up, Plank

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **MediaPipe** - Advanced pose detection

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

#### Google Gemini Analysis
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

#### MediaPipe Analysis
1. **Navigate to MediaPipe Analysis**
   - Click on "MediaPipe Analysis" from the home page
   - Or visit `/mediapipe-exercise-form` directly

2. **Select Exercise Type**
   - Choose from Squat, Push-up, or Plank

3. **Record or Upload Video**
   - Use the webcam to record your exercise
   - Or upload an existing video file

4. **Get Biomechanical Analysis**
   - Click "Analyze with MediaPipe"
   - Receive frame-by-frame analysis with precise measurements

### Features Comparison

| Feature | Gemini AI | MediaPipe |
|---------|-----------|-----------|
| **Analysis Type** | AI-powered narrative feedback | Biomechanical measurements |
| **Supported Exercises** | 10+ exercises | 3 exercises (expandable) |
| **Feedback Style** | Descriptive text | Quantitative scores + details |
| **Real-time** | No | Yes (pose overlay) |
| **Precision** | General form assessment | Precise angle measurements |
| **Processing** | Cloud-based | Client-side |

### MediaPipe Analysis Details

The MediaPipe analysis provides:

- **Knee Alignment**: Measures knee position relative to ankles
- **Squat Depth**: Analyzes how deep the squat goes
- **Back Angle**: Calculates proper back positioning
- **Body Alignment**: Ensures straight body line
- **Elbow Angle**: Measures proper elbow positioning
- **Core Engagement**: Analyzes hip position relative to shoulders

Each analysis provides:
- **Score (1-10)**: Numerical assessment of form quality
- **Feedback**: Specific improvement suggestions
- **Details**: Precise measurements and percentages

## API Endpoints

### Exercise Analysis
- `POST /api/exercise/analyze` - Analyze exercise form with video (Gemini)

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
