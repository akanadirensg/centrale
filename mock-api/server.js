const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()




// Fonction pour générer des données aléatoires
function generateRandomValue(base, variance) {
  return base + (Math.random() - 0.5) * variance * 2
}

// Fonction pour générer des données live
function generateLiveData(sondeId, location) {
  const now = new Date().toISOString()
  
  return {
    sondeId,
    data: {
      date: now,
      location: location,
      measurements: {
        temperature: {
          unit: "°C",
          value: parseFloat(generateRandomValue(18, 5).toFixed(1))
        },
        humidity: {
          unit: "%",
          value: parseFloat(generateRandomValue(65, 15).toFixed(1))
        },
        pressure: {
          unit: "hPa",
          value: parseFloat(generateRandomValue(1013, 10).toFixed(1))
        },
        rain: {
          unit: "mm",
          value: parseFloat(generateRandomValue(0.2, 0.3).toFixed(1))
        },
        luminosity: {
          unit: "lux",
          value: parseFloat(generateRandomValue(45000, 15000).toFixed(0))
        },
        windSpeed: {
          unit: "km/h",
          value: parseFloat(generateRandomValue(12, 8).toFixed(1))
        },
        windDirection: {
          unit: "°",
          value: parseFloat(generateRandomValue(180, 180).toFixed(0))
        }
      }
    }
  }
}

// Fonction pour générer des données d'archive
// function generateArchiveData(start, end, location) {
//   const legend = ["time", "lat", "long", "temperature", "humidity", "pressure", "rain", "luminosity", "windSpeed", "windDirection"]
//   const unit = ["ISO8601", "°", "°", "°C", "%", "hPa", "mm", "lux", "km/h", "°"]
//   const data = []
  
//   const startTime = start * 1000
//   const endTime = end * 1000
//   const interval = 3600000 // 1 heure en millisecondes
  
//   for (let timestamp = startTime; timestamp <= endTime; timestamp += interval) {
//     const date = new Date(timestamp).toISOString()
    
//     data.push([
//       date,
//       location.lat,
//       location.long,
//       parseFloat(generateRandomValue(18, 5).toFixed(1)),
//       parseFloat(generateRandomValue(65, 15).toFixed(1)),
//       parseFloat(generateRandomValue(1013, 10).toFixed(1)),
//       parseFloat(generateRandomValue(0.2, 0.3).toFixed(1)),
//       parseFloat(generateRandomValue(45000, 15000).toFixed(0)),
//       parseFloat(generateRandomValue(12, 8).toFixed(1)),
//       parseFloat(generateRandomValue(180, 180).toFixed(0))
//     ])
//   }
  
//   return {
//     legend,
//     unit,
//     data
//   }
// }
function generateArchiveData(start, end, location) {
  const legend = [
    "time",
    "lat",
    "long",
    "temperature",
    "humidity",
    "pressure",
    "rain",
    "luminosity",
    "windSpeed",
    "windDirection"
  ]

  const unit = [
    "ISO8601",
    "°",
    "°",
    "°C",
    "%",
    "hPa",
    "mm",
    "lux",
    "km/h",
    "°"
  ]

  const data = []

  const startTime = start * 1000
  const endTime = end * 1000

  const POINTS = 25
  const interval = (endTime - startTime) / (POINTS - 1)

  for (let i = 0; i < POINTS; i++) {
    const timestamp = startTime + i * interval
    const date = new Date(timestamp).toISOString()

    data.push([
      date,
      location.lat,
      location.long,
      parseFloat(generateRandomValue(18, 5).toFixed(1)),
      parseFloat(generateRandomValue(65, 15).toFixed(1)),
      parseFloat(generateRandomValue(1013, 10).toFixed(1)),
      parseFloat(generateRandomValue(0.2, 0.3).toFixed(1)),
      parseFloat(generateRandomValue(45000, 15000).toFixed(0)),
      parseFloat(generateRandomValue(12, 8).toFixed(1)),
      parseFloat(generateRandomValue(180, 180).toFixed(0))
    ])
  }

  return {
    legend,
    unit,
    data
  }
}


// Middleware pour ajouter les headers CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

server.use(middlewares)
server.use(jsonServer.bodyParser)



// Route personnalisée pour /meteo/v1/live
server.get('/meteo/v1/live', (req, res) => {
  try {
    const db = router.db.value()
    const live = db.live_data

    if (!req.query.data) {
      return res.json({ data: live })
    }

    const requested = req.query.data.split(',').map(p => p.trim())
    const available = live.measurements

    const filtered = {}

    requested.forEach(param => {
      if (!available[param]) {
        return res.status(400).json({
          error_code: 400,
          error_message: "Invalid query parameter"
        })
      }
      filtered[param] = available[param]
    })

    return res.json({
      data: {
        date: live.date,
        location: live.location,
        measurements: filtered
      }
    })
  } catch (e) {
    return res.status(500).json({
      error_code: 500,
      error_message: "Internal server error"
    })
  }
})


// Route personnalisée pour /meteo/v1/archive
server.get('/meteo/v1/archive', (req, res) => {
  const { start, end, sondeId } = req.query

  if (!start || !end) {
    return res.status(400).json({
      error_code: 400,
      error_message: "Missing required parameters: start and end"
    })
  }

  const db = router.db
  const sondes = db.get('sondes').value()

  let sonde

  if (sondeId) {
    sonde = sondes.find(s => s.id === parseInt(sondeId))
    if (!sonde) {
      return res.status(404).json({
        error_code: 404,
        error_message: "Sonde not found"
      })
    }
  } else {
    sonde = sondes[0]
    if (!sonde) {
      return res.status(404).json({
        error_code: 404,
        error_message: "No sondes available"
      })
    }
  }

  const archive = generateArchiveData(
    parseInt(start),
    parseInt(end),
    sonde.location
  )

  return res.json({
    legend: archive.legend,
    unit: archive.unit,
    data: archive.data
  })
})



// Route pour obtenir toutes les sondes
server.get('/sondes', (req, res) => {
  const db = router.db
  const sondes = db.get('sondes').value()
  res.json(sondes)
})

// Route pour obtenir une sonde spécifique
server.get('/sondes/:id', (req, res) => {
  const db = router.db
  const sonde = db.get('sondes').find({ id: parseInt(req.params.id) }).value()
  
  if (!sonde) {
    return res.status(404).json({ error_code: 404, error_message: "Sonde not found" })
  }
  
  res.json(sonde)
})

// Utiliser le router par défaut pour les autres routes
server.use(router)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})
