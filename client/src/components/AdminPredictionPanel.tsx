import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AdminPredictionPanel.css';
import PredictionLoader from './PredictionLoader'; // ייבוא הקומפוננטה החדשה


export default function AdminPredictionPanel() {
  const navigate = useNavigate();
  const [iterations, setIterations] = useState<number>(1000);
  const [learningRate, setLearningRate] = useState<number>(0.01);
  const [iceTemp, setIceTemp] = useState<number>(0);
  const [predictedY, setPredictedY] = useState<number>(0)
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const [lastMonthlyPrediction, setLastMonthlyPrediction] = useState<string>("");
  const [isFetchSuccessful, setIsFetchSuccessful] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // טען את התאריך מלוקאל סטורג' כשנכנסים לדף
  useEffect(() => {
    const savedDate = localStorage.getItem("lastMonthlyPrediction");
    if (savedDate) {
      setLastMonthlyPrediction(savedDate);
    }
  }, []);

  const handleManualPrediction = async () => {
    setIsLoading(true);
    setIsFetchSuccessful("");

    try {
      const response = await fetch("https://localhost:7029/manual-predict", {
        method: "POST",
      });

      if (!response.ok) {
        setIsFetchSuccessful("שגיאה בשליחת החיזוי. סטטוס:, {response.status}");
        console.error("שגיאה בשליחת החיזוי. סטטוס:", response.status);
        return;
      }
      else {
        setIsFetchSuccessful("העדכון בוצע בהצלחה");
      }

      // עדכון התאריך
      const now = new Date().toLocaleDateString("he-IL");
      localStorage.setItem("lastMonthlyPrediction", now);
      setLastMonthlyPrediction(now);
    } catch (error: any) {
      console.error("שגיאה בביצוע החיזוי:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  // טוען את ההגדרות הקיימות
  useEffect(() => {
    fetch("http://localhost:8000/settings")
      .then(res => res.json())
      .then(data => {
        setIterations(data.iterations);
        setLearningRate(data.learningRate);
        setIceTemp(data.iceTemp);
        setPredictedY(data.predictedY);
      })
      .catch(err => console.error("שגיאה בטעינת ההגדרות", err));
  }, []);
  console.log("iceTemp = ", iceTemp);
  console.log("PredictedY = ", predictedY);
  // שליחת הגדרות חדשות
  const handleSave = async () => {
    if (
      isNaN(iterations) ||
      isNaN(learningRate) ||
      isNaN(iceTemp) ||
      isNaN(predictedY) || predictedY === 0
    ) {
      setMessage("יש למלא את כל השדות במספרים תקינים");
      return;
    }
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iterations, learningRate, iceTemp, predictedY }),
      });

      if (!response.ok) throw new Error("שגיאה בשמירת ההגדרות");
      setMessage(" ההגדרות נשמרו בהצלחה!");
    } catch (error: any) {
      setMessage(" שגיאה: " + (error.message || "לא ידועה"));
    } finally {
      setIsSaving(false);
    }
  };

  // העלאת קובץ CSV חדש
  const handleUpload = async () => {
    if (!fileToUpload) return setUploadMessage("בחר קובץ קודם");
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("שגיאה בהעלאה");
      const data = await response.json();
      setUploadMessage(" הקובץ הועלה: " + data.filename);
    } catch (error: any) {
      setUploadMessage(" שגיאה בהעלאה: " + (error.message || "לא ידועה"));
    }
  };

  // הורדת הקובץ האחרון
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:8000/latest";
    link.download = "active-data.csv";
    link.click();
  };

  return (
    <div className="admin-panel">
      <button className="admin-button" onClick={() => navigate("/")}>חזרה לעמוד הבית</button>
      <h1 className="section-title"> ניהול חיזוי - מנהל</h1>

      <div className="admin-controls">
        <label>
          מספר איטרציות:
          <input type="number" value={iterations ?? ""} onChange={(e) => setIterations(parseInt(e.target.value))} />
        </label>

        <label>
          קצב למידה:
          <input type="number" step="0.001" value={learningRate ?? ""} onChange={(e) => setLearningRate(parseFloat(e.target.value))} />
        </label>

        <label>
          טמפ' קרח:
          <input type="number" step="0.1" value={iceTemp ?? ""} onChange={(e) => setIceTemp(parseFloat(e.target.value))} />
        </label>

        <label>
          טמפ' בצק סופי:
          <input type="number" step="26" value={predictedY ?? ""} onChange={(e) => setPredictedY(parseFloat(e.target.value))} />
        </label>

        <button className="predict-button" onClick={handleSave} disabled={isSaving}> שמור הגדרות</button>
        {message && <p className="message">{message}</p>}
      </div>

      <hr />

      <div className="file-section">
        <h3> העלאת קובץ חיזוי</h3>
        <input type="file" accept=".csv" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} />
        <button className="upload-button" onClick={handleUpload}>העלה קובץ</button>
        {uploadMessage && <p className="message">{uploadMessage}</p>}
      </div>

      <div className="file-section">
        <h3> הורד קובץ פעיל</h3>
        <button className="predict-button" onClick={handleDownload}>הורד את הקובץ הנוכחי</button>
      </div>

      <hr />

      <div className="controls-section">
        <h2 className="section-title">אפשרויות חיזוי</h2>
        <div className="controls-box">
          <button className="predict-button" onClick={handleManualPrediction} disabled={isLoading}>
            בצע חיזוי
          </button>
          <p>{isFetchSuccessful}</p>
          <br></br>
          <p className="last-prediction-info">
            חיזוי אחרון בוצע בתאריך: {lastMonthlyPrediction || "לא בוצע עדיין"}
          </p>

          {isLoading && <PredictionLoader />}
        </div>
      </div>
    </div>
  );
}