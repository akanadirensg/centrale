<script setup>
</script>


<template>
  <v-container class="home" fluid>
    <v-row justify="center" class="text-center my-12">
      <v-col cols="12" md="8">
        <v-card elevation="3" class="pa-6">
          <v-card-title class="text-h4">Centrale Météo</v-card-title>
          <v-card-text class="text-subtitle-1">
            Centrale de visualisation de données météorologiques multi-sondes.
          </v-card-text>

          <v-row class="mt-6" justify="center" align="center" dense>
            <v-col cols="12" sm="6" md="3">
              <v-btn color="primary" block :to="{ path: '/dashboard' }">Dashboard</v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn color="secondary" block :to="{ path: '/sondes' }">Sondes</v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn color="success" block :to="{ path: '/carte' }">Carte</v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn color="info" block :to="{ path: '/historique' }">Historique</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
}
</style>
