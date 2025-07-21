// import React, { createContext, useState, useContext } from "react";

// export type SensorData = {
//     oil: number | null;
//     water: number | null;
//     flour: number | null;
//   [key: string]: number | null; // ✅ מוסיף תמיכה בגישה דינמית
// };

// type TemperatureContextType = {
//   mode: "auto" | "manual";
//   setMode: (mode: "auto" | "manual") => void;
//   manualValues: SensorData;
// setManualValues: React.Dispatch<React.SetStateAction<SensorData>>;
// };

// const TemperatureContext = createContext<TemperatureContextType | null>(null);

// export const useTemperatureContext = () => {
//   const context = useContext(TemperatureContext);
//   if (!context) throw new Error("TemperatureContext לא אותחל");
//   return context;
// };

// export const TemperatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [mode, setMode] = useState<"auto" | "manual">("auto");
//   const [manualValues, setManualValues] = useState<SensorData>({
//     flour: null,
//     water: null,
//     oil: null,
//   });

//   return (
//     <TemperatureContext.Provider value={{ mode, setMode, manualValues, setManualValues }}>
//       {children}
//     </TemperatureContext.Provider>
//   );
// };


import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

/* ========== Sensor / Manual Mode Context ========== */

export type SensorData = {
  oil: number | null;
  water: number | null;
  flour: number | null;
  [key: string]: number | null;
};

type TemperatureContextType = {
  mode: "auto" | "manual";
  setMode: (mode: "auto" | "manual") => void;
  manualValues: SensorData;
  setManualValues: React.Dispatch<React.SetStateAction<SensorData>>;
};

const TemperatureContext = createContext<TemperatureContextType | null>(null);

export const useTemperatureContext = () => {
  const context = useContext(TemperatureContext);
  if (!context) throw new Error("TemperatureContext לא אותחל");
  return context;
};

export const TemperatureProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [manualValues, setManualValues] = useState<SensorData>({
    flour: null,
    water: null,
    oil: null,
  });

  return (
    <TemperatureContext.Provider
      value={{ mode, setMode, manualValues, setManualValues }}
    >
      {children}
    </TemperatureContext.Provider>
  );
};

/* ========== Prediction / Result Context ========== */

export type PredictionData = {
  ice: number | null;
  water: number | null;
  oil: number | null;
  flour: number | null;
  finalTemp: number | null;
};

type PredictionContextType = {
  showAdjustComponent: boolean;
  predictionData: PredictionData;
  setPredictionAndShowAdjust: (data: PredictionData) => void;
  closeAdjustComponent: () => void;
  setPredictionData: React.Dispatch<React.SetStateAction<PredictionData>>; // ✅ מאפשר עריכה גם מקומפוננטות אחרות
};

const PredictionContext = createContext<PredictionContextType | null>(null);

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error("usePrediction must be used within a PredictionProvider");
  }
  return context;
};

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [showAdjustComponent, setShowAdjustComponent] = useState(false);

  const [predictionData, setPredictionData] = useState<PredictionData>({
    ice: null,
    water: null,
    oil: null,
    flour: null,
    finalTemp: null,
  });

  const setPredictionAndShowAdjust = useCallback(
    (data: PredictionData) => {
      setPredictionData(data);
      setShowAdjustComponent(true);
    },
    []
  );

  const closeAdjustComponent = useCallback(() => {
    setShowAdjustComponent(false);
  }, []);

  return (
    <PredictionContext.Provider
      value={{
        showAdjustComponent,
        predictionData,
        setPredictionAndShowAdjust,
        closeAdjustComponent,
        setPredictionData, // ✅ מאפשר עדכון נתונים מתוך קומפוננטות אחרות
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};
