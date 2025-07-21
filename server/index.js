const express = require('express');
const saveRoute = require('./saveToCSV');
const cors = require('cors'); // אם את ניגשת מה-React

const app = express();
app.use(cors());
app.use(express.json()); // מאפשר לקבל JSON בבקשות POST

app.use('/api', saveRoute); // כל מה שקשור ל-CSV

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
