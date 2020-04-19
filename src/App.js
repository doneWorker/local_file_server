import React, { useState, useEffect } from "react";
import "./css/bulma.min.css";
import "./css/general.css";
import Navbar from "./components/Navbar";
import FileUploader from "./components/FileUploader";
import FileList from "./components/FileList";
import TopHeader from "./components/TopHeader";
import Modal from "./components/Modal";
import ProgressBar from "./components/ProgressBar";

const HOST = window.location.hostname;
const uploadURL = `http://${HOST}:8080/upload`;

// TODO: sync list via webSockets
const loadList = () => {
  const params = {
    method: "GET",
    mode: "cors",
    credentials: "same-origin"
  };

  return fetch(`http://${HOST}:8080/filelist`, params);
};

const startTrackTabStatus = () => {
  window.isActiveTab = true;

  window.onfocus = () => {
    window.isActiveTab = true;
  };
  window.onblur = () => {
    window.isActiveTab = false;
  };
};

const getTabStatus = () => window.isActiveTab;

function App() {
  let [selectedFile, setSelectedFile] = useState(null);
  let [fileList, setFileList] = useState([]);
  let [uploading, setUploading] = useState(false);
  let [progress, setProgress] = useState(0);

  useEffect(() => {
    startTrackTabStatus();

    // If tab is open then check for updates
    const fileWatcher = setInterval(() => {
      if (!getTabStatus() || uploading) return;
      loadList()
        .then(response => response.json())
        .then(json => setFileList(json.list));
    }, 2000);

    return () => {
      clearInterval(fileWatcher);
    };
  });

  const saveFile = () => {
    let formData = new FormData(),
      xhr = new XMLHttpRequest();
    formData.append("file", selectedFile, selectedFile.name);
    xhr.open("POST", uploadURL, true);
    setUploading(true);
    xhr.upload.addEventListener("progress", function(e) {
      setProgress((e.loaded / e.total) * 100);
    });

    xhr.addEventListener("load", function(e) {
      setUploading(false);
    });

    xhr.send(formData);
  };

  return (
    <div className="App container is-fluid">
      {uploading && (
        <Modal>
          <ProgressBar percent={progress} />
        </Modal>
      )}
      <TopHeader text={HOST} />
      <Navbar />
      <div className="container">
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
            <h2 className="title is-2">Please upload your file</h2>
            <FileUploader onFileSelect={setSelectedFile} />
            <button className="button upload-button" onClick={() => saveFile()}>
              Upload File
            </button>
          </div>
        </div>
        <hr />
        <FileList files={fileList} path={`http://${HOST}:8080/shared`} />
      </div>
    </div>
  );
}

export default App;
