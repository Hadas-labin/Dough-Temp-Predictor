#include <Wire.h>  // ספריית תקשורת I2C
#include <freertos/FreeRTOS.h>
#include <freertos/semphr.h>
#include "TFT9341Touch.h"
tft9341touch lcd(12, 13, 15, 35);  // CS=12, DC=13, TCS=15, TIRQ=35  // cs, dc, tcs, tirq for ESP32

bool sensor1Ready = false;
bool sensor2Ready = false;

bool button1Visible = false;
bool button2Visible = false;

// פיני I2C חיישני טמפרטורה 
const int SENSOR_SDA_PIN = 22;
const int SENSOR_SCL_PIN = 21;

struct DistanceSensorConfig {
  int trigPin;
  int echoPin;
  const char* name;
  bool updateLED;
};

DistanceSensorConfig sensor1 = { 5, 18, "sensor1", true };
DistanceSensorConfig sensor2 = { 2, 4, "sensor2", false };

SemaphoreHandle_t i2cMutex;


void setup() {
  Serial.begin(9600);
  Serial.println("setup started");

 // *** הוסף את השורה הזו כאן ***
  lcd.begin();  // מאתחל את המסך, כולל הגדרות SPI ופקודות אתחול של ה-TFT

  lcd.setTouch(3780, 372, 489, 3811);  // כיול מגע
  lcd.fillScreen(BLUE);                // מנקה את המסך לשחור לאחר האתחול
  lcd.setTextColor(WHITE, BLACK);      // הגדרת צבעי טקסט
  lcd.setTextSize(6);                  // הגדרת גודל טקסט
  lcd.setCursor(50, 50);
  lcd.println("חדר התפחה");

  i2cMutex = xSemaphoreCreateMutex();//הגדרת מנעול

  Wire.begin(SENSOR_SDA_PIN, SENSOR_SCL_PIN);  //חיבור I2C לחיישן טמפרטורה

  //initDistanceSensor();//הגדרת פינים של  מרחק
  
  delay(200);

  xTaskCreate(
    readAllLM75Sensors,  // פונקציה שמוגדרת בטאב LM75
    "LM75Task",          // שם פנימי
    8192,                // גודל מחסנית (Stack)
    NULL,                // פרמטרים (לא צריך)
    1,                   // עדיפות
    NULL                 // מצביע לידית המשימה (לא דרוש כרגע)
  );

    xTaskCreate(
      TaskReadDistance,
      "Sensor1",
      4096,
      &sensor1,
      1,
      NULL);

  xTaskCreate(
    TaskReadDistance,
    "Sensor2",
    4096,
    &sensor2,
    1,
    NULL);
}

void loop() {
  if (lcd.touched()) {
    delay(10);
    lcd.readTouch();
    int x = lcd.xTouch;
    int y = lcd.yTouch;
    int8_t buttonNum = lcd.ButtonTouch(x, y);
    while (lcd.touched())
      ;
    delay(10);

    if (buttonNum == 10 && button1Visible) {
      button1Visible = false;
      sensor1Ready = false;
      lcd.fillRect(20, 20, 200, 40, BLACK);  // מוחק את הכפתור
    }

    if (buttonNum == 11 && button2Visible) {
      button2Visible = false;
      sensor2Ready = false;
      lcd.fillRect(20, 70, 200, 40, BLACK);  // מוחק את הכפתור
    }
  }
}



// const int SENSOR_SDA_PIN = 22;
// const int SENSOR_SCL_PIN = 21;

// // הפעלת חיישני טמפרטורה
// void setup() {
//   Serial.begin(9600);
//   Serial.println("--- מתחיל בדיקת חיישני טמפרטורה LM75 (0x48, 0x49, 0x4A) ---");

//   Wire.begin(SENSOR_SDA_PIN, SENSOR_SCL_PIN);
//   Serial.printf("אפיק I2C אותחל ב-SDA: %d, SCL: %d\n", SENSOR_SDA_PIN, SENSOR_SCL_PIN);
//   delay(100);
// }

// void loop() {
//   readAllLM75Sensors();
//   delay(1000);
// }
