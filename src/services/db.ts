import { FishingSpot, CatchLog, StoredPhoto, TackleSet } from '../types/fishing';
import { 
  formatTideName, 
  formatTideState, 
  formatWaveCondition, 
  formatWeatherCondition, 
  formatSpotType, 
  formatBottomType, 
  formatSpeciesName, 
  formatSeason, 
  formatTimeOfDay, 
  formatSnagRisk, 
  formatSpotName 
} from '../utils/formatI18n';

const DB_NAME = 'AnglerLogDatabase_v2';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('spots')) {
        const spotStore = db.createObjectStore('spots', { keyPath: 'id' });
        spotStore.createIndex('spotType', 'spotType', { unique: false });
        spotStore.createIndex('favorite', 'favorite', { unique: false });
      }

      if (!db.objectStoreNames.contains('catches')) {
        const catchStore = db.createObjectStore('catches', { keyPath: 'id' });
        catchStore.createIndex('spotId', 'spotId', { unique: false });
        catchStore.createIndex('species', 'species', { unique: false });
        catchStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains('photos')) {
        const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
        photoStore.createIndex('spotId', 'spotId', { unique: false });
        photoStore.createIndex('catchLogId', 'catchLogId', { unique: false });
      }

      if (!db.objectStoreNames.contains('tackles')) {
        const tackleStore = db.createObjectStore('tackles', { keyPath: 'id' });
        tackleStore.createIndex('targetFish', 'targetFish', { unique: false });
      }
    };

    request.onsuccess = async (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      await seedInitialDataIfEmpty(db);
      await migrateLegacyData(db);
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

export const SAMPLE_SPOT_IDS = new Set([
  'spot-galicia-rias-baixas',
  'spot-delta-del-ebro',
  'spot-embalse-ourellana',
  'spot-ruegen-bodden',
  'spot-bodensee-lindau',
  'spot-rhein-kuehkopf',
]);

export const SAMPLE_CATCH_IDS = new Set([
  'catch-001',
  'catch-002',
  'catch-003',
]);

export function isSampleSpotItem(s: FishingSpot): boolean {
  return Boolean(s.isSample || SAMPLE_SPOT_IDS.has(s.id));
}

export function isSampleCatchItem(c: CatchLog): boolean {
  return Boolean(c.isSample || SAMPLE_CATCH_IDS.has(c.id));
}

async function seedInitialDataIfEmpty(db: IDBDatabase): Promise<void> {
  const transaction = db.transaction(['spots', 'catches'], 'readonly');
  const spotsStore = transaction.objectStore('spots');
  const countReq = spotsStore.count();

  return new Promise((resolve) => {
    countReq.onsuccess = async () => {
      if (countReq.result === 0) {
        const writeTx = db.transaction(['spots', 'catches'], 'readwrite');
        const writeSpots = writeTx.objectStore('spots');
        const writeCatches = writeTx.objectStore('catches');

        const initialSpots: FishingSpot[] = getInitialSampleSpots();
        const initialCatches: CatchLog[] = getInitialSampleCatches();

        initialSpots.forEach((s) => writeSpots.put(s));
        initialCatches.forEach((c) => writeCatches.put(c));

        writeTx.oncomplete = () => {
          seedTacklesIfEmpty(db).then(resolve);
        };
        writeTx.onerror = () => {
          seedTacklesIfEmpty(db).then(resolve);
        };
      } else {
        seedTacklesIfEmpty(db).then(resolve);
      }
    };
  });
}

export function getInitialSampleSpots(): FishingSpot[] {
  return [
    {
      id: 'spot-galicia-rias-baixas',
      name: 'Galicia - Ría de Arousa & Costa da Vela',
      spotType: 'rocky',
      lat: 42.5050,
      lng: -8.9250,
      description: 'Paraíso de la pesca a spinning de la lubina en rompientes y pedreros salvajes del Atlántico. Ricas aguas con bateas de mejillón y grandes corrientes mareales.',
      waterDepth: '2 m en bajamar sobre piedras, hasta 12 m en canales exteriores',
      bottomType: ['Bajos rocosos / Arrecife', 'Arena', 'Algas / Praderas submarinas'],
      snagRisk: 'medium',
      currentNotes: 'Máxima actividad en el repunte y primeras dos horas de llenante con espuma batiente y mar de fondo.',
      parkingInfo: 'Aparcamiento del Faro de Cabo Home (acceso a pie por sendero costero)',
      hazardAndAccessNotes: 'Extrema precaución con los golpes de mar en los pedreros mojados. Calzado antideslizante con clavos y chaleco salvavidas obligatorios.',
      bestSeasons: ['Otoño', 'Invierno', 'Primavera'],
      bestTimeOfDay: ['Amanecer', 'Atardecer'],
      targetSpecies: ['Lubina', 'Sargo', 'Abadejo', 'Pargo / Pagel', 'Sepia / Choco'],
      favorite: true,
      rating: 5,
      isSample: true,
      photoIds: [],
      subPoints: [
        { id: 'sub-galicia-1', name: 'Punta Subrido - Rompiente del Faro', lat: 42.5080, lng: -8.9280, note: 'Punto caliente de lubinas grandes acechando lanzones en la espuma' },
        { id: 'sub-galicia-2', name: 'Pedrero da Barra', lat: 42.5020, lng: -8.9210, note: 'Fondos mixtos ideales para sargos a boya y vinilos ligeros' }
      ],
      createdAt: '2026-03-10T06:00:00.000Z',
      updatedAt: '2026-03-10T06:00:00.000Z'
    },
    {
      id: 'spot-delta-del-ebro',
      name: 'Delta del Ebro - Desembocadura & Riumar',
      spotType: 'estuary',
      lat: 40.7180,
      lng: 0.8520,
      description: 'Uno de los humedales y estuarios más productivos del Mediterráneo occidental. Famoso por sus brutales ataques en superficie de anjovas, palometones, lubinas y grandes siluros.',
      waterDepth: '1 m en las barras de arena, 4 a 8 m en el canal principal del río',
      bottomType: ['Arena', 'Fango / Cieno', 'Cantil / Desnivel'],
      snagRisk: 'low',
      currentNotes: 'Fuerte corriente de vaciante fluvial que confluye con el Mediterráneo creando una línea de turbidez y espuma muy atractiva para depredadores.',
      parkingInfo: 'Aparcamiento de la Urbanización Riumar y puerto fluvial de Deltebre',
      hazardAndAccessNotes: 'Respetar las zonas delimitadas del Parque Natural del Delta del Ebro. Cuidado con las corrientes rápidas al vadear barras de arena.',
      bestSeasons: ['Primavera', 'Verano', 'Otoño'],
      bestTimeOfDay: ['Amanecer', 'Atardecer', 'Durante el día'],
      targetSpecies: ['Lubina', 'Dorada', 'Siluro', 'Lucio', 'Black Bass'],
      favorite: true,
      rating: 5,
      isSample: true,
      photoIds: [],
      createdAt: '2026-04-18T18:30:00.000Z',
      updatedAt: '2026-04-18T18:30:00.000Z'
    },
    {
      id: 'spot-embalse-ourellana',
      name: 'Extremadura - Embalse de Orellana',
      spotType: 'lake_pond',
      lat: 38.9950,
      lng: -5.4850,
      description: 'Meca europea de los depredadores de agua dulce. Aguas cristalinas famosas por enormes lucios récord, black bass de gran calibre y gigantescas carpas reales.',
      waterDepth: '3 a 7 m en puntas de piedra y coberturas, más de 25 m en el cauce original',
      bottomType: ['Escollera / Piedra suelta', 'Árboles sumergidos', 'Rocas / Arrecife'],
      snagRisk: 'medium',
      currentNotes: 'Sin corriente fuerte, la actividad se concentra en las orillas batidas por el viento donde se acumulan los peces pasto.',
      parkingInfo: 'Varadero y playa fluvial de Orellana la Vieja',
      hazardAndAccessNotes: 'Zona ZEPA de aves acuáticas. Licencia de pesca de Extremadura y permiso de navegación de la Confederación del Guadiana en regla.',
      bestSeasons: ['Primavera', 'Otoño', 'Invierno'],
      bestTimeOfDay: ['Amanecer', 'Atardecer', 'Durante el día'],
      targetSpecies: ['Lucio', 'Black Bass', 'Lucioperca', 'Carpa común', 'Barbo'],
      favorite: false,
      rating: 4,
      isSample: true,
      photoIds: [],
      createdAt: '2026-05-02T05:30:00.000Z',
      updatedAt: '2026-05-02T05:30:00.000Z'
    }
  ];
}

export function getInitialSampleCatches(): CatchLog[] {
  return [
    {
      id: 'catch-001',
      spotId: 'spot-galicia-rias-baixas',
      spotName: 'Galicia - Ría de Arousa & Costa da Vela',
      date: '2026-09-18',
      time: '07:15',
      isNoCatch: false,
      items: [
        {
          id: 'item-001-1',
          species: 'Lubina',
          sizeCm: 76.5,
          weightGrams: 5200,
          quantity: 1,
          lureOrBait: 'Black Minnow 140 mm (Color Kaki) con cabeza Shore 25 g'
        }
      ],
      species: 'Lubina',
      sizeCm: 76.5,
      weightGrams: 5200,
      quantity: 1,
      tackle: {
        rod: 'Major Craft Crostage Seabass 2.90 m (10-42 g)',
        reel: 'Shimano Stradic FM 4000 XG',
        mainLine: 'Línea trenzada 8 hebras PE 1.2 (20 lb)',
        leader: 'Bajo de Fluorocarbono 100% Seaguar FXR 0.37 mm (18 lb, 1.8 m)'
      },
      lureOrBait: 'Black Minnow 140 mm',
      actionOrRange: 'Recogida lineal lenta en dientes de sierra rozando el fondo sobre los cantos rodados con paradas breves.',
      weather: {
        condition: 'cloudy',
        temperature: 17.5,
        waterTemperature: 16.2,
        windDirection: 'NO',
        windSpeedMs: 5.2,
        pressureHpa: 1016,
        tideName: 'Mareas vivas',
        tideState: 'Llenante (flujo principal)',
        waveHeight: 'Marejada',
        moonPhase: 'Luna creciente'
      },
      notes: '¡Picada brutal en plena rompiente de Cabo Home durante el inicio de la llenante! Una robaliza plateada de más de 5 kg que dio una pelea inolvidable entre las piedras sumergidas.',
      photoIds: [],
      isSample: true,
      createdAt: '2026-09-18T07:45:00.000Z',
      updatedAt: '2026-09-18T07:45:00.000Z'
    },
    {
      id: 'catch-002',
      spotId: 'spot-delta-del-ebro',
      spotName: 'Delta del Ebro - Desembocadura & Riumar',
      date: '2026-07-22',
      time: '20:10',
      isNoCatch: false,
      items: [
        {
          id: 'item-002-1',
          species: 'Dorada',
          sizeCm: 52.0,
          weightGrams: 2850,
          quantity: 1,
          lureOrBait: 'Cangrejo verde vivo en montaje corrido'
        }
      ],
      species: 'Dorada',
      sizeCm: 52.0,
      weightGrams: 2850,
      quantity: 1,
      tackle: {
        rod: 'Surfcasting 4.25 m (100-250 g)',
        reel: 'Carrete Surf 10000',
        mainLine: 'Monofilamento 0.20 mm con cola de rata',
        leader: 'Fluorocarbono 0.30 mm (2.0 m)'
      },
      lureOrBait: 'Cangrejo verde vivo',
      actionOrRange: 'Lance largo a unos 110 metros tras la segunda barra de arena.',
      weather: {
        condition: 'sunny',
        temperature: 26.0,
        waterTemperature: 24.5,
        windDirection: 'E',
        windSpeedMs: 2.8,
        pressureHpa: 1018,
        tideName: 'Mareas intermedias',
        tideState: 'Pleamar (Alta)',
        waveHeight: 'Marejadilla',
        moonPhase: 'Luna llena'
      },
      notes: 'Gran pepona pescada al atardecer en la lengua de arena. Tirada continua y pelea muy pesada antes de vararla con cuidado en la orilla.',
      photoIds: [],
      isSample: true,
      createdAt: '2026-07-22T20:45:00.000Z',
      updatedAt: '2026-07-22T20:45:00.000Z'
    },
    {
      id: 'catch-003',
      spotId: 'spot-embalse-ourellana',
      spotName: 'Extremadura - Embalse de Orellana',
      date: '2026-05-14',
      time: '11:30',
      isNoCatch: false,
      items: [
        {
          id: 'item-003-1',
          species: 'Lucio',
          sizeCm: 104.0,
          weightGrams: 9400,
          quantity: 1,
          lureOrBait: 'Swimbait articulado 20 cm (Patrón Perca)'
        }
      ],
      species: 'Lucio',
      sizeCm: 104.0,
      weightGrams: 9400,
      quantity: 1,
      tackle: {
        rod: 'Bullseye Beast 2.40 m Casting Heavy',
        reel: 'Shimano Tranx 301 A',
        mainLine: 'PE Braid 3.0 (40 lb)',
        leader: 'Titanio 40 lb con bajo de fluorocarbono 0.80 mm'
      },
      lureOrBait: 'Swimbait articulado 20 cm',
      actionOrRange: 'Paseando el señuelo en S-glide por la caída de una punta rocosa con árboles sumergidos.',
      weather: {
        condition: 'cloudy',
        temperature: 21.0,
        waterTemperature: 19.2,
        windDirection: 'SO',
        windSpeedMs: 3.5,
        pressureHpa: 1014,
        tideName: 'Marea larga',
        tideState: 'Repunte de marea',
        waveHeight: 'Mar en calma',
        moonPhase: 'Cuarto creciente'
      },
      notes: 'Ataque fulgurante a escasos 5 metros del pato. Espectacular ejemplar de más de un metro de longitud.',
      photoIds: [],
      isSample: true,
      createdAt: '2026-05-14T12:00:00.000Z',
      updatedAt: '2026-05-14T12:00:00.000Z'
    }
  ];
}

export async function clearSampleData(): Promise<{ spotCount: number; catchCount: number }> {
  const db = await getDB();
  const spots = await getAllSpots();
  const catches = await getAllCatches();
  const sampleSpots = spots.filter(isSampleSpotItem);
  const sampleCatches = catches.filter(isSampleCatchItem);

  return new Promise((resolve, reject) => {
    const tx = db.transaction(['spots', 'catches'], 'readwrite');
    const spotStore = tx.objectStore('spots');
    const catchStore = tx.objectStore('catches');

    sampleSpots.forEach((s) => spotStore.delete(s.id));
    sampleCatches.forEach((c) => catchStore.delete(c.id));

    tx.oncomplete = () => resolve({ spotCount: sampleSpots.length, catchCount: sampleCatches.length });
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadSampleData(force = false): Promise<{ spotCount: number; catchCount: number }> {
  const db = await getDB();
  const spots = await getAllSpots();
  if (!force && spots.some(isSampleSpotItem)) {
    return { spotCount: 0, catchCount: 0 };
  }

  const sampleSpots = getInitialSampleSpots();
  const sampleCatches = getInitialSampleCatches();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(['spots', 'catches'], 'readwrite');
    const spotStore = tx.objectStore('spots');
    const catchStore = tx.objectStore('catches');

    sampleSpots.forEach((s) => spotStore.put(s));
    sampleCatches.forEach((c) => catchStore.put(c));

    tx.oncomplete = () => resolve({ spotCount: sampleSpots.length, catchCount: sampleCatches.length });
    tx.onerror = () => reject(tx.error);
  });
}

async function seedTacklesIfEmpty(db: IDBDatabase): Promise<void> {
  if (!db.objectStoreNames.contains('tackles')) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction('tackles', 'readonly');
      const store = tx.objectStore('tackles');
      const countReq = store.count();
      countReq.onsuccess = () => {
        if (countReq.result === 0) {
          const writeTx = db.transaction('tackles', 'readwrite');
          const writeStore = writeTx.objectStore('tackles');

          const initialTackles: TackleSet[] = [
            {
              id: 'tackle-seabass-spinning',
              name: 'Equipo de Spinning Costa / Lubina',
              targetFish: 'Lubina',
              rod: 'Major Craft Crostage Seabass 2.90 m (10-42 g Acción Rápida)',
              reel: 'Shimano Stradic FM 4000 XG (Ratio 6.2:1)',
              mainLine: 'Línea trenzada 8 hebras PE 1.2 (20 lb / 0.16 mm)',
              leader: 'Bajo de Fluorocarbono Seaguar FXR 0.37 mm (18 lb, 1.8 m)',
              favoriteLures: ['Black Minnow 120/140', 'Patchinko 125', 'Duo Tide Minnow 140/175', 'Jig de casting 30 g'],
              notes: 'Equipo polivalente para pedreros y rías atlánticas, excelente sensibilidad y reserva de potencia.',
              isDefault: true,
              createdAt: '2026-03-01T00:00:00.000Z',
              updatedAt: '2026-03-01T00:00:00.000Z'
            },
            {
              id: 'tackle-freshwater-predator',
              name: 'Equipo Casting Pesado (Lucio / Black Bass)',
              targetFish: 'Lucio / Black Bass',
              rod: 'Bullseye Beast 2.40 m Casting Heavy (45-120 g)',
              reel: 'Shimano Tranx 301 A (Ratio 5.8:1)',
              mainLine: 'Línea trenzada PE 3.0 (40 lb / 0.28 mm)',
              leader: 'Bajo de titanio 40 lb (50 cm) con amortiguador de fluorocarbono 0.80 mm',
              favoriteLures: ['Swimbait articulado 20 cm', 'Pig Shad 20 cm', 'Spinnerbait de doble pala 1 oz', 'Chatterbait 1/2 oz'],
              notes: 'Potencia garantizada para clavar y pelear grandes lucios en coberturas densas de embalses.',
              isDefault: false,
              createdAt: '2026-03-01T00:00:00.000Z',
              updatedAt: '2026-03-01T00:00:00.000Z'
            },
            {
              id: 'tackle-finesse-trout',
              name: 'Equipo Ultraligero / Trucha & Perca (Spinning Finesse)',
              targetFish: 'Trucha común / Perca',
              rod: 'Evergreen Salty Sensation 7ft 6in (1-10 g Ultralight)',
              reel: 'Shimano Vanford 2500 HG',
              mainLine: 'Línea trenzada fina PE 0.6 (10 lb / 0.08 mm)',
              leader: 'Bajo de fluorocarbono 0.18 mm (1.8 m)',
              favoriteLures: ['Cucharilla Mepps Aglia Nº 2', 'Minnow suspendido 50 mm', 'Vinilo Keitech 2"'],
              notes: 'Máxima sensibilidad para ríos de montaña, torrentes y pesca técnica en aguas transparentes.',
              isDefault: false,
              createdAt: '2026-03-01T00:00:00.000Z',
              updatedAt: '2026-03-01T00:00:00.000Z'
            }
          ];

          initialTackles.forEach((t) => writeStore.put(t));
          writeTx.oncomplete = () => resolve();
          writeTx.onerror = () => resolve();
        } else {
          resolve();
        }
      };
      countReq.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// Spot API
export async function getAllSpots(): Promise<FishingSpot[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('spots', 'readonly');
    const store = tx.objectStore('spots');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getSpotById(id: string): Promise<FishingSpot | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('spots', 'readonly');
    const store = tx.objectStore('spots');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSpot(spot: FishingSpot): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('spots', 'readwrite');
    const store = tx.objectStore('spots');
    const req = store.put(spot);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteSpot(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('spots', 'readwrite');
    const store = tx.objectStore('spots');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Catch API
export async function getAllCatches(): Promise<CatchLog[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('catches', 'readonly');
    const store = tx.objectStore('catches');
    const req = store.getAll();
    req.onsuccess = () => {
      const results = (req.result || []) as CatchLog[];
      results.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getCatchesBySpot(spotId: string): Promise<CatchLog[]> {
  const all = await getAllCatches();
  return all.filter((c) => c.spotId === spotId);
}

export async function saveCatch(catchLog: CatchLog): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('catches', 'readwrite');
    const store = tx.objectStore('catches');
    const req = store.put(catchLog);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteCatch(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('catches', 'readwrite');
    const store = tx.objectStore('catches');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Photo API
export async function getAllPhotos(): Promise<StoredPhoto[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readonly');
    const store = tx.objectStore('photos');
    const req = store.getAll();
    req.onsuccess = () => {
      const results = (req.result || []) as StoredPhoto[];
      results.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getPhotosByIds(ids: string[]): Promise<StoredPhoto[]> {
  if (!ids || ids.length === 0) return [];
  const db = await getDB();
  const photos: StoredPhoto[] = [];
  return new Promise((resolve) => {
    const tx = db.transaction('photos', 'readonly');
    const store = tx.objectStore('photos');
    let completed = 0;
    
    ids.forEach((id) => {
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) photos.push(req.result);
        completed++;
        if (completed === ids.length) resolve(photos);
      };
      req.onerror = () => {
        completed++;
        if (completed === ids.length) resolve(photos);
      };
    });
  });
}

export async function savePhoto(photo: StoredPhoto): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite');
    const store = tx.objectStore('photos');
    const req = store.put(photo);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite');
    const store = tx.objectStore('photos');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Tackle API
export async function getAllTackles(): Promise<TackleSet[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('tackles')) {
      resolve([]);
      return;
    }
    const tx = db.transaction('tackles', 'readonly');
    const store = tx.objectStore('tackles');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getTackleById(id: string): Promise<TackleSet | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('tackles')) {
      resolve(null);
      return;
    }
    const tx = db.transaction('tackles', 'readonly');
    const store = tx.objectStore('tackles');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveTackle(tackle: TackleSet): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('tackles')) {
      reject(new Error('Tackles store not initialized'));
      return;
    }
    const tx = db.transaction('tackles', 'readwrite');
    const store = tx.objectStore('tackles');
    store.put(tackle);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteTackle(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('tackles')) {
      resolve();
      return;
    }
    const tx = db.transaction('tackles', 'readwrite');
    const store = tx.objectStore('tackles');
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Backup & Restore
export interface BackupData {
  version: number;
  exportedAt: string;
  spots: FishingSpot[];
  catches: CatchLog[];
  photos: StoredPhoto[];
  tackles?: TackleSet[];
}

export async function exportBackup(includePhotos = true): Promise<BackupData> {
  const spots = await getAllSpots();
  const catches = await getAllCatches();
  const photos = includePhotos ? await getAllPhotos() : [];
  const tackles = await getAllTackles();

  return {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    spots,
    catches,
    photos,
    tackles,
  };
}

export async function importBackup(data: BackupData, mode: 'merge' | 'replace' = 'merge'): Promise<{ spotCount: number; catchCount: number; photoCount: number; tackleCount: number }> {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const stores = ['spots', 'catches', 'photos'];
    if (db.objectStoreNames.contains('tackles')) {
      stores.push('tackles');
    }

    const tx = db.transaction(stores, 'readwrite');
    const spotStore = tx.objectStore('spots');
    const catchStore = tx.objectStore('catches');
    const photoStore = tx.objectStore('photos');
    const tackleStore = db.objectStoreNames.contains('tackles') ? tx.objectStore('tackles') : null;

    if (mode === 'replace') {
      spotStore.clear();
      catchStore.clear();
      photoStore.clear();
      tackleStore?.clear();
    }

    let spotCount = 0;
    let catchCount = 0;
    let photoCount = 0;
    let tackleCount = 0;

    if (data.spots && Array.isArray(data.spots)) {
      data.spots.forEach((s) => {
        spotStore.put(s);
        spotCount++;
      });
    }

    if (data.catches && Array.isArray(data.catches)) {
      data.catches.forEach((c) => {
        catchStore.put(c);
        catchCount++;
      });
    }

    if (data.photos && Array.isArray(data.photos)) {
      data.photos.forEach((p) => {
        photoStore.put(p);
        photoCount++;
      });
    }

    if (tackleStore && data.tackles && Array.isArray(data.tackles)) {
      data.tackles.forEach((t) => {
        tackleStore.put(t);
        tackleCount++;
      });
    }

    tx.oncomplete = () => resolve({ spotCount, catchCount, photoCount, tackleCount });
    tx.onerror = () => reject(tx.error);
  });
}

async function migrateLegacyData(db: IDBDatabase): Promise<void> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(['spots', 'catches'], 'readwrite');
      const spotStore = tx.objectStore('spots');
      const catchStore = tx.objectStore('catches');

      const allSpotsReq = spotStore.getAll();
      allSpotsReq.onsuccess = () => {
        const spots: FishingSpot[] = allSpotsReq.result || [];
        spots.forEach((s) => {
          let updated = false;
          const newName = formatSpotName(s.name);
          if (newName !== s.name) {
            s.name = newName;
            updated = true;
          }
          if (s.spotType) {
            const newType = formatSpotType(s.spotType);
            const typeKeyMap: Record<string, string> = {
              'Espigón / Escollera': 'breakwater',
              'Costa rocosa / Pedrero': 'rocky',
              'Playa / Surfcasting': 'surf',
              'Ría / Desembocadura': 'estuary',
              'Embalse / Lago / Laguna': 'lake_pond',
              'Puerto / Marina': 'port',
              'Embarcación / Altura': 'boat',
              'Río / Torrente truchero': 'stream'
            };
            const mappedKey = typeKeyMap[newType];
            if (mappedKey && mappedKey !== s.spotType) {
              s.spotType = mappedKey as any;
              updated = true;
            }
          }
          if (s.bottomType && Array.isArray(s.bottomType)) {
            const newBottom = s.bottomType.map(formatBottomType);
            if (JSON.stringify(newBottom) !== JSON.stringify(s.bottomType)) {
              s.bottomType = newBottom;
              updated = true;
            }
          }
          if (s.targetSpecies && Array.isArray(s.targetSpecies)) {
            const newTargets = s.targetSpecies.map(formatSpeciesName);
            if (JSON.stringify(newTargets) !== JSON.stringify(s.targetSpecies)) {
              s.targetSpecies = newTargets;
              updated = true;
            }
          }
          if (s.bestSeasons && Array.isArray(s.bestSeasons)) {
            const newSeasons = s.bestSeasons.map(formatSeason);
            if (JSON.stringify(newSeasons) !== JSON.stringify(s.bestSeasons)) {
              s.bestSeasons = newSeasons;
              updated = true;
            }
          }
          if (s.bestTimeOfDay && Array.isArray(s.bestTimeOfDay)) {
            const newTimes = s.bestTimeOfDay.map(formatTimeOfDay);
            if (JSON.stringify(newTimes) !== JSON.stringify(s.bestTimeOfDay)) {
              s.bestTimeOfDay = newTimes;
              updated = true;
            }
          }
          if (s.snagRisk) {
            const newRisk = formatSnagRisk(s.snagRisk).toLowerCase();
            if (newRisk !== s.snagRisk) {
              s.snagRisk = newRisk as any;
              updated = true;
            }
          }
          if ((s as any).recommendedTide) {
            const newTide = formatTideName((s as any).recommendedTide);
            if (newTide !== (s as any).recommendedTide) {
              (s as any).recommendedTide = newTide;
              updated = true;
            }
          }
          if ((s as any).recommendedTideState) {
            const newState = formatTideState((s as any).recommendedTideState);
            if (newState !== (s as any).recommendedTideState) {
              (s as any).recommendedTideState = newState;
              updated = true;
            }
          }
          if (updated) {
            spotStore.put(s);
          }
        });
      };

      const allCatchesReq = catchStore.getAll();
      allCatchesReq.onsuccess = () => {
        const catches: CatchLog[] = allCatchesReq.result || [];
        catches.forEach((c) => {
          let updated = false;
          if (c.species) {
            const newSpecies = formatSpeciesName(c.species);
            if (newSpecies !== c.species) {
              c.species = newSpecies;
              updated = true;
            }
          }
          if (c.spotName) {
            const newSpotName = formatSpotName(c.spotName);
            if (newSpotName !== c.spotName) {
              c.spotName = newSpotName;
              updated = true;
            }
          }
          if (c.items && Array.isArray(c.items)) {
            c.items.forEach((item) => {
              if (item.species) {
                const newSp = formatSpeciesName(item.species);
                if (newSp !== item.species) {
                  item.species = newSp;
                  updated = true;
                }
              }
            });
          }
          if (c.weather) {
            if (c.weather.tideName) {
              const newTide = formatTideName(c.weather.tideName);
              if (newTide !== c.weather.tideName) {
                c.weather.tideName = newTide as any;
                updated = true;
              }
            }
            if (c.weather.tideState) {
              const newState = formatTideState(c.weather.tideState);
              if (newState !== c.weather.tideState) {
                c.weather.tideState = newState as any;
                updated = true;
              }
            }
            if (c.weather.waveHeight) {
              const newWave = formatWaveCondition(c.weather.waveHeight);
              if (newWave !== c.weather.waveHeight) {
                c.weather.waveHeight = newWave as any;
                updated = true;
              }
            }
            if (c.weather.condition) {
              const newCond = formatWeatherCondition(c.weather.condition);
              if (newCond !== c.weather.condition) {
                c.weather.condition = newCond as any;
                updated = true;
              }
            }
          }
          if (updated) {
            catchStore.put(c);
          }
        });
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}
