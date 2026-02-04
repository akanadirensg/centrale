<template>
  <div>
    <!-- Header avec statistiques globales -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="stats-header" elevation="0">
          <v-card-text>
            <div class="d-flex align-center justify-space-between flex-wrap">
              <div>
                <h1 class="text-h4 font-weight-bold mb-2">
                  <v-icon size="36" color="primary" class="mr-2">mdi-view-dashboard</v-icon>
                  Tableau de bord météo
                </h1>
                <p class="text-subtitle-1 text-grey">
                  <v-icon small class="mr-1">mdi-update</v-icon>
                  Dernière mise à jour: {{ new Date().toLocaleString('fr-FR') }}
                </p>
              </div>
              <v-chip color="success" variant="flat" size="large">
                <v-icon left>mdi-check-circle</v-icon>
                {{ sondesStore.meteoData.length }} station(s) active(s)
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistiques rapides -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card temperature-card" elevation="3">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey-darken-1 mb-1">Température moyenne</div>
                <div class="text-h4 font-weight-bold">{{ averageTemp }}°C</div>
              </div>
              <v-avatar size="60" color="rgba(255, 107, 107, 0.1)">
                <v-icon size="32" color="temperature">mdi-thermometer</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card humidity-card" elevation="3">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey-darken-1 mb-1">Humidité moyenne</div>
                <div class="text-h4 font-weight-bold">{{ averageHumidity }}%</div>
              </div>
              <v-avatar size="60" color="rgba(78, 205, 196, 0.1)">
                <v-icon size="32" color="humidity">mdi-water-percent</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pressure-card" elevation="3">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey-darken-1 mb-1">Pression moyenne</div>
                <div class="text-h4 font-weight-bold">{{ averagePressure }} hPa</div>
              </div>
              <v-avatar size="60" color="rgba(149, 225, 211, 0.1)">
                <v-icon size="32" color="pressure">mdi-gauge</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card wind-card" elevation="3">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey-darken-1 mb-1">Vent moyen</div>
                <div class="text-h4 font-weight-bold">{{ averageWind }} km/h</div>
              </div>
              <v-avatar size="60" color="rgba(168, 230, 207, 0.1)">
                <v-icon size="32" color="wind">mdi-weather-windy</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sélection des mesures -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" class="measurement-selector">
          <v-card-title class="bg-primary text-white">
            <v-icon class="mr-2">mdi-tune</v-icon>
            Sélection des mesures à afficher
          </v-card-title>
          <v-card-text class="pa-6">
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                v-for="(m, index) in availableMeasurements"
                :key="index"
              >
                <v-checkbox
                  v-model="m.checked"
                  :label="m.label"
                  color="primary"
                  hide-details
                  density="comfortable"
                >
                  <template #prepend>
                    <v-icon :color="m.checked ? 'primary' : 'grey'" class="mr-2">
                      {{ getMeasurementIcon(m.key) }}
                    </v-icon>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Grid des cards stations -->
    <v-row v-if="sondesStore.meteoData.length > 0">
      <v-col
        v-for="(station, index) in sondesStore.meteoData"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <SensorCard :station="station" :selectedMeasurements="selectedMeasurements" />
      </v-col>
    </v-row>

    <!-- Message si aucune station -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="text-center pa-12" elevation="2">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">
            mdi-cloud-off-outline
          </v-icon>
          <h3 class="text-h5 mb-2">Aucune station active</h3>
          <p class="text-grey">
            Veuillez vérifier votre connexion ou vos endpoints de configuration
          </p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSondesStore } from '../stores/sondes'
import SensorCard from './SensorCard.vue'

const sondesStore = useSondesStore()

const availableMeasurements = ref([
  { label: 'Température', key: 'temperature', checked: true },
  { label: 'Pression', key: 'pressure', checked: true },
  { label: 'Humidité', key: 'humidity', checked: true },
  { label: 'Luminosité', key: 'luminosity', checked: false },
  { label: 'Orientation du vent', key: 'wind_heading', checked: false },
  { label: 'Vitesse moyenne du vent', key: 'wind_speed_avg', checked: false },
  { label: 'Vitesse max du vent', key: 'wind_speed_max', checked: false },
  { label: 'Vitesse min du vent', key: 'wind_speed_min', checked: false },
  { label: 'Pluie', key: 'rain', checked: false },
])

const selectedMeasurements = computed(() =>
  availableMeasurements.value.filter(m => m.checked).map(m => m.key)
)

// Statistiques calculées
const averageTemp = computed(() => {
  const temps = sondesStore.meteoData
    .map(s => s.measurements[0]?.value)
    .filter(v => v !== undefined && v !== '-')
  return temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '-'
})

const averageHumidity = computed(() => {
  const hums = sondesStore.meteoData
    .map(s => s.measurements[2]?.value)
    .filter(v => v !== undefined && v !== '-')
  return hums.length > 0 ? (hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(1) : '-'
})

const averagePressure = computed(() => {
  const press = sondesStore.meteoData
    .map(s => s.measurements[1]?.value)
    .filter(v => v !== undefined && v !== '-')
  return press.length > 0 ? (press.reduce((a, b) => a + b, 0) / press.length).toFixed(1) : '-'
})

const averageWind = computed(() => {
  const winds = sondesStore.meteoData
    .map(s => s.measurements[5]?.value)
    .filter(v => v !== undefined && v !== '-')
  return winds.length > 0 ? (winds.reduce((a, b) => a + b, 0) / winds.length).toFixed(1) : '-'
})

const getMeasurementIcon = (key) => {
  const icons = {
    temperature: 'mdi-thermometer',
    pressure: 'mdi-gauge',
    humidity: 'mdi-water-percent',
    luminosity: 'mdi-weather-sunny',
    wind_heading: 'mdi-compass',
    wind_speed_avg: 'mdi-weather-windy',
    wind_speed_max: 'mdi-weather-windy',
    wind_speed_min: 'mdi-weather-windy',
    rain: 'mdi-weather-rainy',
  }
  return icons[key] || 'mdi-chart-line'
}

watch(
  availableMeasurements,
  async (newVal) => {
    const selected = newVal.filter(m => m.checked).map(m => m.key)
    if (selected.length > 0) {
      await sondesStore.loadStations(selected)
    }
  },
  { deep: true, immediate: true } 
)

</script>

<style scoped>
.stats-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-left: 4px solid #2196F3;
}

.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.temperature-card {
  border-top: 4px solid #FF6B6B;
}

.humidity-card {
  border-top: 4px solid #4ECDC4;
}

.pressure-card {
  border-top: 4px solid #95E1D3;
}

.wind-card {
  border-top: 4px solid #A8E6CF;
}

.measurement-selector {
  border-radius: 16px;
  overflow: hidden;
}
</style>