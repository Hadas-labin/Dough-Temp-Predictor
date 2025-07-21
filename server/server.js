// // const express = require('express');
// // const http = require('http');
// // const socketIo = require('socket.io');
// // const { SerialPort, ReadlineParser } = require('serialport');
// // const cors = require('cors');
// // const fetch = require('node-fetch'); // אל תשכח: npm install node-fetch

// // const app = express();
// // const server = http.createServer(app);
// // const io = socketIo(server, {
// //     cors: {
// //         origin: "http://localhost:3000",
// //         methods: ["GET", "POST"]
// //     }
// // });

// // const PORT = process.env.PORT || 5000;

// // app.use(cors({ origin: "http://localhost:3000" }));
// // app.use(express.json()); // חשוב לקליטת JSON

// // // יציאה טורית
// // const port = new SerialPort({
// //     path: 'COM3', // שנה לפי הפורט שלך
// //     baudRate: 9600
// // });

// // const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// // let latestTemperature = null;

// // port.on('open', () => {
// //     console.log('Serial Port Open');
// // });

// // parser.on('data', data => {
// //     console.log('Data from Arduino:', data);
// //     const match = data.match(/TemperatureC=([\d\.-]+)°C/);
// //     if (match && match[1]) {
// //         latestTemperature = parseFloat(match[1]);
// //         console.log('Parsed Temperature:', latestTemperature);
// //         io.emit('arduinoData', { temperature: latestTemperature });
// //     }
// // });

// // io.on('connection', (socket) => {
// //     console.log('Client connected');

// //     socket.on('requestPrediction', async () => {
// //         console.log('📡 התחלת קריאה לחיזוי מהלקוח');
// //         if (latestTemperature != null) {
// //             try {
// //                 const response = await fetch('https://localhost:7158/model/result', {
// //                     method: 'POST',
// //                     headers: { 'Content-Type': 'application/json' },
// //                     body: JSON.stringify({ temperature: latestTemperature })
// //                 });

// //                 const result = await response.json();
// //                 console.log('✅ חיזוי התקבל משרת C#:', result);
// //                 socket.emit('predictionResult', result);

// //             } catch (err) {
// //                 console.error('❌ שגיאה בשליחת חיזוי לשרת C#', err);
// //                 socket.emit('predictionResult', { error: 'חיזוי נכשל' });
// //             }
// //         } else {
// //             socket.emit('predictionResult', { error: 'אין נתוני טמפרטורה זמינים' });
// //         }
// //     });

// //     socket.on('disconnect', () => {
// //         console.log('Client disconnected');
// //     });
// // });

// // app.get('/', (req, res) => {
// //     res.send('Node.js server is running');
// // });

// // server.listen(PORT, () => {
// //     console.log(`Server listening on port ${PORT}`);
// // });
// // const express = require('express');
// // const http = require('http');
// // const socketIo = require('socket.io');
// // const { SerialPort, ReadlineParser } = require('serialport');
// // const cors = require('cors');
// // const https = require('https');

// // const app = express();
// // const server = http.createServer(app);
// // const io = socketIo(server, {
// //     cors: {
// //         origin: "http://localhost:3000",
// //         methods: ["GET", "POST"]
// //     }
// // });

// // const PORT = process.env.PORT || 5000;

// // app.use(cors({ origin: "http://localhost:3000" }));
// // app.use(express.json()); // חשוב לקליטת JSON

// // // פונקציית fetch עצמאית (תחליף ל-node-fetch)
// // function fetch(url, options = {}) {
// //     return new Promise((resolve, reject) => {
// //         const urlObj = new URL(url);
// //         const opts = {
// //             method: options.method || 'GET',
// //             hostname: urlObj.hostname,
// //             path: urlObj.pathname + urlObj.search,
// //             port: urlObj.port || 443,
// //             headers: options.headers || {},
// //         };

// //         const req = https.request(opts, (res) => {
// //             let data = '';

// //             res.on('data', chunk => data += chunk);
// //             res.on('end', () => {
// //                 resolve({
// //                     ok: res.statusCode >= 200 && res.statusCode < 300,
// //                     status: res.statusCode,
// //                     text: () => Promise.resolve(data),
// //                     json: () => Promise.resolve(JSON.parse(data))
// //                 });
// //             });
// //         });

// //         req.on('error', reject);

// //         if (options.body) {
// //             req.write(options.body);
// //         }

// //         req.end();
// //     });
// // }

// // יציאה טורית
// // const port = new SerialPort({
// //     path: 'COM10', 
// //     baudRate: 9600
// // });

// const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// let latestTemperature = null;

// port.on('open', () => {
//     console.log('Serial Port Open');
// });

// const sensorMap = {
//   '0x4A': 'שמן',
//   '0x48': 'מים',
//   '0x49': 'קמח',
// };

