import React, { useState } from "react";

function DocumentUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle File selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload file to API
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file First!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "https://voiceagent-0wtp.onrender.com/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      const res = await response.json();
      alert(res.message);
    } catch (error) {
      alert("Error Uploading File!");
    }

    setUploading(false);
    setSelectedFile(null);
  };

  return (
    <div className="uploader-container">
      {uploading && <div className="overlay">Processing...</div>}
      <div className="uploader">
        <h2>Upload Document Here</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

export default DocumentUploader;
