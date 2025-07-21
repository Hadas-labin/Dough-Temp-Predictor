import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { TemperatureProvider, PredictionProvider, usePrediction } from "./TemperatureContext";
import TemperatureDisplay from "./components/TemperatureDisplay";
import AdminPredictionPanel from "./components/AdminPredictionPanel"
import AdminLoginModal from "./components/AdminLoginModal"
import "./App.css";

function MainAppContent() {
  const { showAdjustComponent } = usePrediction();
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="main-container">
      <section className="content-box">
        <button className="admin-button" onClick={() => setShowModal(true)}>
          כניסת מנהל
        </button>
        <h1 className="main-title">מערכת חיזוי טמפרטורת בצק</h1>
        <TemperatureDisplay />
      </section>

      {showModal && (
        <AdminLoginModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            window.location.href = "/admin"; 
          }}
        />
      )}
    </main>
  );
}

function App() {
  return (
    <TemperatureProvider>
      <PredictionProvider>
        <Router>
          <div className="app-global-content-wrapper">
            <Routes>
              <Route path="/" element={<MainAppContent />} />
              <Route path="/admin" element={<AdminPredictionPanel />} />
              {/* <Route path="/AdminLoginModal" element ={<AdminLoginModal/>} /> */}
            </Routes>
          </div>
        </Router>
      </PredictionProvider>
    </TemperatureProvider>
  );
}

export default App;