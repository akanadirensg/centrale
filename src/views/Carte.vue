<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useSondesStore } from '../stores/sondes'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const sondesStore = useSondesStore()
const mapContainer = ref(null)
let map = null

onMounted(async () => {
    if (!sondesStore.sondes.length) {
        await sondesStore.loadStations()
    }

    await nextTick()

    // Initialiser la map
    map = new maplibregl.Map({
        container: mapContainer.value,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [2.3522, 48.8566],
        zoom: 5
    })

    // Forcer resize
    map.resize()

    // Ajouter les marqueurs avec popup personnalisée
    sondesStore.locations.forEach((loc, i) => {
        const el = document.createElement('div')
        el.className = 'custom-marker'
        el.innerHTML = `
            <div class="marker-pin"></div>
            <div class="marker-pulse"></div>
        `

        new maplibregl.Marker({ element: el })
            .setLngLat([loc.long, loc.lat])
            .setPopup(
                new maplibregl.Popup({ offset: 25, className: 'custom-popup' }).setHTML(
                    `
                    <div class="popup-content">
                        <h3>Station ${i + 1}</h3>
                        <p><strong>Latitude:</strong> ${loc.lat.toFixed(4)}°</p>
                        <p><strong>Longitude:</strong> ${loc.long.toFixed(4)}°</p>
                        <button class="popup-btn">Voir détails</button>
                    </div>
                    `
                )
            )
            .addTo(map)
    })

    // Ajouter contrôles de navigation
    map.addControl(new maplibregl.NavigationControl(), 'top-right')
})
</script>

<template>
    <v-container fluid class="pa-0">
        <v-row no-gutters>
            <v-col cols="12">
                <!-- Header -->
                <v-card class="map-header mb-4" elevation="0">
                    <v-card-text>
                        <div class="d-flex align-center justify-space-between flex-wrap">
                            <div>
                                <h1 class="text-h4 font-weight-bold mb-2">
                                    <v-icon size="36" color="success" class="mr-2">mdi-map-marker-radius</v-icon>
                                    Carte des stations
                                </h1>
                                <p class="text-subtitle-1 text-grey">
                                    Localisation géographique de vos {{ sondesStore.locations.length }} station(s) météo
                                </p>
                            </div>
                            <v-chip color="success" variant="flat" size="large">
                                <v-icon left>mdi-check-circle</v-icon>
                                {{ sondesStore.locations.length }} actives
                            </v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Map container -->
            <v-col cols="12" lg="8">
                <v-card class="map-card" elevation="6">
                    <div ref="mapContainer" class="map-container"></div>
                </v-card>
            </v-col>

            <!-- Liste des stations -->
            <v-col cols="12" lg="4">
                <v-card class="stations-list" elevation="6">
                    <v-card-title class="bg-gradient-success text-white">
                        <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                        Liste des stations
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pa-0">
                        <v-list lines="three">
                            <template v-for="(loc, i) in sondesStore.locations" :key="i">
                                <v-list-item class="station-item">
                                    <template v-slot:prepend>
                                        <v-avatar color="success" size="48">
                                            <v-icon color="white">mdi-map-marker</v-icon>
                                        </v-avatar>
                                    </template>
                                    <v-list-item-title class="font-weight-bold">
                                        Station {{ i + 1 }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="mt-1">
                                        <div class="d-flex align-center mb-1">
                                            <v-icon size="16" class="mr-1">mdi-latitude</v-icon>
                                            {{ loc.lat.toFixed(4) }}°
                                        </div>
                                        <div class="d-flex align-center">
                                            <v-icon size="16" class="mr-1">mdi-longitude</v-icon>
                                            {{ loc.long.toFixed(4) }}°
                                        </div>
                                    </v-list-item-subtitle>
                                    <template v-slot:append>
                                        <v-btn
                                            icon
                                            size="small"
                                            variant="text"
                                            color="success"
                                        >
                                            <v-icon>mdi-eye</v-icon>
                                        </v-btn>
                                    </template>
                                </v-list-item>
                                <v-divider v-if="i < sondesStore.locations.length - 1"></v-divider>
                            </template>
                        </v-list>
                    </v-card-text>
                </v-card>

                <!-- Statistiques -->
                <v-card class="mt-4" elevation="4">
                    <v-card-title class="bg-gradient-info text-white">
                        <v-icon class="mr-2">mdi-chart-box</v-icon>
                        Statistiques
                    </v-card-title>
                    <v-card-text class="pa-4">
                        <div class="stat-row">
                            <v-icon color="success" class="mr-2">mdi-map-marker-check</v-icon>
                            <span class="text-body-2">Stations actives:</span>
                            <v-spacer></v-spacer>
                            <span class="font-weight-bold">{{ sondesStore.locations.length }}</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="stat-row">
                            <v-icon color="primary" class="mr-2">mdi-earth</v-icon>
                            <span class="text-body-2">Zone couverte:</span>
                            <v-spacer></v-spacer>
                            <span class="font-weight-bold">France</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="stat-row">
                            <v-icon color="warning" class="mr-2">mdi-update</v-icon>
                            <span class="text-body-2">Dernière MàJ:</span>
                            <v-spacer></v-spacer>
                            <span class="font-weight-bold text-caption">{{ new Date().toLocaleTimeString('fr-FR') }}</span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.map-header {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-left: 4px solid #4CAF50;
    border-radius: 12px;
}

.map-card {
    border-radius: 20px;
    overflow: hidden;
    height: calc(100vh - 200px);
    min-height: 500px;
}

.map-container {
    width: 100%;
    height: 100%;
}

.stations-list {
    border-radius: 20px;
    overflow: hidden;
    max-height: calc(100vh - 200px);
}

.bg-gradient-success {
    background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
}

.bg-gradient-info {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.station-item {
    transition: background-color 0.3s ease;
}

.station-item:hover {
    background-color: #f5f5f5;
}

.stat-row {
    display: flex;
    align-items: center;
}

/* Custom markers styles */
:deep(.custom-marker) {
    width: 40px;
    height: 40px;
    position: relative;
    cursor: pointer;
}

:deep(.marker-pin) {
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
    position: absolute;
    transform: rotate(-45deg);
    left: 50%;
    top: 50%;
    margin: -15px 0 0 -15px;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
    transition: all 0.3s ease;
}

:deep(.custom-marker:hover .marker-pin) {
    transform: rotate(-45deg) scale(1.2);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.7);
}

:deep(.marker-pulse) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(76, 175, 80, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.8);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

/* Custom popup styles */
:deep(.custom-popup .maplibregl-popup-content) {
    border-radius: 12px;
    padding: 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

:deep(.popup-content) {
    padding: 16px;
}

:deep(.popup-content h3) {
    margin: 0 0 12px 0;
    color: #4CAF50;
    font-size: 18px;
    font-weight: bold;
}

:deep(.popup-content p) {
    margin: 4px 0;
    font-size: 14px;
    color: #666;
}

:deep(.popup-btn) {
    margin-top: 12px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
}

:deep(.popup-btn:hover) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}
</style>