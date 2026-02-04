<script setup>
import { computed } from 'vue'

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

// Icônes et couleurs dynamiques
const iconMap = {
  temperature: { icon: 'mdi-thermometer', color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' },
  pressure: { icon: 'mdi-gauge', color: '#95E1D3', gradient: 'linear-gradient(135deg, #95E1D3 0%, #38EF7D 100%)' },
  humidity: { icon: 'mdi-water-percent', color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4 0%, #556FFF 100%)' },
  luminosity: { icon: 'mdi-white-balance-sunny', color: '#FFD93D', gradient: 'linear-gradient(135deg, #FFD93D 0%, #FFA45B 100%)' },
  wind_heading: { icon: 'mdi-compass-outline', color: '#A8E6CF', gradient: 'linear-gradient(135deg, #A8E6CF 0%, #81C784 100%)' },
  wind_speed_avg: { icon: 'mdi-weather-windy', color: '#81D4FA', gradient: 'linear-gradient(135deg, #81D4FA 0%, #4FC3F7 100%)' },
  wind_speed_max: { icon: 'mdi-weather-windy', color: '#64B5F6', gradient: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)' },
  wind_speed_min: { icon: 'mdi-weather-windy', color: '#90CAF9', gradient: 'linear-gradient(135deg, #90CAF9 0%, #64B5F6 100%)' },
  rain: { icon: 'mdi-weather-pouring', color: '#5DADE2', gradient: 'linear-gradient(135deg, #5DADE2 0%, #3498DB 100%)' },
}

const getLabel = (key) => {
  const labels = {
    temperature: 'Température',
    pressure: 'Pression',
    humidity: 'Humidité',
    luminosity: 'Luminosité',
    wind_heading: 'Direction vent',
    wind_speed_avg: 'Vent moy.',
    wind_speed_max: 'Vent max.',
    wind_speed_min: 'Vent min.',
    rain: 'Pluie',
  }
  return labels[key] || key
}
</script>

<template>
  <v-card elevation="4" class="station-card">
    <!-- En-tête de la carte -->
    <div class="card-header">
      <div class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="40" class="mr-3">
            <v-icon color="white" size="24">mdi-map-marker</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">Station météo</div>
            <div class="text-caption text-grey">
              {{ station.location.lat.toFixed(4) }}°N, {{ station.location.long.toFixed(4) }}°E
            </div>
          </div>
        </div>
        <v-chip color="success" size="small" variant="flat">
          <v-icon left size="16">mdi-circle</v-icon>
          Live
        </v-chip>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Date et heure -->
    <v-card-text class="pb-2">
      <div class="d-flex align-center text-caption text-grey mb-4">
        <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
        {{ new Date(station.date).toLocaleString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) }}
      </div>

      <!-- Mesures -->
      <v-row dense>
        <v-col
          v-for="key in selectedMeasurements"
          :key="key"
          cols="6"
          sm="4"
        >
          <div class="measurement-item">
            <div class="measurement-icon-wrapper" :style="{ background: iconMap[key].gradient }">
              <v-icon color="white" size="28">{{ iconMap[key].icon }}</v-icon>
            </div>
            <div class="mt-2">
              <div class="text-h5 font-weight-bold">
                {{ measurementsMap[key].value }}
                <span class="text-subtitle-2">{{ measurementsMap[key].unit }}</span>
              </div>
              <div class="text-caption text-grey">{{ getLabel(key) }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Footer avec actions -->
    <v-divider></v-divider>

  </v-card>
</template>

<style scoped>
.station-card {
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);
}

.station-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(33, 150, 243, 0.2) !important;
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.measurement-item {
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.measurement-item:hover {
  background: #e3f2fd;
  transform: scale(1.05);
}

.measurement-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.measurement-item:hover .measurement-icon-wrapper {
  transform: rotate(5deg) scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
</style>