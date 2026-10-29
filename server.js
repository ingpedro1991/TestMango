require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Importamos los datos mockeados desde el archivo JSON
const rangeData = require('./src/infrastructure/persistence/ranges.json');

// Obtenemos los orígenes permitidos desde el .env y los convertimos en un array
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:8080'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por la política de seguridad CORS (Origen no autorizado)'));
    }
  },
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Ejercicio 1: Rango continuo
app.get('/api/range-normal', (req, res) => {
  res.json(rangeData.normal);
});

// Ejercicio 2: Rango fijo
app.get('/api/range-fixed', (req, res) => {
  res.json(rangeData.fixed);
});

app.listen(PORT, () => {
  console.log(`Servidor de API Mock seguro corriendo en http://localhost:${PORT}`);
});