const express = require("express");
const fileUpload = require("express-fileupload");
const localIp = require("./helpers/localip");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

let codeSectionTemp = "";

const ip = localIp.getIp();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use("/shared", express.static("shared"));

// Get file list
async function getSharedFileList() {
  const sharedPath = path.join(__dirname, "shared");
  return new Promise((resolve, reject) => {
    fs.readdir(sharedPath, (err, files) =>
      err ? reject(err) : resolve(files)
    );
  });
}

// Clear folders
function deleteExpiredFiles() {

}

// TODO: clear "shared" folder 
cron.schedule("* * * * *", () => {
  deleteExpiredFiles();
});

// Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/shared", async function(req, res) {
  let list = await getSharedFileList();
  res.send({
    list
  });
});

app.post("/saveText", function(req, res) {
  codeSectionTemp = req.query.data;
  res.send("success!");
});

app.get("/text", function(req, res) {
  res.send({ data: codeSectionTemp });
});

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let file = req.files.file;
  file.mv(path.join(__dirname, "shared", file.name), function(err) {
    if (err) return res.status(500).send(err);

    res.send("File uploaded!");
  });
});

app.get("/myIp", (req, res) => {
  res.send(ip);
});

app.listen(PORT, function() {
  console.log(`Local address:${PORT}\nNetwork ip: ${ip}:3000`);
});
