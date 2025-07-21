extern SemaphoreHandle_t i2cMutex;

// כתובות חיישנים
const int LM75_ADDRESS_SENSOR1 = 0x48;
const int LM75_ADDRESS_SENSOR2 = 0x49;
const int LM75_ADDRESS_SENSOR3 = 0x4A;

// קריאה אחת
void readLM75Temperature(int address) {
  //זה כדי לוודא שרק משימה אחת משתמשת ב־I2C בכל רגע – הגנה מפני גישה כפולה.
  if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(100)) == pdTRUE) {
    Wire.beginTransmission(address);//מתחיל שיחה עם החיישן
    Wire.write(0x00);//שולח לו את הפקודה לקרוא את רישום הטמפרטורה
    //מסיים את השיחה עם החיישן
    if (Wire.endTransmission() != 0) {//אם יש שגיאה
      Serial.printf("שגיאה בכתובת 0x%X\n", address);
      xSemaphoreGive(i2cMutex);
      return;
    }

    Wire.requestFrom(address, 2);//מבקש מהחיישן שישלח בחזרה 2 בתים של מידע
    if (Wire.available() == 2) {//בודק שהתקבלו בדיוק 2 בתים.
      int tempRaw = (Wire.read() << 8) | Wire.read();//מאחד את שני הבתים למספר שלם
      tempRaw >>= 5;//מזיז את הסיביות ימינה 5 פעמים (כי ב־LM75 הנתונים מגיעים עם 5 סיביות לא חשובות).
      float tempC = tempRaw * 0.125;//מכפיל ב־0.125 כדי לקבל את הטמפרטורה האמיתית בצלזיוס
      Serial.printf("חיישן 0x%X: %.2f°C\n", address, tempC);//מדפיס תוצאה למסך
    } else {
      Serial.printf("חיישן 0x%X לא החזיר מספיק בתים\n", address);
    }
    xSemaphoreGive(i2cMutex);//משחרר את המשימה
  } else {
    Serial.println("לא ניתן לקבל mutex ל-I2C");
  }
}

// פונקציה לקרוא את כל החיישנים (מוזמנת מ-loop)
void readAllLM75Sensors(void *pvParameters) {
 while (1) {
    readLM75Temperature(LM75_ADDRESS_SENSOR1);
    readLM75Temperature(LM75_ADDRESS_SENSOR2);
    readLM75Temperature(LM75_ADDRESS_SENSOR3);
    vTaskDelay(pdMS_TO_TICKS(1000));  // השהייה של שנייה
  } 
}
