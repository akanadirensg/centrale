<script setup>
import { computed } from 'vue'
import { VCard, VCardTitle, VCardText, VRow, VCol, VDivider, VIcon } from 'vuetify/components'

const props = defineProps({
  station: {
    type: Object,
    required: true
  },
  selectedMeasurements: {
    type: Array,
    default: () => ['temperature', 'humidity', 'pressure']
  }
})

// Map dynamique pour toutes les mesures
const measurementsMap = computed(() => {
  const map = {}
  const keys = [
    'temperature',
    'pressure',
    'humidity',
    'luminosity',
    'wind_heading',
    'wind_speed_avg',
    'wind_speed_max',
    'wind_speed_min',
    'rain'
  ]

  keys.forEach((key, index) => {
    map[key] = props.station.measurements[index] || { value: '-', unit: '' }
  })
  return map
})

// Icônes dynamiques pour chaque type de mesure
const iconMap = {
  temperature: { icon: 'mdi-thermometer', color: 'red' },
  pressure: { icon: 'mdi-gauge', color: 'green' },
  humidity: { icon: 'mdi-water-percent', color: 'blue' },
  luminosity: { icon: 'mdi-weather-sunny', color: 'orange' },
  wind_heading: { icon: 'mdi-compass', color: 'purple' },
  wind_speed_avg: { icon: 'mdi-weather-windy', color: 'teal' },
  wind_speed_max: { icon: 'mdi-weather-windy', color: 'cyan' },
  wind_speed_min: { icon: 'mdi-weather-windy', color: 'light-blue' },
  rain: { icon: 'mdi-weather-rainy', color: 'indigo' },
}
</script>

<template>
  <v-card elevation="6" class="pa-4 hover-card">
    <v-card-title class="justify-space-between">
      <span class="text-h6">Station</span>
      <span class="text-subtitle-2 grey--text">
        {{ station.location.lat.toFixed(4) }}, {{ station.location.long.toFixed(4) }}
      </span>
    </v-card-title>
    <v-divider class="my-2"></v-divider>
    <v-card-text>
      <p class="text-subtitle-2 mb-3">
        <v-icon left>mdi-calendar</v-icon>
        {{ new Date(station.date).toLocaleString() }}
      </p>

      <v-row class="text-center">
        <v-col
          v-for="key in selectedMeasurements"
          :key="key"
          cols="4"
        >
          <v-icon :color="iconMap[key].color" size="36">{{ iconMap[key].icon }}</v-icon>
          <div class="text-subtitle-1 font-medium">{{ measurementsMap[key].value }} {{ measurementsMap[key].unit }}</div>
          <div class="caption grey--text">{{ key.replace('_', ' ').toUpperCase() }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
</style>
