<script setup>
import { ref, computed } from 'vue'
import { useSondesStore } from '../stores/sondes'

const sondesStore = useSondesStore()

const startDate = ref('')
const endDate = ref('')
const loading = ref(false)
const showChart = ref(false)
const selectedMetric = ref('temperature')

const columns = computed(() => {
  if (sondesStore.archiveData.length === 0) return []
  return Object.keys(sondesStore.archiveData[0]).map(key => ({
    title: key.toUpperCase(),
    key,
    sortable: true
  }))
})

// Données pour les graphiques
const chartData = computed(() => {
  if (sondesStore.archiveData.length === 0) return []
  
  return sondesStore.archiveData.map(item => ({
    time: new Date(item.time).getTime(),
    temperature: item.temperature || 0,
    humidity: item.humidity || 0,
    pressure: item.pressure || 0,
    rain: item.rain || 0,
    windSpeed: item.windSpeed || 0,
  }))
})

// Statistiques calculées
const statistics = computed(() => {
  if (sondesStore.archiveData.length === 0) return null
  
  const temps = sondesStore.archiveData.map(d => d.temperature).filter(v => v !== undefined)
  const hums = sondesStore.archiveData.map(d => d.humidity).filter(v => v !== undefined)
  const press = sondesStore.archiveData.map(d => d.pressure).filter(v => v !== undefined)
  
  return {
    temperature: {
      avg: temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '-',
      min: temps.length > 0 ? Math.min(...temps).toFixed(1) : '-',
      max: temps.length > 0 ? Math.max(...temps).toFixed(1) : '-',
    },
    humidity: {
      avg: hums.length > 0 ? (hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(1) : '-',
      min: hums.length > 0 ? Math.min(...hums).toFixed(1) : '-',
      max: hums.length > 0 ? Math.max(...hums).toFixed(1) : '-',
    },
    pressure: {
      avg: press.length > 0 ? (press.reduce((a, b) => a + b, 0) / press.length).toFixed(1) : '-',
      min: press.length > 0 ? Math.min(...press).toFixed(1) : '-',
      max: press.length > 0 ? Math.max(...press).toFixed(1) : '-',
    }
  }
})

// Fonction pour normaliser les données pour le graphique
const normalizeData = (data, key) => {
  if (data.length === 0) return []
  
  const values = data.map(d => d[key])
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  
  return data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d[key] - min) / range) * 100,
    value: d[key],
    time: d.time
  }))
}

// Générer le path SVG
const generatePath = computed(() => {
  const normalized = normalizeData(chartData.value, selectedMetric.value)
  if (normalized.length === 0) return ''
  
  let path = `M ${normalized[0].x} ${normalized[0].y}`
  for (let i = 1; i < normalized.length; i++) {
    path += ` L ${normalized[i].x} ${normalized[i].y}`
  }
  return path
})

// Générer le path de l'aire sous la courbe
const generateAreaPath = computed(() => {
  const normalized = normalizeData(chartData.value, selectedMetric.value)
  if (normalized.length === 0) return ''
  
  let path = `M ${normalized[0].x} ${normalized[0].y}`
  for (let i = 1; i < normalized.length; i++) {
    path += ` L ${normalized[i].x} ${normalized[i].y}`
  }
  path += ` L ${normalized[normalized.length - 1].x} 100`
  path += ` L ${normalized[0].x} 100 Z`
  return path
})

// Configuration des métriques
const metrics = [
  { key: 'temperature', label: 'Température', color: '#FF6B6B', unit: '°C' },
  { key: 'humidity', label: 'Humidité', color: '#4ECDC4', unit: '%' },
  { key: 'pressure', label: 'Pression', color: '#95E1D3', unit: 'hPa' },
  { key: 'windSpeed', label: 'Vitesse du vent', color: '#A8E6CF', unit: 'km/h' },
  { key: 'rain', label: 'Pluie', color: '#5DADE2', unit: 'mm' },
]

const currentMetric = computed(() => {
  return metrics.find(m => m.key === selectedMetric.value) || metrics[0]
})

const fetchArchive = async () => {
  if (!startDate.value || !endDate.value) {
    alert('Veuillez choisir les deux dates !')
    return
  }

  loading.value = true
  const startTimestamp = Math.floor(new Date(startDate.value).getTime() / 1000)
  const endTimestamp = Math.floor(new Date(endDate.value).getTime() / 1000)

  await sondesStore.loadArchive(startTimestamp, endTimestamp)
  loading.value = false
  showChart.value = sondesStore.archiveData.length > 0
}

