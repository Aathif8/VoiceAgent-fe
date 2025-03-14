import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(" ");

  return (
    <div className="chat-container">
      {/*Left Sidebar*/}
      <div className="sidebar">
        <h2>Contacts</h2>
        <ul>
          <li>User 1</li>
          <li>User 2</li>
          <li>User 3</li>
        </ul>
      </div>

      {/*Right Chat Area*/}
      <div className="chat-area">
        {/*Chat Header*/}
        <div className="chat-header">Chat With Our VoiceAgent</div>

        {/*Messages*/}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>

        {/*Input Box*/}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={""}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
