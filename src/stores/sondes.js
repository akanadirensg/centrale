import { defineStore } from 'pinia'

// Fonction générique pour fetcher une API
async function fetchStationData(endpoint) {
  try {
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Erreur fetch station', err)
    return null
  }
}
export const useSondesStore = defineStore('sondes', {
  state: () => ({
    sondes: [],
    locations: [],
    meteoData: [],
    archiveData: [] // nouvelle propriété pour stocker l’archive
  }),
  actions: {
    async loadStations(endpoints, selectedMeasurements = ['temperature']) {
      const endpointsWithMeasures = endpoints.map(
        ep => `${ep.split('?')[0]}?data=${selectedMeasurements.join(',')}`
      )

      const results = await Promise.all(
        endpointsWithMeasures.map(fetchStationData)
      )

      this.sondes = results.filter(r => r !== null)
      this.locations = this.sondes.map(s => s.data.location)

      this.meteoData = this.sondes.map(s => ({
        date: s.data.date,
        location: s.data.location,
        measurements: Object.values(s.data.measurements)
      }))
    },

    // Nouvelle action pour fetcher les données d'archive
async loadArchive(startTimestamp, endTimestamp) {
  const url = `http://localhost:3000/meteo/v1/archive?start=${startTimestamp}&end=${endTimestamp}`
  console.log(url)
  const res = await fetchStationData(url)
  console.log(res)
  if (!res || !res.data) {
    console.warn("Aucune donnée reçue pour l'archive")
    this.archiveData = []
    return
  }
  

  // Transforme chaque ligne de data en objet {colonne: valeur}
  this.archiveData = res.data.map(row => {
    const obj = {}
    res.legend.forEach((key, index) => {
      obj[key] = row[index]
    })
    return obj
  })
}

  }
})
