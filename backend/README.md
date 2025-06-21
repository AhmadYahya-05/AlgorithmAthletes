# Algorithm Athletes Backend

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/algorithm-athletes

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your `.env` file as `GEMINI_API_KEY`

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm run dev
```

## Features

### Exercise Form Analysis

The backend includes a new endpoint for analyzing exercise form using Google's Gemini AI:

- **Endpoint**: `POST /api/exercise/analyze`
- **Authentication**: Required (JWT token)
- **File Upload**: Accepts video files (MP4, WebM, AVI, MOV, QuickTime)
- **File Size Limit**: 50MB
- **Supported Exercises**: Squat, Deadlift, Bench Press, Overhead Press, Pull-up, Push-up, Lunge, Plank, Burpee, Mountain Climber

### Request Format

```javascript
const formData = new FormData();
formData.append('video', videoFile);
formData.append('exercise', 'Squat');

fetch('/api/exercise/analyze', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

### Response Format

```json
{
  "success": true,
  "analysis": "Detailed AI analysis of the exercise form...",
  "exercise": "Squat"
}
```

## File Structure

```
Backend/
├── src/
│   ├── controllers/
│   │   └── exerciseController.js    # Exercise form analysis logic
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   ├── validation.js            # Input validation
│   │   └── upload.js                # File upload handling
│   ├── models/
│   │   └── User.js                  # User model
│   └── routes/
│       ├── auth.js                  # Authentication routes
│       ├── user.js                  # User routes
│       └── exercise.js              # Exercise analysis routes
├── uploads/                         # Temporary video storage
├── server.js                        # Main server file
└── package.json
``` 