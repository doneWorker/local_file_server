const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const localIP = require("../helpers/localIp");

const PORT = 8080;
const sharedPath = path.join(process.cwd(), "shared");

const app = express();

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

// Middlewares
app.use("/shared", express.static("shared"));
app.use(
  fileUpload({
    limits: { fileSize: MAX_FILE_SIZE },
    debug: false,
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);

// CORS
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// BLL

// Get file list
async function getFiles(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      err ? reject(err) : resolve(files);
    });
  });
}

async function getStat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      err ? reject(err) : resolve(stats);
    });
  });
}

async function getSharedFileList() {
  const names = await getFiles(sharedPath);
  let files = [];
  for (name of names) {
    files.push({
      name,
      stat: await getStat(path.join(sharedPath, name))
    });
  }

  return files;
}

// Endpoints
app.get("/", (req, res) => {
  res.send(`Shared Folder:  ${sharedPath}`);
});

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let file = req.files.file;
  file.mv(path.join(sharedPath, file.name), function(err) {
    if (err) return res.status(500).send(err);
    res.send("File uploaded!");
  });
});

app.get("/filelist", async function(req, res) {
  let list = await getSharedFileList();
  res.setHeader("Content-Type", "application/json");
  res.send({
    list
  });
});

app.get("/localip/", function(req, res) {
  res.send( {
    address: localIP.getIp()
  })
});

// Run Server
app.listen(PORT, () => {
  console.log(`Local address: 0.0.0.0:${PORT}`);
});
