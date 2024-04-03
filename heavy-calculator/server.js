require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 9876;
const testServerUrl = process.env.TEST_SERVER_URL;

app.use(express.json());

const registrationDetails = {
  companyName: "HeavyCalculato",
  ownerName: "ARPIT SAGAR",
  rollNo: "RA2111028010180",
  ownerEmail: "am7136@srmist.edu.in",
  accessCode: "bntKpm"
};

const credentials = {
  clientID: "f94eab4f-cf57-4423-814b-cbfdad181bbb",
  clientSecret: "HRNvtLlNkMkkaUZa"
};

// Register with the test server
app.post('/register', async (req, res) => {
  try {
    const response = await axios.post('${testServerUrl}/register, registrationDetails');
    credentials.clientID = response.data.clientID;
    credentials.clientSecret = response.data.clientSecret;
    console.log('Registration successful:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).send('Registration failed');
  }
});

// Get authorization token
app.post('/auth', async (req, res) => {
  try {
    const response = await axios.post('${testServerUrl}/auth, credentials');
    const authToken = response.data['access_token'];
    console.log('Authorization token received:', authToken);
    res.json({ authToken });
  } catch (error) {
    console.error('Authorization failed:', error);
    res.status(500).send('Authorization failed');
  }
});

const windowSize = 10;
let numberWindow = [];

// Helper function to get numbers from the test server
const getNumbersFromTestServer = async (type) => {
  try {
    const response = await axios.get('${testServerUrl}/${type}');
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers from test server:', error);
    return null;
  }
};

// Middleware to calculate the average
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length || 0;
};

// Numbers endpoint
app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;
  const validIds = ['p', 'f', 'e', 'r']; // 'p' for primes, 'f' for fibonacci, etc.
  
  if (!validIds.includes(numberId)) {
    return res.status(400).send({ error: 'Invalid numberId provided' });
  }

  const numbers = await getNumbersFromTestServer(numberId);
  
  if (!numbers) {
    return res.status(500).send({ error: 'Failed to retrieve numbers' });
  }

  const uniqueNumbers = [...new Set(numbers)].sort((a, b) => a - b);

  const prevWindow = [...numberWindow];
  uniqueNumbers.forEach((num) => {
    if (numberWindow.length >= windowSize) {
      numberWindow.shift(); 
    }
    numberWindow.push(num);
  });

  const avg = calculateAverage(numberWindow);

  res.send({
    windowPrevState: prevWindow,
    windowCurrState: numberWindow,
    avg
  });
});

app.listen(port, () => {
  console.log('Server running on port ${port}');
});