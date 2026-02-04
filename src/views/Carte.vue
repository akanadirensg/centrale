<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useSondesStore } from '../stores/sondes'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const sondesStore = useSondesStore()
const mapContainer = ref(null)
let map = null


onMounted(async () => {
    // await sondesStore.loadLocationsOnly()

    // await nextTick()

    // initialiser la map
    map = new maplibregl.Map({
        container: mapContainer.value,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [2.3522, 48.8566],
        zoom: 5
    })

    // forcer resize au cas où le container a changé
    map.resize()

    // ajouter les marqueurs
    sondesStore.locations.forEach((loc, i) => {
        new maplibregl.Marker({ color: '#FF5722' })
            .setLngLat([loc.long, loc.lat])
            .setPopup(
                new maplibregl.Popup({ offset: 25 }).setHTML(
                    `<strong>Station ${i + 1}</strong><br>Lat: ${loc.lat}, Long: ${loc.long}`
                )
            )
            .addTo(map)
    })
})
</script>

<template>
    <v-container fluid class="pa-4">
        <v-row>
            <v-col cols="12">
                <v-card class="pa-4" elevation="5">
                    <v-card-title class="text-h5 font-weight-bold">Positions des stations</v-card-title>
                    <v-card-text>
                        <!-- Ajout de la classe map-container -->
                        <div ref="mapContainer" class="map-container"></div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="pa-4" elevation="3">
                    <v-card-title class="text-h6 font-weight-bold">Liste des stations</v-card-title>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item v-for="(loc, i) in sondesStore.locations" :key="i">
                                <v-list-item-content>
                                    Station {{ i + 1 }} : lat {{ loc.lat }}, long {{ loc.long }}
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.map-container {
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
}
</style>
