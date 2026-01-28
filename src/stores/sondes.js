import { defineStore } from 'pinia'
import { fetchStationData, fetchStationLocation } from '../api/sondes'

export const useSondesStore = defineStore('sondes', {
  state: () => ({
    sondes: [],
    locations: []
  }),
  actions: {
    async loadStations(endpoints) {
      const results = await Promise.all(
        endpoints.map(fetchStationData)
      )
      this.sondes = results.filter(r => r !== null)
      this.locations = this.sondes.map(s => s.data.location)
    },

    async loadLocationsOnly(endpoints) {
      const results = await Promise.all(
        endpoints.map(fetchStationLocation)
      )
      this.locations = results.filter(loc => loc !== null)
    }
  }
})
