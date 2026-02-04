import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'weatherTheme',
    themes: {
      weatherTheme: {
        dark: false,
        colors: {
          primary: '#2196F3', // Bleu ciel
          secondary: '#FF9800', // Orange soleil
          accent: '#00BCD4', // Cyan eau
          error: '#F44336',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#F5F7FA',
          surface: '#FFFFFF',
          'primary-darken': '#1976D2',
          'secondary-darken': '#F57C00',
          
          // Couleurs personnalisées pour météo
          temperature: '#FF6B6B',
          humidity: '#4ECDC4',
          pressure: '#95E1D3',
          wind: '#A8E6CF',
          rain: '#5DADE2',
          sun: '#FFD93D',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',   // <-- ici on définit mdi comme set par défaut
  },
})