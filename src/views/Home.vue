<script setup>
</script>

<template>
  <v-container fluid class="home-container">
    <!-- Hero Section -->
    <v-row justify="center" class="hero-section">
      <v-col cols="12" md="10" lg="8">
        <div class="text-center mb-8">
          <div class="hero-icon-wrapper mb-6">
            <v-icon size="120" color="white">mdi-weather-partly-cloudy</v-icon>
          </div>
          <h1 class="display-1 font-weight-bold mb-4 hero-title">
            MétéoHub
          </h1>
          <p class="text-h5 mb-2 hero-subtitle">
            Votre centrale de visualisation météorologique
          </p>
          <p class="text-subtitle-1 text-grey-darken-1">
            Surveillance en temps réel de vos stations météo multi-sondes
          </p>
        </div>

        <!-- Statistiques rapides -->
        <v-row class="mb-8">
          <v-col cols="6" sm="3">
            <v-card class="stat-mini text-center pa-4" elevation="0">
              <v-icon size="40" color="primary" class="mb-2">mdi-server</v-icon>
              <div class="text-h4 font-weight-bold">1</div>
              <div class="text-caption text-grey">Station</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stat-mini text-center pa-4" elevation="0">
              <v-icon size="40" color="success" class="mb-2">mdi-chart-timeline-variant</v-icon>
              <div class="text-h4 font-weight-bold">9</div>
              <div class="text-caption text-grey">Mesures</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stat-mini text-center pa-4" elevation="0">
              <v-icon size="40" color="warning" class="mb-2">mdi-clock-fast</v-icon>
              <div class="text-h4 font-weight-bold">Live</div>
              <div class="text-caption text-grey">Temps réel</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stat-mini text-center pa-4" elevation="0">
              <v-icon size="40" color="info" class="mb-2">mdi-database</v-icon>
              <div class="text-h4 font-weight-bold">24/7</div>
              <div class="text-caption text-grey">Archive</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Navigation Cards -->
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="nav-card dashboard-card"
              elevation="6"
              :to="{ path: '/dashboard' }"
              hover
            >
              <v-card-text class="text-center pa-6">
                <div class="nav-icon-wrapper mb-4">
                  <v-icon size="48" color="white">mdi-view-dashboard</v-icon>
                </div>
                <h3 class="text-h6 font-weight-bold mb-2">Dashboard</h3>
                <p class="text-caption">Visualisez vos données en temps réel</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="nav-card map-card"
              elevation="6"
              :to="{ path: '/carte' }"
              hover
            >
              <v-card-text class="text-center pa-6">
                <div class="nav-icon-wrapper mb-4">
                  <v-icon size="48" color="white">mdi-map-marker-radius</v-icon>
                </div>
                <h3 class="text-h6 font-weight-bold mb-2">Carte</h3>
                <p class="text-caption">Localisez vos stations sur la carte</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="nav-card history-card"
              elevation="6"
              :to="{ path: '/historique' }"
              hover
            >
              <v-card-text class="text-center pa-6">
                <div class="nav-icon-wrapper mb-4">
                  <v-icon size="48" color="white">mdi-chart-line</v-icon>
                </div>
                <h3 class="text-h6 font-weight-bold mb-2">Historique</h3>
                <p class="text-caption">Analysez les données passées</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="nav-card settings-card"
              elevation="6"
              hover
            >
              <v-card-text class="text-center pa-6">
                <div class="nav-icon-wrapper mb-4">
                  <v-icon size="48" color="white">mdi-cog</v-icon>
                </div>
                <h3 class="text-h6 font-weight-bold mb-2">Paramètres</h3>
                <p class="text-caption">Configurez vos préférences</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Features Section -->
    <v-row justify="center" class="mt-12">
      <v-col cols="12" md="10" lg="8">
        <h2 class="text-h4 font-weight-bold text-center mb-8">Fonctionnalités principales</h2>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="feature-card" elevation="2">
              <v-card-text class="text-center pa-6">
                <v-icon size="60" color="primary" class="mb-4">mdi-lightning-bolt</v-icon>
                <h4 class="text-h6 font-weight-bold mb-2">Temps réel</h4>
                <p class="text-body-2 text-grey-darken-1">
                  Accédez aux données météorologiques instantanément avec une mise à jour continue
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="feature-card" elevation="2">
              <v-card-text class="text-center pa-6">
                <v-icon size="60" color="success" class="mb-4">mdi-chart-areaspline</v-icon>
                <h4 class="text-h6 font-weight-bold mb-2">Analyse avancée</h4>
                <p class="text-body-2 text-grey-darken-1">
                  Visualisez les tendances et explorez l'historique complet de vos mesures
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="feature-card" elevation="2">
              <v-card-text class="text-center pa-6">
                <v-icon size="60" color="warning" class="mb-4">mdi-map-check</v-icon>
                <h4 class="text-h6 font-weight-bold mb-2">Géolocalisation</h4>
                <p class="text-body-2 text-grey-darken-1">
                  Visualisez la position de toutes vos stations sur une carte interactive
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 60px;
  padding-bottom: 60px;
}

.hero-section {
  margin-bottom: 40px;
}

.hero-icon-wrapper {
  width: 160px;
  height: 160px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.5);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.hero-title {
  color: white;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 4rem !important;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.stat-mini {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.stat-mini:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.nav-card {
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-card:hover::before {
  opacity: 1;
}

.nav-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
}

.dashboard-card {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.map-card {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  color: white;
}

.history-card {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
}

.settings-card {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
}

.nav-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-card:hover .nav-icon-wrapper {
  transform: rotate(5deg) scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}

.feature-card {
  border-radius: 20px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}
</style>