# AnglerLog (Edición en Español) 🎣
### Diario Personal de Pesca Offline & Localizador GPS de Spots

AnglerLog es una moderna aplicación web progresiva (PWA) diseñada para pescadores de mar, río y embalse. Gracias a su arquitectura local (Offline-First), funciona perfectamente en alta mar o en zonas remotas sin cobertura móvil.

---

## 🌟 Características Principales

- 🗺️ Mapa de Spots & Localizador GPS:
  - Posicionamiento GPS preciso en el agua o la costa y guardado de spots con un solo toque
  - Múltiples capas de mapas: Satélite (Esri World Imagery), Topográfico (OpenTopoMap) y Estándar (OpenStreetMap)
  - Soporte para sub-spots (estructuras, cantiles, piedras y bajos)
  - Registro de riesgo de enroque, tipo de fondo, zonas de aparcamiento y normativas

- 🐟 Diario Detallado de Capturas:
  - Registro de capturas con longitud (cm), peso (kg) y cantidad
  - Vinculación automática con el clima, presión atmosférica, fases lunares y mareas
  - Registro de jornadas sin captura (porras) para registrar y aprender de las condiciones
  - Ficha para compartir en redes sociales con ocultación automática de coordenadas GPS secretas

- 🌊 Previsión de Mareas & Actividad:
  - Curva de nivel de marea en tiempo real, pleamar (alta) y bajamar (baja)
  - Coeficientes de marea y detección del repunte de marea
  - Tablas solunares e índice de actividad de peces

- 🧭 Herramientas Tácticas:
  - Brújula de pesca con dirección de viento y deriva
  - Caja de aparejos digital para cañas, carretes, líneas y señuelos
  - Registro de récords personales (Personal Best) y trofeos
  - Calendario mensual con fases lunares e historial de capturas

- 🔒 Máxima Privacidad:
  - Tus spots secretos nunca se suben a servidores externos
  - Todos los datos se almacenan localmente en tu navegador (IndexedDB)
  - Copia de seguridad y restauración sencilla en formato JSON

---

## 🚀 Instalación & Uso

### Requisitos previos
- Node.js (v18+)
- npm o pnpm

### Desarrollo local
```bash
npm install
npm run dev
```

### Compilación para producción
```bash
npm run build
```

---

## 📄 Licencia

MIT License
