import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, Square, Play, Download, Upload, Activity } from 'lucide-react';
import { Pose } from '@mediapipe/pose';
import { DrawingUtils } from '@mediapipe/drawing_utils';
import { analyzeExerciseForm, initializePose } from '../utils/mediaPipeAnalysis.js';

const MediaPipeExerciseForm = ({ user, onLogout }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [poseData, setPoseData] = useState([]);
  const [showPoseOverlay, setShowPoseOverlay] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const poseRef = useRef(null);
  const drawingUtilsRef = useRef(null);

  const exercises = [
    'Squat',
    'Deadlift',
    'Bench Press',
    'Overhead Press',
    'Pull-up',
    'Push-up',
    'Lunge',
    'Plank',
    'Burpee',
    'Mountain Climber'
  ];

  useEffect(() => {
    // Initialize MediaPipe Pose
    poseRef.current = initializePose();

    poseRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    poseRef.current.onResults(onPoseResults);

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, []);

  const onPoseResults = (results) => {
    if (results.poseLandmarks) {
      setPoseData(prev => [...prev, results.poseLandmarks]);
      
      if (showPoseOverlay && canvasRef.current) {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        drawingUtilsRef.current = new DrawingUtils(canvasCtx);
        drawingUtilsRef.current.drawConnectors(
          results.poseLandmarks, Pose.POSE_CONNECTIONS,
          { color: '#00FF00', lineWidth: 2 });
        drawingUtilsRef.current.drawLandmarks(
          results.poseLandmarks,
          { color: '#FF0000', lineWidth: 1, radius: 3 });
        
        canvasCtx.restore();
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: false 
      });
      
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      setPoseData([]);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      console.error('Error accessing camera:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setRecordedBlob(file);
      setVideoUrl(URL.createObjectURL(file));
      setPoseData([]);
      setError('');
    } else {
      setError('Please select a valid video file.');
    }
  };

  const analyzeFormWithMediaPipe = async () => {
    if (!recordedBlob || !selectedExercise) {
      setError('Please record a video and select an exercise type.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Create a video element to process the recorded video
      const video = document.createElement('video');
      video.src = videoUrl;
      video.muted = true;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      const poseDataArray = [];
      let frameCount = 0;
      const maxFrames = 100; // Limit analysis to first 100 frames
      
      // Process video frames
      const processFrame = () => {
        if (video.paused || video.ended || frameCount >= maxFrames) {
          // Analysis complete
          const analysis = analyzeExerciseForm(poseDataArray, selectedExercise);
          setAnalysis(analysis);
          setIsAnalyzing(false);
          return;
        }

        poseRef.current.send({ image: video });
        frameCount++;
        requestAnimationFrame(processFrame);
      };

      processFrame();

    } catch (err) {
      setError('Failed to analyze exercise form. Please try again.');
      console.error('Error analyzing form:', err);
      setIsAnalyzing(false);
    }
  };

  const downloadVideo = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mediapipe-exercise-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">MediaPipe Exercise Analysis</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={onLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Recording Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Record Your Exercise</h2>
            
            {/* Exercise Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exercise Type
              </label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose an exercise...</option>
                {exercises.map((exercise) => (
                  <option key={exercise} value={exercise}>
                    {exercise}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                MediaPipe analysis currently supports: Squat, Push-up, Plank
              </p>
            </div>

            {/* Video Preview */}
            <div className="mb-6 relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 bg-gray-100 rounded-lg object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-64 pointer-events-none"
                style={{ display: showPoseOverlay ? 'block' : 'none' }}
              />
            </div>

            {/* Pose Overlay Toggle */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showPoseOverlay}
                  onChange={(e) => setShowPoseOverlay(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Show pose overlay</span>
              </label>
            </div>

            {/* Recording Controls */}
            <div className="flex flex-wrap gap-3 mb-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </button>
              )}

              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {recordedBlob && (
                <button
                  onClick={downloadVideo}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              )}
            </div>

            {/* Recorded Video Preview */}
            {videoUrl && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recorded Video:</h3>
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-48 bg-gray-100 rounded-lg object-cover"
                />
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={analyzeFormWithMediaPipe}
              disabled={!recordedBlob || !selectedExercise || isAnalyzing}
              className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing with MediaPipe...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Analyze with MediaPipe
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Analysis Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">MediaPipe Analysis Results</h2>
            
            {analysis ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Exercise: {analysis.exercise}
                  </h3>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      Overall Score: {analysis.overallScore}/10
                    </span>
                  </div>
                  <p className="text-blue-800 mb-3">{analysis.feedback}</p>
                  
                  {analysis.details && analysis.details.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-blue-900 mb-2">Detailed Analysis:</h4>
                      {analysis.details.slice(0, 5).map((frame, index) => (
                        <div key={index} className="mb-2 p-2 bg-blue-100 rounded">
                          <p className="text-sm font-medium text-blue-800">
                            Frame {frame.frame + 1} (Score: {frame.score}/10):
                          </p>
                          {frame.results.map((result, resultIndex) => (
                            <div key={resultIndex} className="ml-2 text-sm text-blue-700">
                              • {result.name}: {result.score}/10 - {result.feedback}
                              <br />
                              <span className="text-xs text-blue-600 ml-4">{result.details}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Activity className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">
                  Record or upload a video and select an exercise to get MediaPipe-powered form analysis.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Currently supports: Squat, Push-up, Plank
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPipeExerciseForm;
