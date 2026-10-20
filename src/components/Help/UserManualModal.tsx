import React, { useState } from 'react';
import {
  BookOpen,
  MapPin,
  Fish,
  Calendar,
  Waves,
  HardDrive,
  X,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  Compass,
  Layers,
  ArrowRight,
  Camera,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface UserManualModalProps {
  onClose: () => void;
  onOpenTideGraph?: () => void;
  onOpenCompass?: () => void;
  onOpenTackleBox?: () => void;
  onOpenPatternPrediction?: () => void;
  onOpenBackup?: () => void;
  onOpenPrivacyPolicy?: () => void;
}

type ManualSectionId = 
  | 'start' 
  | 'map-spots' 
  | 'catches' 
  | 'tactical' 
  | 'photos-analytics' 
  | 'offline-backup' 
  | 'faq';

interface SectionNav {
  id: ManualSectionId;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionNav[] = [
  { id: 'start', title: 'Guía de Inicio Rápido', shortTitle: 'Inicio', icon: Sparkles },
  { id: 'map-spots', title: 'Mapa & Spots GPS', shortTitle: 'Mapa', icon: MapPin },
  { id: 'catches', title: 'Diario de Capturas & Calendario', shortTitle: 'Capturas', icon: Fish },
  { id: 'tactical', title: 'Mareas, Brújula & Táctica', shortTitle: 'Táctica', icon: Waves },
  { id: 'photos-analytics', title: 'Fotos & Estadísticas de Trofeos', shortTitle: 'Estadísticas', icon: BarChart3 },
  { id: 'offline-backup', title: 'Modo Offline & Copia de Seguridad', shortTitle: 'Backup', icon: HardDrive },
  { id: 'faq', title: 'Preguntas Frecuentes (FAQ)', shortTitle: 'FAQ', icon: HelpCircle },
];

export const UserManualModal: React.FC<UserManualModalProps> = ({
  onClose,
  onOpenTideGraph,
  onOpenCompass,
  onOpenTackleBox,
  onOpenPatternPrediction,
  onOpenBackup,
  onOpenPrivacyPolicy,
}) => {
  const [activeSection, setActiveSection] = useState<ManualSectionId>('start');

  return (
    <div
      className="fixed inset-0 z-[1300] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[94vh] max-h-[850px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 id="manual-modal-title" className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight truncate">
                  {'Guía de Usuario & Manual Práctico de AnglerLog'}
                </h2>
                <span className="text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold shrink-0">
                  {'Manual Práctico'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                {'Todo sobre spots GPS, tablas de mareas solunares, gestión de aparejos y capturas offline'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label={'Cerrar manual'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout Body: Sidebar Navigation + Content Panel */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Sidebar / Subnav */}
          <nav className="w-full md:w-60 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-2 sm:p-3 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto scrollbar-none">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="hidden md:inline">{section.title}</span>
                  <span className="md:hidden">{section.shortTitle}</span>
                </button>
              );
            })}
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* 1. Quick Start */}
            {activeSection === 'start' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>{'Inicio Rápido (3 sencillos pasos)'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'¡Bienvenido a AnglerLog! Comienza tu experiencia con estos 3 pasos básicos.'}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-white text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-mono shrink-0">1</span>
                      <span>{'Marcar un spot de pesca en el mapa'}</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1.5 pl-0 sm:pl-7 leading-relaxed">
                      <p>
                        {'Accede al Mapa de Spots. Toca cualquier punto junto al agua o pulsa "Mi Ubicación" para guardar un waypoint GPS exacto con un solo clic.'}
                      </p>
                      <p>
                        {'Registra la profundidad, el tipo de fondo (arena, rocas, algas), accesos de aparcamiento y riesgo de enroque.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-white text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-mono shrink-0">2</span>
                      <span>{'Registrar captura (especie, señuelo, equipo y clima)'}</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1.5 pl-0 sm:pl-7 leading-relaxed">
                      <p>
                        {'Pulsa en "+ Registrar Captura" o selecciona un spot existente. Anota la especie, longitud en cm, peso en kg, señuelo utilizado y condiciones climáticas.'}
                      </p>
                      <p>
                        {'Las jornadas sin picada (porras) también se pueden registrar activando la opción "Jornada sin capturas (Porra)", lo que te permite recopilar valiosos datos de presión y temperatura.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-white text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-mono shrink-0">3</span>
                      <span>{'Añadir a la pantalla de inicio (PWA Offline)'}</span>
                    </div>
                    <div className="text-xs text-slate-400 pl-0 sm:pl-7 leading-relaxed">
                      <p>
                        {'Pulsa en "Instalar App" o utiliza el menú de tu navegador ("Añadir a la pantalla de inicio"). AnglerLog funciona en el agua completamente sin conexión a internet.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-slate-900 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white">{'Siguiente paso: Dominar el mapa y funciones GPS'}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{'Descubre los sub-spots, mapas satelitales y almacenamiento en caché offline'}</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('map-spots')}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg text-xs transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <span>{'Siguiente sección'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Map & Spots */}
            {activeSection === 'map-spots' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{'Mapa de Spots & Gestión GPS'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Herramientas de cartografía precisa para pescadores de costa y embarcación.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{'Múltiples Capas de Mapas'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Alterna entre imagen satelital de alta resolución (Esri World Imagery), mapa topográfico (OpenTopoMap para perfiles de costa y relieve) y mapa estándar (OpenStreetMap). Las teselas de mapas exploradas se guardan automáticamente en caché para uso offline.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{'Sub-spots GPS (Puntos Calientes Exactos)'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Dentro de una zona de pesca amplia (una ría, ensenada o embalse), puedes registrar sub-spots precisos para marcar el cantil exacto, la piedra sumergida o el bajo con mayor actividad.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{'Riesgo de Enroque & Zonas a Evitar'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Registra el nivel de enganche (fondos rocosos, árboles sumergidos) y marca zonas de veda, cotos protegidos o accesos peligrosos.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Catches & Calendar */}
            {activeSection === 'catches' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <Fish className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>{'Diario de Capturas & Calendario'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Registra cada lance con precisión para identificar patrones de picada recurrentes.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'Registro Múltiple & Mediciones'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Añade múltiples piezas por jornada con talla exacta en cm, peso en kg, señuelo utilizado y profundidad de ataque.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{'Calendario Mensual con Fases Lunares'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Consulta tus salidas de pesca pasadas en un calendario visual con información de fases lunares (luna llena, nueva) y coeficientes de marea.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'Ficha de Captura con Spot Secreto Protegido'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Genera elegantes tarjetas de trofeos para compartir en redes sociales, donde las coordenadas GPS y nombres exactos quedan ocultos automáticamente.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Tactical Tools */}
            {activeSection === 'tactical' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <Waves className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>{'Herramientas Tácticas: Mareas, Brújula & Previsión'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Planifica la mejor jornada combinando cálculos astronómicos y datos meteorológicos.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{'Curva de Mareas & Nivel del Mar'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Gráfico de nivel de marea en tiempo real con pleamar (alta), bajamar (baja) y fases de repunte para zonas costeras y estuarios.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{'Brújula de Pesca & Deriva por Viento'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Orientación en el agua con rosa de los vientos, cálculo de orillas batidas por el viento y líneas de deriva de la embarcación.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{'Previsión Solunar de Actividad de Peces'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Cálculo combinado de posición lunar, horas solares, mareas y presión barométrica para predecir las ventanas óptimas de actividad de los depredadores.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Photos & Analytics */}
            {activeSection === 'photos-analytics' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span>{'Galería de Fotos & Récords Personales (PB)'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Inmortaliza tus mejores jornadas y analiza tus marcas personales.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-pink-400 shrink-0" />
                      <span>{'Galería Fotográfica'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Galería visual de todas tus fotos de pesca con filtros por especie y fecha. Las imágenes se comprimen y almacenan de forma local en tu navegador.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'Trofeos & Récord Personal (PB)'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Cuadro de honor automático con tus mayores capturas clasificadas por especie (mayor longitud en cm y mayor peso en kg).'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Offline & Backup */}
            {activeSection === 'offline-backup' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{'Modo Offline & Copia de Seguridad'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Máxima seguridad y protección integral de tus pesqueros secretos.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{'Almacenamiento 100% Local (IndexedDB)'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Todos tus spots, coordenadas GPS, fotos y notas se guardan de forma interna en tu propio navegador. Nada se transmite a servidores de terceros.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{'Exportación & Importación JSON'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Exporta todo tu diario de pesca en un archivo JSON con un solo clic para transferirlo a otro dispositivo o conservarlo como copia de seguridad en tu ordenador.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. FAQ */}
            {activeSection === 'faq' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>{'Preguntas Frecuentes (FAQ)'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Respuestas a las dudas más habituales sobre el uso de la aplicación.'}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'¿Funciona la aplicación sin cobertura móvil?'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'¡Sí! Una vez instalada como PWA, el registro de capturas, la gestión de spots y la brújula funcionan de forma completamente offline.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'¿Se comparten mis spots secretos con otros usuarios?'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'No. AnglerLog no es una red social, sino tu diario de pesca estrictamente personal y confidencial. Tus datos nunca salen de tu dispositivo.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'¿Cómo cambio de dispositivo sin perder mis datos?'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Ve a la opción "Copia de Seguridad", pulsa en "Exportar Copia" y descarga el archivo JSON. En tu nuevo dispositivo, pulsa en "Restaurar Copia" y selecciona dicho archivo.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 text-[11px] text-slate-400">
          <span>{'AnglerLog v1.0.0 — Edición en Español'}</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            {'Cerrar'}
          </button>
        </div>

      </div>
    </div>
  );
};
