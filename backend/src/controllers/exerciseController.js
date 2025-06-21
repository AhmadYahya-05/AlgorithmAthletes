import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeExerciseForm = async (req, res) => {
  try {
    const { exercise } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ 
        success: false, 
        message: 'No video file provided' 
      });
    }

    if (!exercise) {
      return res.status(400).json({ 
        success: false, 
        message: 'Exercise type is required' 
      });
    }

    // Read the video file
    const videoBuffer = fs.readFileSync(videoFile.path);
    const videoBase64 = videoBuffer.toString('base64');

    // Create the prompt for Gemini
    const prompt = `Analyze this exercise video showing a ${exercise}. Please provide detailed feedback on the exercise form, including:

1. **Overall Form Assessment**: Rate the form from 1-10 and provide a brief summary
2. **Key Observations**: What you notice about the person's form
3. **Strengths**: What they're doing well
4. **Areas for Improvement**: Specific suggestions for better form
5. **Safety Concerns**: Any potential injury risks
6. **Specific Tips**: Actionable advice for improvement

Please be constructive and encouraging in your feedback. Focus on form, technique, and safety.`;

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the content parts
    const imagePart = {
      inlineData: {
        data: videoBase64,
        mimeType: videoFile.mimetype
      }
    };

    const textPart = {
      text: prompt
    };

    // Generate content
    const result = await model.generateContent([textPart, imagePart]);
    const response = await result.response;
    const analysis = response.text();

    // Clean up the uploaded file
    fs.unlinkSync(videoFile.path);

    res.json({
      success: true,
      analysis: analysis,
      exercise: exercise
    });

  } catch (error) {
    console.error('Error analyzing exercise form:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to analyze exercise form. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 