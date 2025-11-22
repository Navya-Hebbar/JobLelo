import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react'; // Ensure you installed lucide-react

const VoiceRecorder = ({ onRecordingStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = []; // Reset chunks
        onRecordingStop(blob); // Send blob to parent
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-2 rounded-full transition-all ${
        isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      title={isRecording ? "Stop Recording" : "Start Voice Input"}
    >
      {isRecording ? <Square size={20} /> : <Mic size={20} />}
    </button>
  );
};

export default VoiceRecorder;