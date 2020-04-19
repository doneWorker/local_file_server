import React, { useState } from "react";

// Icons
const ICONS = {
  doc: "fas fa-book",
  video: "far fa-play-circle",
  photo: "fas fa-images",
  music: "fas fa-music",
  archive: "fas fa-file-archive",
  file: "fas fa-file",
  other: "fas fa-file"
};

const FORMAT_TO_ICON = {
  png: ICONS["photo"],
  gif: ICONS["photo"],
  jpg: ICONS["photo"],
  mp4: ICONS["video"],
  avi: ICONS["video"],
  mkv: ICONS["video"],
  zip: ICONS["archive"],
  rar: ICONS["archive"],
  pdf: ICONS["doc"],
  mp3: ICONS["music"],
  other: ICONS["other"]
};

// Functions
const getFileExtension = name => name.substr(name.lastIndexOf(".") + 1);

const getDefaultIcon = () => FORMAT_TO_ICON["other"];

const GetFileSize = file => {
  let bytes = file.stat.size;
  let mbyte = 1024 * 1024;
  let gbyte = 1024 * 1024 * 1024;

  if (bytes >= gbyte) {
    return `${Math.floor(bytes / gbyte)} gb`;
  } else if (bytes >= mbyte) {
    return `${Math.floor(bytes / mbyte)} mb`;
  } else {
    return `${bytes} bytes`;
  }
};

const highlight = (t, m) =>
  t.replace(new RegExp(`${m}`, "gi"), `<span class="highlighted">${m}</span>`);

// Main Component
const FileList = ({ files, path, previewCallback }) => {
  const [searchText, setSearchText] = useState("");

  const handleOnSearch = text => {
    if (text.length > 0 && text[0].match(/\*|\\/)) {
      alert("Don't use regular expression special signs as a first char!");
      return;
    }

    setSearchText(text);
  };

  return (
    <div className="file-list">
      <nav className="panel">
        <p className="panel-heading">Flies</p>
        <div className="panel-block">
          <p className="control has-icons-left">
            <input
              className="input"
              type="text"
              onChange={e => handleOnSearch(e.target.value)}
              value={searchText}
              placeholder="Search"
            />
            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>
        {files.map((file, idx) => {
          if (!file.name.toLowerCase().match(searchText.toLowerCase())) return;

          const iconClassName =
            FORMAT_TO_ICON[getFileExtension(file.name)] || getDefaultIcon();

          return (
            <a
              className="panel-block"
              rel="noopener noreferrer"
              target="_blank"
              download
              key={idx}
              href={path + "/" + file.name}
            >
              <span className="panel-icon">
                <i className={iconClassName} aria-hidden="true"></i>
              </span>
              <span className="panel-block-name">
                {(searchText == "" || searchText == ".") ? (
                  file.name
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlight(file.name, searchText)
                    }}
                  />
                )}
              </span>
              <span className="panel-block-size" >
                {GetFileSize(file)}
              </span>
            </a>
          );
        })}
        <div className="panel-block">
          <button className="button is-link is-outlined is-fullwidth">
            Reset all filters
          </button>
        </div>
      </nav>
    </div>
  );
};

export default FileList;
