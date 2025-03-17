import React, { useState } from "react";
import ChatArea from "./ChatArea";
import { useReactMediaRecorder } from "react-media-recorder";

const AudioRecorder = () => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [isRecording, setIsRecording] = useState(false);

  // Using react-media-recorder for audio recording
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/wav"},
  });

  // Start recording
  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording();
  };

  // Stop recording and upload
  const handleStopRecording = async () => {
    stopRecording();
    setIsRecording(false);

    if(mediaBlobUrl) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", content: mediaBlobUrl, isAudio: true },
      ]);

      // Convert audio URL to Blob and upload
      const response = await fetch(mediaBlobUrl);
      const audioBlob = await response.blob();
      await uploadAudio(audioBlob);
    }
  }

  // Upload the recorded audio to the API
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
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`record-btn ${isRecording ? "stop" : "start"}`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {messages.length > 0 && <ChatArea messages={messages} />}
    </div>
  );
};

export default AudioRecorder;
