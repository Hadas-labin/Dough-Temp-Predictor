


extern tft9341touch lcd;
extern bool sensor1Ready;
extern bool sensor2Ready;
extern bool button1Visible;
extern bool button2Visible;

// void initDistanceSensor() {//מגדירים את הפינים
//   pinMode(trig, OUTPUT);//פלט
//   pinMode(echo, INPUT);//קלט
//   pinMode(trig1, OUTPUT);//פלט
//   pinMode(echo1, INPUT);//קלט
// }

// קריאת מרחק בס"מ
long readDistanceCM(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);   //שולח מתח נמוך לבדיקה אם הקו נקי ואפשר לתקשר עם החיישן
  delayMicroseconds(2);         // מחכה 2 מיקרו־שניות כדי לתת לLOW להתייצב לפני הפולס האמיתי
  digitalWrite(trigPin, HIGH);  // שולחת פולס להפעלת החיישן שיתחיל לבדוק מרחק
  delayMicroseconds(10);        //מחכה 10 מיקרו־שניות שהפולס ישאר תקין
  //ה משך הזמן שהחיישן צריך כדי לזהות את הפולס ולהפעיל את שליחת האולטרסוניק.
  digitalWrite(trigPin, LOW);  //מחזיר את הטריג למצב LPW שיתחיל למדוד את הנוסחה

  long duration = pulseIn(echoPin, HIGH);
  long distance = duration / 29 / 2;
  return distance;
}

void TaskReadDistance(void* pvParameters) {
  DistanceSensorConfig* config = (DistanceSensorConfig*)pvParameters;
  pinMode(config->trigPin, OUTPUT);  // עדיין לוודא שזה מחוץ ללולאה
  pinMode(config->echoPin, INPUT);   // עדיין לוודא שזה מחוץ ללולאה

  while (1) {
    long distance = readDistanceCM(config->trigPin, config->echoPin);
    Serial.printf("📏 %s: %ld ס״מ\n", config->name, distance);

    int strcmp_result_sensor1 = strcmp(config->name, "sensor1"); 
    int strcmp_result_sensor2 = strcmp(config->name, "sensor2");
    
    Serial.printf("DEBUG strcmp: config->name is '%s'\n", config->name);
    Serial.printf("DEBUG strcmp: result for 'sensor1' comparison: %d\n", strcmp_result_sensor1);
    Serial.printf("DEBUG strcmp: result for 'sensor2' comparison: %d\n", strcmp_result_sensor2);

    // --- הוסף את שורות הבדיקה האלה ---
    Serial.printf("DEBUG for %s: distance=%ld, sensorReady=%d, strcmp_result=%d\n", 
                  config->name, 
                  distance, 
                  (strcmp(config->name, "Sensor1") == 0 ? sensor1Ready : sensor2Ready), // מדפיס את המצב הנכון של ה-Ready
                  strcmp(config->name, "Sensor1") == 0 ? strcmp(config->name, "Sensor1") : strcmp(config->name, "Sensor2"));
    // ------------------------------------

    if (distance < 30 && !sensor1Ready && strcmp_result_sensor1 == 0) {
      Serial.println("Sensor 1 condition met, displaying button."); // הדפסת בדיקה
      sensor1Ready = true;
      button1Visible = true;
      lcd.drawButton(10, 20, 20, 200, 40, 5, YELLOW, RED, (char*)"Sensor 1 Ready", 2);
    }

    if (distance < 30 && !sensor2Ready && strcmp_result_sensor2 == 0) {
      Serial.println("Sensor 2 condition met, displaying button."); // הדפסת בדיקה
      sensor2Ready = true;
      button2Visible = true;
      lcd.drawButton(11, 20, 70, 200, 40, 5, GREEN, BLUE, (char*)"Sensor 2 Ready", 2);
    }

    vTaskDelay(pdMS_TO_TICKS(300));
  }
}