// let latestTemperatures = {
//   שמן: null,
//   מים: null,
//   קמח: null,
// };


// parser.on('data', data => {
//     console.log('Data from Arduino:', data);
//     const match = data.match(/חיישן\s+\((0x[0-9A-F]+)\)\s+טמפרטורה:\s*([\d\.]+)°C/);
//     if (match) {
//         const sensorAddress = match[1]; // למשל: 0x4A
//         const temperature = parseFloat(match[2]);

//         // קבלת שם החיישן לפי הכתובת
//         const sensorName = sensorMap[sensorAddress];

//         if (sensorName) {
//             latestTemperatures[sensorName] = temperature;
//             console.log(`עדכון טמפרטורה לחיישן ${sensorName}: ${temperature}°C`);

//             // שליחת כל הטמפרטורות הנוכחיות לריאקט
//             io.emit('arduinoData', latestTemperatures);
//         } else {
//             console.log('כתובת חיישן לא מוכרת:', sensorAddress);
//         }
//     }
// });


// io.on('connection', (socket) => {
//     console.log('Client connected');

//     socket.on('requestPrediction', async () => {
//         console.log('📡 התחלת קריאה לחיזוי מהלקוח');
//         if (latestTemperature != null) {
//             try {
//                 const response = await fetch('https://localhost:7158/model/result', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ temperature: latestTemperature })
//                 });

//                 const result = await response.json();
//                 console.log('✅ חיזוי התקבל משרת C#:', result);
//                 socket.emit('predictionResult', result);

//             } catch (err) {
//                 console.error('❌ שגיאה בשליחת חיזוי לשרת C#', err);
//                 socket.emit('predictionResult', { error: 'חיזוי נכשל' });
//             }
//         } else {
//             socket.emit('predictionResult', { error: 'אין נתוני טמפרטורה זמינים' });
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

// app.get('/', (req, res) => {
//     res.send('Node.js server is running');
// });

// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });











// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');
// const csv = require('csv-parser');
// const cors = require('cors');
// require('dotenv').config();
// const adminsCsvPath = path.join(__dirname, 'admin-login', 'admins.csv');

// const app = express();
// const PORT = 8000;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const SECRET_KEY = process.env.SECRET_KEY;
// const TOKEN_EXPIRE_MINUTES = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '30');

// function readAdminsFromCSV() {
//     return new Promise((resolve, reject) => {
//         const results = [];
//         fs.createReadStream('adminsCsvPath.csv')
//             .pipe(csv())
//             .on('data', (data) => results.push(data))
//             .on('end', () => resolve(results))
//             .on('error', reject);
//     });
// }

// function createToken(username) {
//     return jwt.sign({ sub: username }, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE_MINUTES}m` });
// }

// app.post('/admin/token', async (req, res) => {
//     const { username, password } = req.body;
//     const admins = await readAdminsFromCSV();
//     const admin = admins.find(a => a.username === username);
//     if (!admin) return res.status(401).json({ detail: 'שם משתמש שגוי' });

//     const isMatch = await bcrypt.compare(password, admin.password_hash);
//     if (!isMatch) return res.status(401).json({ detail: 'סיסמה שגויה' });

//     const token = createToken(username);
//     res.json({ access_token: token, token_type: 'bearer' });
// });

// app.listen(PORT, () => {
//     console.log(`🔐 Admin server running on http://localhost:${PORT}`);
// });







const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');
require('dotenv').config();


//פורט 8000 ניהול כניסת מנהל

const app = express();
const PORT = 8000;

const adminsCsvPath = path.join(__dirname, 'admin-login', 'admins.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const SECRET_KEY = process.env.SECRET_KEY;
// const TOKEN_EXPIRE_MINUTES = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '30');

const SECRET_KEY = "secret";
const TOKEN_EXPIRE_MINUTES = 30;

function readAdminsFromJSON() {
    return new Promise((resolve, reject) => {
        fs.readFile(adminsCsvPath, 'utf8', (err, data) => {
            if (err) {
                console.error('שגיאה בקריאת קובץ admins.json:', err);
                reject(err);
                return;
            }
            try {
                const parsed = JSON.parse(data);
                resolve(parsed); // יחזיר אובייקט, לא מערך!
            } catch (e) {
                console.error('שגיאה בפירוק JSON:', e);
                reject(e);
            }
        });
    });
}

function createToken(username) {
    return jwt.sign({ sub: username }, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE_MINUTES}m` });
}

app.post('/admin/token', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await readAdminsFromJSON(); // אובייקט, לא מערך

        if (username !== admin.username) {
            return res.status(401).json({ detail: 'שם משתמש שגוי' });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ detail: 'סיסמה שגויה' });
        }

        const token = createToken(username);
        res.json({ access_token: token, token_type: 'bearer' });

    } catch (err) {
        console.error('שגיאה בשרת /admin/token:', err);
        res.status(500).json({ detail: 'שגיאה בשרת' });
    }
});

app.listen(PORT, () => {
    console.log(`🔐 Admin server running on http://localhost:${PORT}`);
});


