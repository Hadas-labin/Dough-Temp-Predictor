// const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const router = express.Router();

// // נתיב אל קובץ ה-CSV הקבוע בתיקיית הפרויקט
// const csvPath = path.join(__dirname, '..', 'data.csv');

// // אם הקובץ לא קיים – ניצור אותו עם כותרות
// if (!fs.existsSync(csvPath)) {
//   const headers = 'Date,Time,Flour,Oil,Water,Ice,FinalTemperature\n';
//   fs.writeFileSync(csvPath, headers);
// }

// // נקודת קצה POST שתשמור שורה לקובץ
// router.post('/save', (req, res) => {
//   try {
//     const { flour, oil, water, ice, finalTemperature } = req.body;

//     // בדיקה שכל הערכים קיימים
//     if (
//       flour == null ||
//       oil == null ||
//       water == null ||
//       ice == null ||
//       finalTemperature == null
//     ) {
//       return res.status(400).json({ error: 'Missing values' });
//     }

//     // תאריך ושעה
//     const now = new Date();
//     const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
//     const time = now.toTimeString().split(' ')[0]; // HH:MM:SS

//     const row = `${date},${time},${flour},${oil},${water},${ice},${finalTemperature}\n`;

//     // מוסיפים את השורה לקובץ
//     fs.appendFile(csvPath, row, (err) => {
//       if (err) throw err;
//       return res.status(200).json({ message: 'Saved successfully' });
//     });
//   } catch (error) {
//     console.error('Error saving to CSV:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;

// const cors = require("cors");
// const multer = require("multer");

// const app = express();
// app.use(cors());
// app.use(express.json());

// //  תיקייה שבה נשמור את הקבצים
// const filesDir = path.join(__dirname, "files");
// if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir);

// //  הגדרה להעלאת קבצים (multer)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, filesDir),
//   filename: (req, file, cb) => {
//     const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//     const ext = path.extname(file.originalname);
//     cb(null, `uploaded-${timestamp}${ext}`);
//   },
// });
// const upload = multer({ storage });

// //  העלאת קובץ חדש ושמירה בשם חדש
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).send("No file uploaded.");
//   res.status(200).json({ message: "File uploaded successfully", filename: req.file.filename });
// });

// //  הורדת הקובץ האחרון שהועלה
// app.get("/latest", (req, res) => {
//   fs.readdir(filesDir, (err, files) => {
//     if (err || files.length === 0) return res.status(404).send("No files found.");

//     const latestFile = files
//       .map((file) => ({
//         name: file,
//         time: fs.statSync(path.join(filesDir, file)).mtime.getTime(),
//       }))
//       .sort((a, b) => b.time - a.time)[0].name;

//     res.download(path.join(filesDir, latestFile), latestFile);
//   });
// });

// //  קבלת רשימת קבצים
// app.get("/files", (req, res) => {
//   fs.readdir(filesDir, (err, files) => {
//     if (err) return res.status(500).send("Error reading directory.");

//     const sorted = files
//       .map((file) => ({
//         name: file,
//         date: fs.statSync(path.join(filesDir, file)).mtime.toISOString(),
//       }))
//       .sort((a, b) => new Date(b.date) - new Date(a.date));

//     res.json(sorted);
//   });
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`🟢 Server is running on http://localhost:${PORT}`);
// });
// //==== Node.js server (Express) ====







const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ==== תיקיות ==== //
const filesDir = path.join(__dirname, "files");
const configPath = path.join(__dirname, "settings.csv");
const dataCsvPath = path.join(__dirname, "data.csv");
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir);

// ==== Multer Upload ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, filesDir),
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const ext = path.extname(file.originalname);
    cb(null, `uploaded-${timestamp}${ext}`);
  },
});
const upload = multer({ storage });

// ==== API ==== //

// העלאת קובץ חדש (ושמירה כקובץ הנוכחי לשימוש ע"י המודל)
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const uploadedPath = path.join(filesDir, req.file.filename);
  fs.copyFileSync(uploadedPath, dataCsvPath);

  res.status(200).json({
    message: "File uploaded and set as current successfully",
    filename: req.file.filename,
  });
});
// //העלת קובץ
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).send("No file uploaded.");

//   const uploadedFullPath = path.resolve(filesDir, req.file.filename);
//   fs.copyFileSync(path.join(filesDir, req.file.filename), dataCsvPath);

//   // קריאת ההגדרות הקיימות או ברירת מחדל
//   let configValues = ["1000", "0.01", "2.5"];
//   if (fs.existsSync(configPath)) {
//     const lines = fs.readFileSync(configPath, "utf8").trim().split("\n");
//     if (lines.length > 1) {
//       configValues = lines[1].split(",").slice(0, 3); // לא כולל השם של הנתיב הישן
//     }
//   }

//   const header = "iterations,learningRate,iceTemp,dataPath";
//   const newRow = `${configValues.join(",")},${uploadedFullPath}`;
//   fs.writeFileSync(configPath, `${header}\n${newRow}`);

//   res.status(200).json({
//     message: "File uploaded and path saved",
//     fullPath: uploadedFullPath,
//   });
// });


// הורדת הקובץ הפעיל (data.csv)
app.get("/latest", (req, res) => {
  if (!fs.existsSync(dataCsvPath)) {
    return res.status(404).send("No active data file.");
  }
  res.download(dataCsvPath, "active-data.csv");
});

// קבלת ההגדרות הקיימות
app.get("/settings", (req, res) => {
  if (!fs.existsSync(configPath)) {
    return res.json({ iterations: 1000, learningRate: 0.01, iceTemp: 0 });
  }
  const content = fs.readFileSync(configPath, "utf8");
  const [iterations, learningRate, iceTemp] = content.trim().split(",");
  res.json({
    iterations: parseInt(iterations),
    learningRate: parseFloat(learningRate),
    iceTemp: parseFloat(iceTemp),
  });
});

// שמירת הגדרות חדשות
app.post("/settings", (req, res) => {
  const { iterations, learningRate, iceTemp } = req.body;

  let existingPath = "";
  if (fs.existsSync(configPath)) {
    const lines = fs.readFileSync(configPath, "utf8").trim().split("\n");
    if (lines.length > 1) {
      existingPath = lines[1].split(",")[3] || "";
    }
  }

  const header = "iterations,learningRate,iceTemp,dataPath";
  const newRow = `${iterations},${learningRate},${iceTemp},${existingPath}`;
  fs.writeFileSync(configPath, `${header}\n${newRow}`);

  res.status(200).json({ message: "Settings saved with header" });
});
// app.post("/settings", (req, res) => {
//   const { iterations, learningRate, iceTemp } = req.body;
//   const row = `${iterations},${learningRate},${iceTemp}`;
//   const uploadedFullPath = path.resolve(filesDir, req.file.filename);
//   if (fs.existsSync(configPath)) {
//     configRow = fs.readFileSync(configPath, "utf8").trim();
//   }
//   fs.writeFileSync(configPath, row);
//   res.status(200).json({ message: "Settings saved." });
//   });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
