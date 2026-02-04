const fs = require('fs')

// Générer des données historiques plus réalistes
function generateRealisticData() {
  const sondes = [
    {
      id: 1,
      name: "Sonde Campus ENSG",
      location: { lat: 48.8413, long: 2.5877 },
      active: true,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 2,
      name: "Sonde Paris Centre",
      location: { lat: 48.8566, long: 2.3522 },
      active: true,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 3,
      name: "Sonde Versailles",
      location: { lat: 48.8049, long: 2.1204 },
      active: true,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 4,
      name: "Sonde Disneyland",
      location: { lat: 48.8675, long: 2.7843 },
      active: false,
      lastUpdate: new Date().toISOString()
    }
  ]

  const live_data = sondes.filter(s => s.active).map(sonde => ({
    sondeId: sonde.id,
    data: {
      date: new Date().toISOString(),
      location: sonde.location,
      measurements: generateMeasurements()
    }
  }))

  const db = {
    sondes,
    live_data,
    archive_data: []
  }

  fs.writeFileSync('db.json', JSON.stringify(db, null, 2))
  console.log('✅ Database generated successfully!')
}

function generateMeasurements() {
  const hour = new Date().getHours()
  
  // Température varie selon l'heure de la journée
  const baseTemp = 15 + Math.sin((hour - 6) * Math.PI / 12) * 8
  
  return {
    temperature: {
      unit: "°C",
      value: parseFloat((baseTemp + (Math.random() - 0.5) * 2).toFixed(1))
    },
    humidity: {
      unit: "%",
      value: parseFloat((65 + (Math.random() - 0.5) * 20).toFixed(1))
    },
    pressure: {
      unit: "hPa",
      value: parseFloat((1013 + (Math.random() - 0.5) * 15).toFixed(1))
    },
    rain: {
      unit: "mm",
      value: parseFloat((Math.random() * 0.5).toFixed(1))
    },
    luminosity: {
      unit: "lux",
      value: parseFloat((Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 50000 + (Math.random() - 0.5) * 10000)).toFixed(0))
    },
    windSpeed: {
      unit: "km/h",
      value: parseFloat((5 + Math.random() * 15).toFixed(1))
    },
    windDirection: {
      unit: "°",
      value: parseFloat((Math.random() * 360).toFixed(0))
    }
  }
}

generateRealisticData()