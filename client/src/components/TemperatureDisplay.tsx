// // src/TemperatureDisplay.js (עדכון של הקובץ הקיים)
// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
// import "./TemperatureDisplay.css";

// const SOCKET_SERVER_URL = "http://localhost:5000";

// export function TemperatureDisplay() {
//   // נשתמש ב-useState כדי לשמור את הנתונים שמתקבלים מהחיישנים
//   const [currentTemperature, setCurrentTemperature] = useState("N/A"); // נתוני טמפרטורה מה-LM75
//   // אם יש לכם מספר חיישני טמפרטורה (קמח, מים, שמן), תצטרכו כמה משתני state:
//    const [flourTemp, setFlourTemp] = useState("N/A");
//    const [waterTemp, setWaterTemp] = useState("N/A");
//    const [oilTemp, setOilTemp] = useState("N/A");
//   const [waterAmount, setWaterAmount] = useState("N/A"); // נתון סטטי או מחיישן כמות מים

//   useEffect(() => {
//     const socket = io(SOCKET_SERVER_URL);

//     socket.on("arduinoData", (data) => {
//       console.log("Received data from server:", data);
//       // אם קיבלנו נתוני טמפרטורה, עדכן את ה-state
//       if (data.temperature !== undefined) {
//         setCurrentTemperature(`${data.temperature}°C`);
//       }
//       // אם יש לכם מספר חיישני טמפרטורה ששולחים נתונים עם מפתחות שונים (לדוגמה 'flourTemp', 'waterTemp'):
//       if (data.flourTemperature !== undefined) {
//         setFlourTemp(`${data.flourTemperature}°C`);
//       }
//       if (data.waterTemperature !== undefined) {
//         setWaterTemp(`${data.waterTemperature}°C`);
//       }
//       if (data.oilTemperature !== undefined) {
//         setOilTemp(`${data.oilTemperature}°C`);
//       }
//       // אם יש חיישן כמות מים:
//       if (data.waterAmount !== undefined) {
//         setWaterAmount(`${data.waterAmount} מל`);
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div className="temp-section">
//       <h2 className="section-title">נתוני טמפרטורת רכיבים</h2>
//       <div className="grid-display">
//         {/* הצגת הטמפרטורה מה-LM75 במקום טמפרטורת הקמח הסטטית */}
//         <div className="temp-box">🌡️ טמפרטורה נוכחית: {currentTemperature}</div>
//         {/* אם יש לכם חיישנים נוספים, תוכלו להחזיר את אלו בהתאם */}
//         <div className="temp-box">🌾 טמפרטורת קמח: {flourTemp}</div>
//         <div className="temp-box">💧 טמפרטורת מים: {waterTemp}</div>
//         <div className="temp-box">🛢️ טמפרטורת שמן: {oilTemp}</div>
//         <div className="temp-box">📏 כמות מים: {waterAmount}</div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const SOCKET_SERVER_URL = "http://localhost:5000"; // שנה לפי הכתובת שלך

// export default function TemperatureSensors() {
//   type SensorData = {
//   שמן: number | null;
//   מים: number | null;
//   קמח: number | null;
// };

// const [temperatures, setTemperatures] = useState<SensorData>({
//   שמן: null,
//   מים: null,
//   קמח: null,
// });

//   useEffect(() => {
//     const socket = io(SOCKET_SERVER_URL, {
//       transports: ['websocket'],
//     });

//     // מאזין לאירוע עם הנתונים מכל החיישנים
//     socket.on('arduinoData', (data) => {
//       // data אמור להיות אובייקט כמו { שמן: 27.3, מים: 28.1, קמח: 0.0 }
//       setTemperatures(data);
//     });