const filesDir = path.join(__dirname, "files");
const configPath = path.join(__dirname, "settings.csv");
const dataCsvPath = path.join(__dirname, "data.csv");
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir);
const multer = require("multer");

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

    // קריאת ההגדרות הקיימות או ברירת מחדל
    let configValues = ["1000", "0.01", "-76","","26"];
    if (fs.existsSync(configPath)) {
        const lines = fs.readFileSync(configPath, "utf8").trim().split("\n");
        if (lines.length > 1) {
            configValues = lines[1].split(",").slice(0, 3);
        }
    }

    const header = "iterations,learningRate,iceTemp,dataPath,predictedY";
    const newRow = `${configValues.join(",")},${uploadedPath}`;
    fs.writeFileSync(configPath, `${header}\n${newRow}`);

    res.status(200).json({
        message: "File uploaded and set as current successfully",
        filename: uploadedPath,
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
        return res.json({ iterations: 1000, learningRate: 0.01, iceTemp: 0, dataPath: "",predictedY: 26});
    }
    const content = fs.readFileSync(configPath, "utf8");
    // const [iterations, learningRate, iceTemp, predictedY] = content.trim().split(",");
    const [iterations, learningRate, iceTemp, dataPath, predictedY] = lines[1].split(",");
    res.json({
        iterations: parseInt(iterations),
        learningRate: parseFloat(learningRate),
        iceTemp: parseFloat(iceTemp),
        dataPath: dataPath || "",
        predictedY:parseFloat(parseFloat)
    });
});

// שמירת הגדרות חדשות
app.post("/settings", (req, res) => {
    console.log(req);
    console.log("req.body =", req.body);
    const { iterations, learningRate, iceTemp ,predictedY} = req.body;
    console.log("iterations=", iterations);
    console.log("learningRate=", learningRate);
    console.log("iceTemp=", iceTemp);
    console.log("predictedY=", predictedY);

    let existingPath = "";
    if (fs.existsSync(configPath)) {
        const lines = fs.readFileSync(configPath, "utf8").trim().split("\n");
        if (lines.length > 1) {
            existingPath = lines[1].split(",")[3] || "";
        }
    }

    const header = "iterations,learningRate,iceTemp,dataPath,predictedY";
    const newRow = `${iterations},${learningRate},${iceTemp},${existingPath},${predictedY}`;
    fs.writeFileSync(configPath, `${header}\n${newRow}`);

    res.status(200).json({ message: "Settings saved with header" });
});

// הוספת שורת נתונים לקובץ הנתונים האחרון לפי settings.csv
app.post("/api/save", (req, res) => {
    const { flour, oil, water, ice, finalTemperature } = req.body;

    if (
        flour === undefined ||
        oil === undefined ||
        water === undefined ||
        ice === undefined ||
        finalTemperature === undefined
    ) {
        return res.status(400).json({ error: "Missing one or more required fields" });
    }

    // קריאת נתיב הקובץ מתוך settings.csv
    if (!fs.existsSync(configPath)) {
        return res.status(500).json({ error: "settings.csv not found" });
    }

    const lines = fs.readFileSync(configPath, "utf8").trim().split("\n");
    if (lines.length < 2) {
        return res.status(500).json({ error: "settings.csv does not contain valid data" });
    }

    const dataPath = lines[1].split(",")[3]?.replace(/"/g, "").trim();
    if (!dataPath || !fs.existsSync(dataPath)) {
        return res.status(500).json({ error: "Data file path is invalid or missing" });
    }

    // בניית שורת CSV לפי הסדר: קמח, שמן, מים, קרח, טמפרטורה סופית
    const csvLine = `${flour},${oil},${water},${ice},${finalTemperature}\n`;

    try {
        // אם הקובץ לא קיים מסיבה כלשהי (נדיר), נוסיף כותרת
        if (!fs.existsSync(dataPath)) {
            const header = "flour,oil,water,ice,finalTemperature\n";
            fs.writeFileSync(dataPath, header);
        }

        // הוספת השורה
        fs.appendFileSync(dataPath, csvLine);
        console.log("✅ שורה חדשה נשמרה בקובץ הנתונים:", dataPath);

        res.status(200).json({ message: "Data saved successfully" });
    } catch (err) {
        console.error("❌ שגיאה בשמירה ל־data:", err.message);
        res.status(500).json({ error: "Failed to save data" });
    }
});
