const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

app.use(express.json());

const filepath = 'rentals.json';

// Crea el fichero si no existe
function ensureFileExists() {
  if (!fs.existsSync(filepath)) {
    const rentalsJSON = { rentals: [] };
    fs.writeFileSync(filepath, JSON.stringify(rentalsJSON, null, 2));
  }
}

// Lee alquileres del fichero
function readRentals() {
  ensureFileExists();
  const rawData = fs.readFileSync(filepath);
  return JSON.parse(rawData);
}

// Escribe alquileres al fichero
function writeRentals(data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// POST /rental -> guarda un alquiler y devuelve 201
app.post('/rental', (req, res) => {
  const { maker, model, days, units } = req.body;

  if (
    typeof maker !== 'string' ||
    typeof model !== 'string' ||
    typeof days !== 'number' ||
    typeof units !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid input.' });
  }

  const rentalsJSON = readRentals();

  const newRental = {
    maker: maker.trim(),
    model: model.trim(),
    days: days,
    units: units
  };

  rentalsJSON.rentals.push(newRental);
  writeRentals(rentalsJSON);

  res.status(201);
  return res.end();
});

// GET /rentals -> devuelve todos los alquileres
app.get('/rentals', (req, res) => {
  const rentalsJSON = readRentals();
  return res.json({ rentals: rentalsJSON.rentals });
});

app.listen(port, () => {
  console.log(`PTI HTTP Server listening at http://localhost:${port}`);
});
