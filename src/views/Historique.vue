<script setup>
import { ref } from 'vue'
import { useSondesStore } from '../stores/sondes'

const sondesStore = useSondesStore()

const startDate = ref('')
const endDate = ref('')
const columns = ref([])

const fetchArchive = async () => {
  if (!startDate.value || !endDate.value) {
    alert('Veuillez choisir les deux dates !')
    return
  }

  const startTimestamp = Math.floor(new Date(startDate.value).getTime() / 1000)
  const endTimestamp = Math.floor(new Date(endDate.value).getTime() / 1000)



  await sondesStore.loadArchive( startTimestamp, endTimestamp)

  // Génération dynamique des colonnes depuis le store
  if (sondesStore.archiveData.length > 0) {
    columns.value = Object.keys(sondesStore.archiveData[0]).map(key => ({
      title: key.toUpperCase(),
      key
    }))
  } else {
    columns.value = []
  }
}
</script>



<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4">Historique des mesures</h1>
      </v-col>

      <!-- Sélecteurs de date/heure -->
      <v-col cols="12" md="4">
        <v-text-field
          v-model="startDate"
          label="Date début"
          type="datetime-local"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="endDate"
          label="Date fin"
          type="datetime-local"
        />
      </v-col>

      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn color="primary" @click="fetchArchive">Charger l'historique</v-btn>
      </v-col>
    </v-row>

    <!-- Tableau des données -->
    <v-row v-if="sondesStore.archiveData.length > 0">
      <v-col cols="12">
        <v-data-table
  :items="sondesStore.archiveData"
  :headers="columns"
  class="elevation-1"
  dense
  :items-per-page="10"
/>

      </v-col>
    </v-row>

    <!-- Message si aucune donnée -->
    <v-row v-else>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          Aucune donnée sélectionnée pour cet intervalle.
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 16px;
}
</style>
