<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4">Tableau de bord météo</h1>
      </v-col>

      <!-- Checklist stylée -->
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            md="4"
            v-for="(m, index) in availableMeasurements"
            :key="index"
          >
            <v-checkbox
              v-model="m.checked"
              :label="m.label"
              color="primary"
              hide-details
              class="custom-checkbox"
            >
              <!-- Icône cochée plus grande -->
              <template #checkbox>
                <v-icon v-if="m.checked" color="primary" size="28">mdi-checkbox-marked-circle</v-icon>
                <v-icon v-else color="grey lighten-1" size="28">mdi-checkbox-blank-circle-outline</v-icon>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Grid des cards -->
    <v-row>
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
    <v-row v-if="sondesStore.meteoData.length === 0">
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          Aucune station active. Veuillez vérifier votre connexion ou vos endpoints.
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSondesStore } from '../stores/sondes'
import SensorCard from './SensorCard.vue'

const sondesStore = useSondesStore()

const endpoints = [
  'http://localhost:3000/meteo/v1/live',
  'http://localhost:3000/meteo/v1/live',
  'http://localhost:3000/meteo/v1/live',
]

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

// Recharge les données dès que la sélection change
watch(selectedMeasurements, async (newMeasures) => {
  if (newMeasures.length > 0) {
    await sondesStore.loadStations(endpoints, newMeasures)
  }
}, { immediate: true })
</script>

<style scoped>
/* Style custom pour les checkboxes */
.custom-checkbox {
  display: flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-checkbox:hover {
  transform: scale(1.05);
}

.custom-checkbox .v-label {
  margin-left: 10px;
  color: #1976D2; /* Couleur primaire plus visible */
  font-size: 16px;
}
</style>
