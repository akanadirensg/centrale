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
      const endpoints = [
        import.meta.env.VITE_METEO_ENDPOINT,
      ]

      const endpointsWithMeasures = endpoints.map(
        ep => `${ep.replace(/\/$/, '')}/meteo/v1/live/?data=${selectedMeasurements.join(',')}`
      )

      const results = await Promise.all(
        endpointsWithMeasures.map(fetchStationData)
      )

      console.log(results)

      // Filtrer les réponses avec erreur
      const validResults = results.filter(
        r => r && !('error_code' in r)
      )

      if (validResults.length === 0) {
        console.warn("Aucune donnée valide reçue pour les stations live")
        this.sondes = []
        this.locations = []
        this.meteoData = []
        return
      }

      this.sondes = validResults
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
        import.meta.env.VITE_METEO_ENDPOINT,
      ]

      const results = await Promise.all(
        endpoints.map(ep => {
          const url = `${ep.replace(/\/$/, '')}/meteo/v1/archive?start=${startTimestamp}&end=${endTimestamp}`
          return fetchStationData(url)
        })
      )

      // Filtrer les réponses avec erreur
      const validResults = results.filter(res => res && !('error_code' in res) && res.data)

      if (validResults.length === 0) {
        console.warn("Aucune donnée valide reçue pour l'archive")
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
