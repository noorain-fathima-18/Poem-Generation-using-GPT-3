const express = require('express');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// API URL (change in production)
const API_URL = process.env.API_URL || 'http://localhost:8000';

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Poet\'s Palette',
    poem: null,
    error: null
  });
});

app.post('/generate', async (req, res) => {
  try {
    const { title, emotion, context, tone } = req.body;
    
    // Validate input
    if (!title || !emotion || !context || !tone) {
      return res.render('index', {
        title: 'Poet\'s Palette',
        poem: null,
        error: 'Please fill out all fields to generate a poem.',
        formData: req.body
      });
    }
    
    // Call the FastAPI backend
    const response = await axios.post(`${API_URL}/generate-poem`, {
      title,
      emotion,
      context,
      tone
    });
    
    // Render the page with the generated poem
    res.render('index', {
      title: 'Poet\'s Palette',
      poem: response.data.poem,
      error: null,
      formData: req.body
    });
  } catch (error) {
    console.error('Error generating poem:', error);
    res.render('index', {
      title: 'Poet\'s Palette',
      poem: null,
      error: 'An error occurred while generating the poem. Please try again.',
      formData: req.body
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
