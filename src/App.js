import "./App.css";
import DocumentUploader from "./components/DocumentUploader";
import AudioRecorder from "./components/RecordAudio";

function App() {
  return (
    <div className="chat-container">
      {/*Left Sidebar*/}
      <div className="sidebar">
        <DocumentUploader />
      </div>

      {/*Right Chat Area*/}
      <div className="chat-area">
        <AudioRecorder />
      </div>
    </div>
  );
}

export default App;