const exportCSV = () => {
  if (sondesStore.archiveData.length === 0) return
  
  const headers = Object.keys(sondesStore.archiveData[0])
  const csv = [
    headers.join(','),
    ...sondesStore.archiveData.map(row => 
      headers.map(h => row[h]).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `meteo-historique-${Date.now()}.csv`
  a.click()
}
</script>

<template>
  <div>
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="history-header" elevation="0">
          <v-card-text>
            <div class="d-flex align-center justify-space-between flex-wrap">
              <div>
                <h1 class="text-h4 font-weight-bold mb-2">
                  <v-icon size="36" color="warning" class="mr-2">mdi-chart-line</v-icon>
                  Historique des mesures
                </h1>
                <p class="text-subtitle-1 text-grey">
                  Analysez les données historiques de vos stations météo
                </p>
              </div>
              <v-btn
                v-if="sondesStore.archiveData.length > 0"
                color="success"
                variant="flat"
                @click="exportCSV"
                prepend-icon="mdi-download"
              >
                Exporter CSV
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sélection de période -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="4" class="date-selector">
          <v-card-title class="bg-gradient-warning text-white">
            <v-icon class="mr-2">mdi-calendar-range</v-icon>
            Sélection de la période
          </v-card-title>
          <v-card-text class="pa-6">
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="startDate"
                  label="Date de début"
                  type="datetime-local"
                  variant="outlined"
                  color="warning"
                  prepend-inner-icon="mdi-calendar-start"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="endDate"
                  label="Date de fin"
                  type="datetime-local"
                  variant="outlined"
                  color="warning"
                  prepend-inner-icon="mdi-calendar-end"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-btn
                  color="warning"
                  size="large"
                  block
                  @click="fetchArchive"
                  :loading="loading"
                  prepend-icon="mdi-magnify"
                >
                  Charger l'historique
                </v-btn>
              </v-col>
            </v-row>

            <!-- Raccourcis de dates -->
            <v-row class="mt-4">
              <v-col cols="12">
                <div class="text-caption text-grey mb-2">Raccourcis:</div>
                <v-chip-group>
                  <v-chip
                    size="small"
                    variant="outlined"
                    @click="() => {
                      const now = new Date()
                      const yesterday = new Date(now - 24 * 60 * 60 * 1000)
                      startDate = yesterday.toISOString().slice(0, 16)
                      endDate = now.toISOString().slice(0, 16)
                    }"
                  >
                    Dernières 24h
                  </v-chip>
                  <v-chip
                    size="small"
                    variant="outlined"
                    @click="() => {
                      const now = new Date()
                      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
                      startDate = weekAgo.toISOString().slice(0, 16)
                      endDate = now.toISOString().slice(0, 16)
                    }"
                  >
                    Dernière semaine
                  </v-chip>
                  <v-chip
                    size="small"
                    variant="outlined"
                    @click="() => {
                      const now = new Date()
                      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
                      startDate = monthAgo.toISOString().slice(0, 16)
                      endDate = now.toISOString().slice(0, 16)
                    }"
                  >
                    Dernier mois
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Graphique -->
    <v-row v-if="showChart && chartData.length > 0" class="mb-6">
      <v-col cols="12">
        <v-card elevation="4" class="chart-card">
          <v-card-title class="bg-gradient-primary text-white d-flex align-center justify-space-between">
            <div>
              <v-icon class="mr-2">mdi-chart-areaspline</v-icon>
              Graphique d'évolution
            </div>
            <v-chip color="white" variant="flat">
              {{ chartData.length }} points
            </v-chip>
          </v-card-title>
          <v-card-text class="pa-6">
            <!-- Sélecteur de métrique -->
            <v-chip-group
              v-model="selectedMetric"
              mandatory
              class="mb-6"
            >
              <v-chip
                v-for="metric in metrics"
                :key="metric.key"
                :value="metric.key"
                :color="metric.key === selectedMetric ? metric.color : 'grey-lighten-2'"
                variant="flat"
              >
                {{ metric.label }}
              </v-chip>
            </v-chip-group>

            <!-- Graphique SVG -->
            <div class="chart-container">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="chart-svg">
                <!-- Grille -->
                <line v-for="i in 5" :key="'h-' + i" 
                  :x1="0" :y1="i * 20" :x2="100" :y2="i * 20"
                  stroke="#e0e0e0" stroke-width="0.1" />
                <line v-for="i in 10" :key="'v-' + i" 
                  :x1="i * 10" :y1="0" :x2="i * 10" :y2="100"
                  stroke="#e0e0e0" stroke-width="0.1" />
                
                <!-- Aire sous la courbe -->
                <path
                  :d="generateAreaPath"
                  :fill="currentMetric.color"
                  fill-opacity="0.2"
                />
                
                <!-- Ligne du graphique -->
                <path
                  :d="generatePath"
                  :stroke="currentMetric.color"
                  stroke-width="0.5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                
                <!-- Points -->
                <circle
                  v-for="(point, i) in normalizeData(chartData, selectedMetric)"
                  :key="i"
                  :cx="point.x"
                  :cy="point.y"
                  r="0.8"
                  :fill="currentMetric.color"
                  class="chart-point"
                >
                  <title>{{ point.value }} {{ currentMetric.unit }}</title>
                </circle>
              </svg>
              
              <!-- Labels -->
              <div class="chart-labels">
                <div class="chart-label-y">
                  {{ currentMetric.label }} ({{ currentMetric.unit }})
                </div>
              </div>
            </div>

            <!-- Légende -->
            <div class="chart-legend">
              <div class="d-flex align-center justify-center flex-wrap gap-4 mt-4">
                <div class="d-flex align-center">
                  <div class="legend-dot" :style="{ background: currentMetric.color }"></div>
                  <span class="text-body-2">{{ currentMetric.label }}</span>
                </div>
                <div class="text-caption text-grey">
                  Min: {{ statistics[selectedMetric]?.min }} {{ currentMetric.unit }}
                </div>
                <div class="text-caption text-grey">
                  Moy: {{ statistics[selectedMetric]?.avg }} {{ currentMetric.unit }}
                </div>
                <div class="text-caption text-grey">
                  Max: {{ statistics[selectedMetric]?.max }} {{ currentMetric.unit }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistiques -->
    <v-row v-if="statistics" class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="stat-card temperature-stat" elevation="4">
          <v-card-title class="d-flex align-center">
            <v-icon color="temperature" class="mr-2">mdi-thermometer</v-icon>
            Température
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Moyenne</div>
                  <div class="text-h5 font-weight-bold">{{ statistics.temperature.avg }}°C</div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Min</div>
                  <div class="text-h5 font-weight-bold text-blue">{{ statistics.temperature.min }}°C</div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Max</div>
                  <div class="text-h5 font-weight-bold text-red">{{ statistics.temperature.max }}°C</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="stat-card humidity-stat" elevation="4">
          <v-card-title class="d-flex align-center">
            <v-icon color="humidity" class="mr-2">mdi-water-percent</v-icon>
            Humidité
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Moyenne</div>
                  <div class="text-h5 font-weight-bold">{{ statistics.humidity.avg }}%</div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Min</div>
                  <div class="text-h5 font-weight-bold text-blue">{{ statistics.humidity.min }}%</div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Max</div>
                  <div class="text-h5 font-weight-bold text-red">{{ statistics.humidity.max }}%</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="stat-card pressure-stat" elevation="4">
          <v-card-title class="d-flex align-center">
            <v-icon color="pressure" class="mr-2">mdi-gauge</v-icon>
            Pression
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Moyenne</div>
                  <div class="text-h5 font-weight-bold">{{ statistics.pressure.avg }}</div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Min</div>
                  <div class="text-h5 font-weight-bold text-blue">{{ statistics.pressure.min }}</div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Max</div>
                  <div class="text-h5 font-weight-bold text-red">{{ statistics.pressure.max }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tableau des données -->
    <v-row v-if="sondesStore.archiveData.length > 0">
      <v-col cols="12">
        <v-card elevation="4" class="data-table-card">
          <v-card-title class="bg-gradient-primary text-white d-flex align-center justify-space-between">
            <div>
              <v-icon class="mr-2">mdi-table</v-icon>
              Données détaillées
            </div>
            <v-chip color="white" variant="flat">
              {{ sondesStore.archiveData.length }} enregistrement(s)
            </v-chip>
          </v-card-title>
          <v-data-table
            :items="sondesStore.archiveData"
            :headers="columns"
            class="elevation-0"
            :items-per-page="15"
            :items-per-page-options="[10, 15, 25, 50, 100]"
          >
            <template v-slot:item="{ item }">
              <tr class="table-row">
                <td v-for="col in columns" :key="col.key" class="text-body-2">
                  {{ item[col.key] }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Message si aucune donnée -->
    <v-row v-else-if="!loading">
      <v-col cols="12">
        <v-card class="text-center pa-12" elevation="2">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">
            mdi-database-off-outline
          </v-icon>
          <h3 class="text-h5 mb-2">Aucune donnée disponible</h3>
          <p class="text-grey mb-4">
            Sélectionnez une période pour afficher l'historique des mesures
          </p>
          <v-icon size="40" color="grey-lighten-2">mdi-arrow-up</v-icon>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.history-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-left: 4px solid #FF9800;
  border-radius: 12px;
}

.date-selector {
  border-radius: 20px;
  overflow: hidden;
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.chart-card {
  border-radius: 20px;
  overflow: hidden;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.chart-svg {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.chart-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.chart-point:hover {
  r: 1.5;
}

.chart-labels {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.chart-label-y {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.chart-legend {
  margin-top: 16px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.stat-card {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.temperature-stat {
  border-top: 4px solid #FF6B6B;
}

.humidity-stat {
  border-top: 4px solid #4ECDC4;
}

.pressure-stat {
  border-top: 4px solid #95E1D3;
}

.data-table-card {
  border-radius: 20px;
  overflow: hidden;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f5f7fa;
}
</style>