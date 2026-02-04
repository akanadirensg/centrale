<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(true)

const navigationItems = [
  { title: 'Accueil', icon: 'mdi-home', path: '/' },
  { title: 'Dashboard', icon: 'mdi-view-dashboard', path: '/dashboard' },
  { title: 'Carte', icon: 'mdi-map-marker-radius', path: '/carte' },
  { title: 'Historique', icon: 'mdi-chart-line', path: '/historique' },
]
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar
      elevation="0"
      class="app-header"
      color="primary"
      prominent
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" class="text-white"></v-app-bar-nav-icon>
      
      <v-toolbar-title class="text-white d-flex align-center">
        <v-icon size="32" class="mr-2">mdi-weather-partly-cloudy</v-icon>
        <span class="text-h5 font-weight-bold">MétéoHub</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon class="text-white">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-btn icon class="text-white">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      class="navigation-drawer"
      elevation="1"
    >
      <div class="pa-4 text-center bg-gradient">
        <v-avatar size="80" class="mb-3">
          <v-icon size="60" color="white">mdi-cloud-outline</v-icon>
        </v-avatar>
        <div class="text-h6 font-weight-bold white--text">Centrale Météo</div>
        <div class="text-caption white--text opacity-80">Multi-sondes</div>
      </div>

      <v-divider></v-divider>

      <v-list nav density="comfortable" class="mt-2">
        <v-list-item
          v-for="item in navigationItems"
          :key="item.title"
          :to="item.path"
          rounded="xl"
          class="mx-2 my-1"
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
  border-bottom: 3px solid rgba(255, 255, 255, 0.1);
}

.bg-gradient {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 0 0 20px 20px;
}

.navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.main-content {
  background: linear-gradient(135deg, #F5F7FA 0%, #E8EAF6 100%);
  min-height: 100vh;
}
</style>