import { defineStore } from 'pinia'
import { fetchStationData } from '@/api/sondes'


export const useSondesStore = defineStore('sondes', {
  state: () => ({
    sondes: [],
    locations: [],
    meteoData: [],
    archiveData: []
  }),
  actions: {
    // Charger les stations live
    async loadStations(selectedMeasurements = ['temperature']) {
      // Construire les endpoints à partir des variables d'environnement
      const endpoints = [
        import.meta.env.VITE_METEO_ENDPOINT_1,
        import.meta.env.VITE_METEO_ENDPOINT_2,
        import.meta.env.VITE_METEO_ENDPOINT_3
      ]

      const endpointsWithMeasures = endpoints.map(
        ep => `${ep.replace(/\/$/, '')}/meteo/v1/live/?data=${selectedMeasurements.join(',')}`
      )

      const results = await Promise.all(endpointsWithMeasures.map(fetchStationData))

      this.sondes = results.filter(r => r !== null)
      this.locations = this.sondes.map(s => s.data.location)

      this.meteoData = this.sondes.map(s => ({
        date: s.data.date,
        location: s.data.location,
        measurements: Object.values(s.data.measurements)
      }))
    },

    // Charger les archives
    async loadArchive(startTimestamp, endTimestamp) {
      const endpoints = [
        import.meta.env.VITE_METEO_ENDPOINT_1,
        import.meta.env.VITE_METEO_ENDPOINT_2,
        import.meta.env.VITE_METEO_ENDPOINT_3
      ]

      const results = await Promise.all(
        endpoints.map(ep => {
          const url = `${ep.replace(/\/$/, '')}/meteo/v1/archive?start=${startTimestamp}&end=${endTimestamp}`
          return fetchStationData(url)
        })
      )

      const validResults = results.filter(res => res && res.data)

      if (validResults.length === 0) {
        console.warn("Aucune donnée reçue pour l'archive")
        this.archiveData = []
        return
      }

      this.archiveData = validResults.flatMap(res =>
        res.data.map(row => {
          const obj = {}
          res.legend.forEach((key, index) => {
            obj[key] = row[index]
          })
          return obj
        })
      )
    }
  }
})
