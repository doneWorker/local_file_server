import React, { useState } from "react";


const FileUploader = ({ onFileSelect }) => {
  const [fileText, setFileText] = useState("Not Selected");

  const onFileChange = (e) => {
      const file = e.target.files[0];
      setFileText(file.name);
      onFileSelect(file);
  };

  return (
    <div className="file has-name is-fullwidth">
      <label className="file-label">
        <input
          className="file-input"
          type="file"
          name="resume"
          onChange={e => onFileChange(e)}
        />
        <span className="file-cta">
          <span className="file-icon">
            <i className="fas fa-upload"></i>
          </span>
          <span className="file-label">Choose a file…</span>
        </span>
        <span className="file-name">{fileText}</span>
      </label>
    </div>
  );
};

export default FileUploader;