//     socket.on('connect', () => {
//       console.log('Connected to server');
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif', maxWidth: 300, margin: 'auto' }}>
//       <h2>טמפרטורות חיישנים</h2>
//       <div>
//         <p>טמפרטורת שמן: {temperatures.שמן !== null ? temperatures.שמן.toFixed(2) + '°C' : 'טעינה...'}</p>
//         <p>טמפרטורת מים: {temperatures.מים !== null ? temperatures.מים.toFixed(2) + '°C' : 'טעינה...'}</p>
//         <p>טמפרטורת קמח: {temperatures.קמח !== null ? temperatures.קמח.toFixed(2) + '°C' : 'טעינה...'}</p>
//       </div>
//     </div>
//   );
// }
// import * as signalR from "@microsoft/signalr";
// import React, { useEffect, useState } from "react";
// import { useTemperatureContext } from "../TemperatureContext";
// import { SensorData } from "../TemperatureContext";
// import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";


// const API_URL = "https://localhost:7158";

// const sensorFields: { key: keyof SensorData; label: string }[] = [
//   { key: "oil", label: "שמן" },
//   { key: "water", label: "מים" },
//   { key: "flour", label: "קמח" },
// ];

// export default function TemperatureDisplay() {
//   const { mode, setMode, manualValues, setManualValues } = useTemperatureContext();
//   const isManual = mode === "manual";

//   const [sensorValues, setSensorValues] = useState<SensorData>({
//     oil: null,
//     water: null,
//     flour: null,
//   });

//   // כאן שומרים את הטקסט שהמשתמש מקליד
//   const [manualTextValues, setManualTextValues] = useState<{ [key in keyof SensorData]: string }>({
//     oil: "",
//     water: "",
//     flour: "",
//   });

// useEffect(() => {
//   const connection = new HubConnectionBuilder()
//     .withUrl("https://localhost:7158/temperatureHub", {
//       withCredentials: true,
//     })
//     .withAutomaticReconnect()
//     .build();

//   connection
//     .start()
//     .then(() => {
//       console.log("SignalR connected");

//       // הקשבה לאירועים מהשרת
//       connection.on("arduinoData", (data: any) => {
//         console.log("Data from server:", data);
//       });
//     })
//     .catch((err) => {
//       console.error("SignalR connection error:", err);
//     });

//   return () => {
//     connection.stop();
//   };
// }, []);


//   // עדכון טקסט + המרה למספר ועדכון manualValues
//   function handleManualInputChange(e: React.ChangeEvent<HTMLInputElement>, key: keyof SensorData) {
//     const text = e.target.value;
//     setManualTextValues(prev => ({ ...prev, [key]: text }));

//     const num = parseFloat(text);
//     if (!isNaN(num)) {
//       setManualValues({ ...manualValues, [key]: num });
//     } else {
//       setManualValues({ ...manualValues, [key]: null });
//     }
//   }

//   const displayed: SensorData = isManual ? manualValues : sensorValues;

//   return (
//     <div style={{ direction: "rtl", fontFamily: "Arial", maxWidth: 400, margin: "auto" }}>
//       <h2>🌡️ טמפרטורות חיישנים</h2>

//       <button onClick={() => setMode(isManual ? "auto" : "manual")}>
//         {isManual ? "🔁 חזרה למצב חיישנים" : "✍️ מעבר להזנה ידנית"}
//       </button>

//       <div style={{ marginTop: 20 }}>
//         {sensorFields.map(({ key, label }) => (
//           <div key={key} style={{ marginBottom: 10 }}>
//             {isManual ? (
//               <label>
//                 טמפרטורת {label}:
//                 <input
//                   type="text"
//                   value={manualTextValues[key] ?? ""}
//                   onChange={e => {
//                     const text = e.target.value;
//                     setManualTextValues({ ...manualTextValues, [key]: text });

//                     const num = parseFloat(text);
//                     if (!isNaN(num)) {
//                       setManualValues({ ...manualValues, [key]: num });
//                     } else {
//                       setManualValues({ ...manualValues, [key]: null });
//                     }
//                   }}
//                 />

//                 °C
//               </label>
//             ) : (
//               <p>
//                 טמפרטורת {label}:{" "}
//                 {displayed[key] !== null ? displayed[key]!.toFixed(2) + "°C" : "טעינה..."}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import './TemperatureDisplay.css';
import React, { useEffect, useState } from "react";
import { useTemperatureContext, usePrediction, PredictionData, SensorData } from "../TemperatureContext";



