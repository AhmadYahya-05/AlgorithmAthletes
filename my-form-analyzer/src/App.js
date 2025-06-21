import React, { useRef, useState, useEffect, useCallback } from 'react';

// Main App component
const App = () => {
    // Refs for video and canvas elements
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // State variables
    const [feedback, setFeedback] = useState('Stand in front of the webcam and click "Start Analysis" to begin!'); // Stores AI feedback
    const [isLoading, setIsLoading] = useState(false); // Indicates if API call is in progress
    const [isAnalyzing, setIsAnalyzing] = useState(false); // Indicates if analysis loop is active
    const [intervalId, setIntervalId] = useState(null); // Stores the ID of the setInterval timer
    const [mediaStream, setMediaStream] = useState(null); // Stores the MediaStream object from webcam

    // Function to safely stop media stream
    const safelyStopMediaStream = useCallback((stream) => {
        if (stream && stream.getTracks) {
            try {
                stream.getTracks().forEach(track => {
                    if (track.readyState !== 'ended') {
                        track.stop();
                    }
                });
            } catch (error) {
                console.warn('Error stopping media tracks:', error);
            }
        }
    }, []);

    // Function to send a captured frame to the Gemini API
    const sendFrameForAnalysis = useCallback(async () => {
        // Ensure refs are available and not already loading
        if (!videoRef.current || !canvasRef.current || isLoading) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Ensure video is playing and dimensions are valid
        if (video.readyState !== video.HAVE_ENOUGH_DATA || video.videoWidth === 0 || video.videoHeight === 0) {
            setFeedback("Waiting for video stream to be ready...");
            return;
        }

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas content to base64 image data
        const base64ImageData = canvas.toDataURL('image/png').split(',')[1]; // Remove 'data:image/png;base64,' prefix

        setIsLoading(true);
        setFeedback("Analyzing your form...");

        try {
            // Define the prompt for the AI
            const prompt = "Analyze the exercise form in this image. Focus on lat pulldown form. Provide specific feedback on what looks good and what could be improved for proper technique and safety. If it's not a lat pulldown, describe what it looks like.";

            // Construct the payload for the Gemini API call
            const chatHistory = [];
            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: "image/png",
                                    data: base64ImageData
                                }
                            }
                        ]
                    }
                ],
            };

            // For local development, you will need to provide your own Gemini API Key here.
            // Replace "YOUR_GEMINI_API_KEY" with your actual key.
            // DO NOT share your API key publicly or commit it to version control.
            // For production, use environment variables.
            const apiKey = "AIzaSyCVQ-tbAvSmcSdoz4q12xVg2CREHPwE9C8"; // <-- IMPORTANT: Replace with your actual key for local use
            // Updated model to gemini-2.0-flash-live-001 as requested
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-live-001:generateContent?key=${apiKey}`;

            // Make the fetch call to the Gemini API
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Check if the response contains valid content
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setFeedback(text); // Update feedback with AI's response
            } else {
                setFeedback("Could not get a clear analysis from the AI. Please try adjusting your position or lighting.");
                console.warn("Unexpected API response structure:", result);
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setFeedback("Error during analysis. Please check your network connection, your API key, or try again later.");
        } finally {
            setIsLoading(false); // Reset loading state
        }
    }, [isLoading]); // Dependency on isLoading to prevent multiple rapid calls

    // Function to stop the webcam and analysis
    const stopAnalysis = useCallback(() => {
        // Clear interval if it exists
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null); // Clear the state
        }
        
        // Stop media tracks if stream exists
        if (mediaStream) {
            safelyStopMediaStream(mediaStream);
            setMediaStream(null); // Clear the state
        }
        
        // Detach stream from video element if ref is current
        if (videoRef.current) {
            try {
                videoRef.current.srcObject = null;
            } catch (error) {
                console.warn('Error detaching video stream:', error);
            }
        }

        setIsAnalyzing(false);
        setFeedback("Analysis stopped. Click 'Start Analysis' to restart.");
        setIsLoading(false); // Ensure loading state is false if stopped during a call
    }, [intervalId, mediaStream, safelyStopMediaStream]);

    // Function to start the webcam and analysis
    const startAnalysis = useCallback(async () => {
        // If already analyzing, stop first
        if (isAnalyzing) {
            stopAnalysis();
            return;
        }

        setFeedback("Requesting webcam access...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            
            setMediaStream(stream); // Set stream to state immediately
            
            if (videoRef.current) { // Ensure videoRef.current is not null before assigning srcObject
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setFeedback("Webcam active. Starting analysis in a moment...");
            setIsAnalyzing(true);

            // Set up an interval to capture and send frames every 5 seconds
            const id = setInterval(sendFrameForAnalysis, 5000);
            setIntervalId(id);
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setFeedback("Failed to access webcam. Please ensure you have granted camera permissions.");
            setIsAnalyzing(false);
        }
    }, [isAnalyzing, stopAnalysis, sendFrameForAnalysis]);

    // Main effect for cleanup on component unmount
    useEffect(() => {
        // This return function runs when the component unmounts
        return () => {
            // Safely clear the interval if it's active
            if (intervalId) {
                clearInterval(intervalId);
            }
            
            // Safely stop the media stream tracks if a stream exists
            if (mediaStream) {
                safelyStopMediaStream(mediaStream);
            }
            
            // Safely detach the stream from the video element
            if (videoRef.current) {
                try {
                    videoRef.current.srcObject = null;
                } catch (error) {
                    console.warn('Error detaching video stream during cleanup:', error);
                }
            }
        };
    }, []); // Empty dependency array - only run on unmount

    // Effect to handle video element error events
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleVideoError = (event) => {
            console.warn('Video error occurred:', event);
            // Don't show error to user unless it's a persistent issue
        };

        const handleVideoAbort = (event) => {
            console.warn('Video loading aborted:', event);
            // This is expected when stopping analysis, so we don't need to show an error
        };

        video.addEventListener('error', handleVideoError);
        video.addEventListener('abort', handleVideoAbort);

        return () => {
            video.removeEventListener('error', handleVideoError);
            video.removeEventListener('abort', handleVideoAbort);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-4 sm:p-8 flex flex-col items-center justify-center font-sans rounded-lg shadow-xl">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                .glow-button {
                    transition: all 0.3s ease;
                    box-shadow: 0 0 5px rgba(168, 85, 247, 0.5), 0 0 15px rgba(168, 85, 247, 0.3);
                }
                .glow-button:hover {
                    box-shadow: 0 0 10px rgba(168, 85, 247, 0.7), 0 0 25px rgba(168, 85, 247, 0.5);
                }
                `}
            </style>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center drop-shadow-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-orange-300">
                    AI Form Coach
                </span>
            </h1>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center gap-6 mb-8 border border-purple-600">
                <div className="flex-1 w-full flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-200">Your Webcam Feed</h2>
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-purple-500 shadow-lg">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline></video>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden"></canvas> {/* Hidden canvas for capturing frames */}
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full justify-center">
                        {!isAnalyzing ? (
                            <button
                                onClick={startAnalysis}
                                className="glow-button bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg"
                            >
                                Start Analysis
                            </button>
                        ) : (
                            <button
                                onClick={stopAnalysis}
                                className="glow-button bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg"
                            >
                                Stop Analysis
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 w-full flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-200">AI Feedback</h2>
                    <div className="bg-white bg-opacity-15 p-6 rounded-lg w-full min-h-[200px] flex items-center justify-center shadow-inner border border-purple-500 overflow-y-auto max-h-[300px]">
                        <p className="text-lg text-gray-100 leading-relaxed text-center">
                            {feedback}
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-md text-gray-300 mt-4 text-center max-w-3xl">
                This application captures periodic snapshots from your webcam to provide feedback on your exercise form using Google's Gemini AI.
                Please ensure good lighting and clear visibility for best results.
                Remember, this is an AI-generated analysis and should not replace professional coaching.
            </p>
        </div>
    );
};

export default App;
