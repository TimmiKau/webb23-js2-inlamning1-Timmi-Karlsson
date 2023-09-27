const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.json())

//read HighscoreData function
function readHighscoreData() {
  const filePath = 'C:/Users/Timmi/Desktop/Uppgift 1 - Javascript 2/backend/data/highscore.json'
  
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading highscore data:', error)
    return []
  }
}

app.post('/api/updateHighscore', (req, res) => {
  let newScoreData = req.body;
  
  const filePath = path.join(__dirname, 'data', 'highscore.json');
  if (fs.existsSync(filePath)) {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      let scoreBoardData = JSON.parse(fileData);

      //Add to the array
      scoreBoardData.push(newScoreData);

      //Sort
      scoreBoardData.sort((a, b) => b.score - a.score);

      //Remove the more then 5
      const updatedScoreboard = scoreBoardData.slice(0, 5);

      // Save to highscore
      fs.writeFileSync(filePath, JSON.stringify(updatedScoreboard), 'utf8');
      
      res.json({ message: 'Scoreboard updated successfully' });
    } catch (error) {
      console.error('Error updating highscore data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(404).json({ error: 'File not found' });
  }
})


//fetching scoreboard data
app.get('/api/scoreboard', (req, res) => {
  const scoreBoardData = readHighscoreData()
  res.json(scoreBoardData)
});

// static files 'frontend'
app.use(express.static(path.join(__dirname, '..', 'frontend')))

//Start the index.html 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'src', 'index.html'))
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});