import React, { useState, useRef } from "react";
import ChatArea from "./ChatArea";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]); // Store chat messages
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Add the recorded audio as a message
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "user", content: audioUrl, isAudio: true },
        ]);

        await uploadAudio(audioBlob); // Upload audio to API
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      const response = await fetch(
        "https://voiceagent-0wtp.onrender.com/process_audio/",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("API Response:", result);

        // API response
        const transcription = result.transcription;
        const botTextResponse = result.response;
        const botAudioUrl = result.audioFile; // Construct audio URL

        // Add transcription text
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "user",
            content: `Transcription: ${transcription}`,
            isAudio: false,
          },
        ]);

        // Add API's audio response
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: botAudioUrl, isAudio: true },
        ]);

        // Add API's text response
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: botTextResponse, isAudio: false },
        ]);
      } else {
        console.error("Audio upload failed:", result);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div className="recorder-container">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`record-btn ${isRecording ? "stop" : "start"}`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {messages.length > 0 && <ChatArea messages={messages} />}
    </div>
  );
};

export default AudioRecorder;
