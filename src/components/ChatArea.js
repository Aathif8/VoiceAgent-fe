import React, { useState, useEffect } from "react";

const ChatArea = ({ messages }) => {
  const [audioSources, setAudioSources] = useState({});
  
  useEffect(() => {
    const fetchAudio = async () => {
      const newAudioSources = {};

      const urlsToFetch = messages.filter(
        (msg) =>
          msg.isAudio &&
          msg.content.startsWith("http") &&
          !audioSources[msg.content] // Ensures already fetched URLs are not fetched again
      );

      if (urlsToFetch.length === 0) return; // Prevent unnecessary fetch calls

      await Promise.all(
        urlsToFetch.map(async (msg) => {
          try {
            const response = await fetch(msg.content);
            newAudioSources[msg.content] = response.url;
          } catch (error) {
            console.error("Audio fetch error", error);
          }
        })
      );

      setAudioSources((prev) => ({ ...prev, ...newAudioSources }));
    };

    fetchAudio();
  }, [messages, audioSources]); // Include audioSources to prevent unnecessary re-fetches

  return (
    <div className="chat-area">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.type}`}>
          {msg.isAudio ? (
            <audio controls>
              <source
                src={audioSources[msg.content] || msg.content}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatArea;