const sensorFields: { key: keyof SensorData; label: string }[] = [
  { key: "oil", label: "שמן" },
  { key: "water", label: "מים" },
  { key: "flour", label: "קמח" },
];

export default function TemperatureDisplay() {
  // האם להציג את תיבת העריכה?
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editablePrediction, setEditablePrediction] = useState<PredictionData | null>(null);

  const { mode, setMode, manualValues, setManualValues } = useTemperatureContext();
  const isManual = mode === "manual";

  const [sensorValues, setSensorValues] = useState<SensorData>({
    oil: null,
    water: null,
    flour: null,
  });

  const [manualTextValues, setManualTextValues] = useState<{ [key in keyof SensorData]: string }>({
    oil: "",
    water: "",
    flour: "",
  });

  const [iceAmount, setIceAmount] = useState<number | null>(null);
  const [oil, setoil] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setPredictionAndShowAdjust } = usePrediction();



  function handleManualInputChange(e: React.ChangeEvent<HTMLInputElement>, key: keyof SensorData) {
    const text = e.target.value;
    setManualTextValues((prev) => ({ ...prev, [key]: text }));

    const num = parseFloat(text);
    setManualValues((prev: SensorData) => ({
      ...prev,
      [key]: isNaN(num) ? null : num,
    }));
  }

  const sendToServer = async () => {
    if (
      manualValues.oil === null ||
      manualValues.water === null ||
      manualValues.flour === null) {
      setErrorMessage("יש להזין את כל הנתונים (שמן, מים וקמח) לפני השליחה.");
      setIceAmount(null); // ננקה תוצאה קודמת
      return;
    }

    try {
      const response = await fetch("https://localhost:7029/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(manualValues)
      });

      if (!response.ok) {
        throw new Error(`שגיאה בשליחה לשרת: ${response.status} ${response.statusText}`);
      }

      const data: {
        iceAmount?: number;
        oilAmount?: number;
        finalTemperature?: number;
        errorMessage?: string;
      } = await response.json();

      const prediction: PredictionData = {
        ice: data.iceAmount ?? null,
        oil: data.oilAmount ?? manualValues.oil,
        water: manualValues.water,
        flour: manualValues.flour,
        finalTemp: data.finalTemperature ?? null,
      };
      console.log("prediction = ", prediction);

      setPredictionAndShowAdjust(prediction)
      setIceAmount(null);
      setErrorMessage("");

      // עדכון בהתאם לתוצאה
      if (data.iceAmount !== undefined && data.iceAmount !== null) {
        setIceAmount(data.iceAmount);
      }

      if (data.oilAmount !== undefined && data.oilAmount !== null) {
        setoil(data.oilAmount);
      }

      if (data.errorMessage && data.errorMessage.trim() !== "") {
        setErrorMessage(data.errorMessage);
      }

      setEditablePrediction(prediction);
      setShowEditPanel(true);

      setManualTextValues({ oil: "", water: "", flour: "" });
      setManualValues({ oil: null, water: null, flour: null });

    } catch (error: any) {
      console.error("שגיאה בשליחה:", error);
      setErrorMessage(error.message || "אירעה שגיאה לא ידועה");
      setIceAmount(null); // ננקה תוצאה קודמת
    }
  };


  async function saveResultToCSV(data: {
    iceAmount?: number;
    oilAmount?: number;
    finalTemperature?: number;
  }) {
    try {
      const flour = manualValues.flour;
      const water = manualValues.water;
      const oil = data.oilAmount ?? manualValues.oil;
      const ice = data.iceAmount;
      const finalTemperature = data.finalTemperature;

      if (
        flour == null || water == null || oil == null ||
        ice == null || finalTemperature == null
      ) {
        console.warn('Missing values, skipping CSV save');
        return;
      }

      const res = await fetch('http://localhost:8000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flour, oil, water, ice, finalTemperature })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Failed to save to CSV:', err.error);
      } else {
        console.log('Saved to CSV successfully!');
      }

    } catch (err) {
      console.error('Unexpected error saving CSV:', err);
    }
  }

  const handleFinalSave = async () => {
    if (!editablePrediction) return;

    const response = await fetch("http://localhost:8000/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flour: editablePrediction.flour,
        oil: editablePrediction.oil,
        water: editablePrediction.water,
        ice: editablePrediction.ice,
        finalTemperature: editablePrediction.finalTemp,
      }),
    });

    if (response.ok) {
      alert("הנתונים נשמרו לקובץ בהצלחה ✅");
      setShowEditPanel(false);
      setEditablePrediction(null);
    } else {
      alert("שגיאה בשמירה הסופית ❌");
    }
  };


  const displayed: SensorData = isManual ? manualValues : sensorValues;
  return (
    <div className="temperature-card">
      <div className="card">
        <h2 className="section-title">הכנס טמפרטורת רכיבי הבצק</h2>

        <button onClick={() => setMode(isManual ? "auto" : "manual")}>
          {isManual ? "🔁 חזרה למצב חיישנים" : "✍️ מעבר להזנה ידנית"}
        </button>

        <div >
          {sensorFields.map(({ key, label }) => (
            <div key={key} style={{ marginBottom: 10 }}>
              {isManual ? (
                <label>
                  טמפרטורת {label}:
                  <input
                    type="text"
                    value={manualTextValues[key] ?? ""}
                    onChange={(e) => handleManualInputChange(e, key)}
                  />
                  °C
                </label>
              ) : (
                <p>
                  טמפרטורת {label}:{" "}
                  {displayed[key] !== null ? (
                    displayed[key]!.toFixed(2) + "°C"
                  ) : (
                    <>
                      <span className="ai-loader" /> מחשב...
                    </>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={sendToServer}>חישוב טמפרטורה סופית בצק</button>

          {iceAmount !== null && (
            <p className="success-msg">
              כמות קרח מומלצת: {Math.abs(iceAmount).toFixed(2)} גרם
            </p>
          )}

          {oil !== null && (
            <p className="success-msg">
              טמפרטורת שמן מומלצת: {Math.abs(oil).toFixed(2)} גרם
            </p>
          )}

          {errorMessage && (
            <p className="error-msg"> !שגיאה:
              <br></br>
              {errorMessage}</p>
          )}
        </div>

        {showEditPanel && editablePrediction && (
          <div style={{ border: "1px solid #aaa", padding: "1em", marginTop: "1em" }}>
            <h3>בדיקת נתונים לפני שמירה סופית</h3>
            <label>
              קמח:
              <input
                type="number"
                value={editablePrediction.flour ?? 0}
                onChange={e =>
                  setEditablePrediction({ ...editablePrediction, flour: parseFloat(e.target.value) })
                }
              />
            </label>
            <br />
            <label>
              שמן:
              <input
                type="number"
                value={editablePrediction.oil ?? 0}
                onChange={e =>
                  setEditablePrediction({ ...editablePrediction, oil: parseFloat(e.target.value) })
                }
              />
            </label>
            <br />
            <label>
              מים:
              <input
                type="number"
                value={editablePrediction.water ?? 0}
                onChange={e =>
                  setEditablePrediction({ ...editablePrediction, water: parseFloat(e.target.value) })
                }
              />
            </label>
            <br />
            <label>
              קרח:
              <input
                type="number"
                value={editablePrediction.ice ?? 0}
                onChange={e =>
                  setEditablePrediction({ ...editablePrediction, ice: parseFloat(e.target.value) })
                }
              />
            </label>
            <br />
            <label>
              טמפרטורה סופית:
              <input
                type="number"
                value={editablePrediction.finalTemp ?? 0}
                onChange={e =>
                  setEditablePrediction({ ...editablePrediction, finalTemp: parseFloat(e.target.value) })
                }
              />
            </label>
            <br /><br />
            <button onClick={handleFinalSave}>אישור סופי ושמירה</button>
            <button onClick={() => setShowEditPanel(false)}>ביטול</button>
          </div>
        )}

      </div>
    </div>
  );
}