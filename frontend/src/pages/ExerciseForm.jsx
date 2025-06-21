import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, Square, Play, Download, Upload } from 'lucide-react';

const ExerciseForm = ({ user, onLogout }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

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
      setError('');
    } else {
      setError('Please select a valid video file.');
    }
  };

  const analyzeForm = async () => {
    if (!recordedBlob || !selectedExercise) {
      setError('Please record a video and select an exercise type.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('video', recordedBlob);
      formData.append('exercise', selectedExercise);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/exercise/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze exercise form');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to analyze exercise form. Please try again.');
      console.error('Error analyzing form:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadVideo = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exercise-recording-${Date.now()}.webm`;
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
              <h1 className="text-xl font-semibold text-gray-900">Exercise Form Analysis</h1>
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
            </div>

            {/* Video Preview */}
            <div className="mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 bg-gray-100 rounded-lg object-cover"
              />
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
              onClick={analyzeForm}
              disabled={!recordedBlob || !selectedExercise || isAnalyzing}
              className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Analyze Exercise Form
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h2>
            
            {analysis ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-900 mb-2">Exercise: {selectedExercise}</h3>
                  <div className="prose prose-sm text-blue-800">
                    {analysis.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Video className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">
                  Record or upload a video and select an exercise to get AI-powered form analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseForm;
