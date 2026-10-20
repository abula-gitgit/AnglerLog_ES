/**
 * Universal formatting & translation utilities for fishing domain data (Spanish Edition)
 * Automatically normalizes stored strings to clean Spanish.
 */

export function formatTideName(name?: string | null): string {
  if (!name) return '';
  const n = name.trim();
  if (n.includes('大潮') || n.toLowerCase().includes('spring') || n.includes('vives') || n.toLowerCase().includes('vivas')) return 'Mareas vivas';
  if (n.includes('中潮') || n.toLowerCase().includes('mid') || n.toLowerCase().includes('middle') || n.includes('moyenne') || n.toLowerCase().includes('intermedias')) return 'Mareas intermedias';
  if (n.includes('小潮') || n.toLowerCase().includes('neap') || n.includes('mortes') || n.toLowerCase().includes('muertas')) return 'Mareas muertas';
  if (n.includes('長潮') || n.toLowerCase().includes('standstill') || n.includes('transition') || n.toLowerCase().includes('larga')) return 'Marea larga';
  if (n.includes('若潮') || n.toLowerCase().includes('young') || n.toLowerCase().includes('joven')) return 'Marea joven';
  return n;
}

export function formatTideState(state?: string | null): string {
  if (!state) return '';
  const s = state.trim();
  if (s.includes('上げ3分') || s.includes('Rising (Early)') || s.includes('Montante (Début)') || s.includes('Auflaufend (Beginn)') || s.includes('Llenante (inicio)')) {
    return 'Llenante (inicio)';
  }
  if (s.includes('上げ7分') || s.includes('Rising (Late)') || s.includes('Peak Flow') || s.includes('Montante (Plein flot)') || s.includes('Auflaufend (Hauptstrom)') || s.includes('Llenante (flujo principal)')) {
    return 'Llenante (flujo principal)';
  }
  if (s.includes('下げ3分') || s.includes('Falling (Early)') || s.includes('Descendante (Début)') || s.includes('Ablaufend (Beginn)') || s.includes('Vaciante (inicio)')) {
    return 'Vaciante (inicio)';
  }
  if (s.includes('下げ7分') || s.includes('Falling (Late)') || s.includes('Descendante (Plein jusant)') || s.includes('Ablaufend (Hauptstrom)') || s.includes('Vaciante (reflujo principal)')) {
    return 'Vaciante (reflujo principal)';
  }
  if (s.includes('満潮前後') || s.includes('High Tide (Turn)') || s.includes('Hochwasser (Kippphase)')) return 'Pleamar (Repunte)';
  if (s.includes('干潮前後') || s.includes('Low Tide (Turn)') || s.includes('Niedrigwasser (Kippphase)')) return 'Bajamar (Repunte)';
  if (s.includes('満潮') || s === 'High Tide' || s.includes('Pleine mer') || s.includes('Hochwasser') || s.includes('Pleamar')) return 'Pleamar (Alta)';
  if (s.includes('干潮') || s === 'Low Tide' || s.includes('Basse mer') || s.includes('Niedrigwasser') || s.includes('Bajamar')) return 'Bajamar (Baja)';
  if (s.includes('潮止まり') || s.toLowerCase().includes('slack') || s.includes('Étale') || s.includes('Stauwasser') || s.includes('Repunte')) return 'Repunte de marea';
  if (s.includes('上げ') || s.includes('上潮') || s.toLowerCase().includes('flood') || s.toLowerCase().includes('rising') || s.includes('Auflaufend')) {
    return 'Marea subiendo (Llenante)';
  }
  if (s.includes('下げ') || s.includes('引潮') || s.toLowerCase().includes('ebb') || s.toLowerCase().includes('falling') || s.includes('Ablaufend')) {
    return 'Marea bajando (Vaciante)';
  }
  return s;
}

export function formatWaveCondition(wave?: string | null): string {
  if (!wave) return '';
  const w = wave.trim();
  if (w.includes('ベタ凪') || w.toLowerCase() === 'calm' || w.includes('calme') || w.includes('Ruhige') || w.includes('calma')) return 'Mar en calma';
  if (w.includes('凪') || w.toLowerCase().includes('light chop') || w.includes('Légèrement') || w.includes('Leichte') || w.includes('Marejadilla')) return 'Marejadilla';
  if (w.includes('やや波あり') || w.toLowerCase().includes('moderate') || w.includes('agitée') || w.includes('Mäßige') || w.includes('Marejada')) return 'Marejada';
  if (w.includes('波高') || w.includes('荒れ') || w.toLowerCase().includes('rough') || w.includes('forte') || w.includes('Raue') || w.includes('Oleaje')) return 'Fuerte marejada / Oleaje';
  return w;
}

export function formatWeatherCondition(condition?: string | null): string {
  if (!condition) return '';
  const c = condition.trim().toLowerCase();
  if (c.includes('晴') || c === 'sunny' || c === 'clear' || c.includes('ensoleillé') || c.includes('sonnig') || c.includes('soleado')) return 'Soleado / Despejado';
  if (c.includes('曇') || c === 'cloudy' || c.includes('nuageux') || c.includes('bewölkt') || c.includes('nublado')) return 'Nublado';
  if (c.includes('大雨') || c.includes('豪雨') || c === 'heavy_rain' || c.includes('orage') || c.includes('starkregen') || c.includes('torrencial')) return 'Lluvia torrencial / Tormenta';
  if (c.includes('雨') || c === 'rain' || c.includes('pluie') || c.includes('regen') || c.includes('lluvia')) return 'Lluvia';
  if (c.includes('霧') || c.includes('fog') || c.includes('brouillard') || c.includes('nebel') || c.includes('niebla')) return 'Niebla / Neblina';
  if (c.includes('強風') || c === 'windy' || c.includes('vent') || c.includes('windig') || c.includes('viento')) return 'Viento fuerte';
  return condition;
}

export function formatSpotType(type?: string | null): string {
  if (!type) return 'Desconocido';
  const t = type.trim();
  if (t === 'breakwater' || t.includes('堤防') || t.includes('Digue') || t.includes('Jetée') || t.includes('Mole') || t.includes('Espigón')) return 'Espigón / Escollera';
  if (t === 'rocky' || t.includes('磯') || t.includes('rocheuse') || t.includes('Felsküste') || t.includes('Pedrero')) return 'Costa rocosa / Pedrero';
  if (t === 'surf' || t.includes('サーフ') || t.includes('Plage') || t.includes('Brandungsstrand') || t.includes('Playa')) return 'Playa / Surfcasting';
  if (t === 'estuary' || t.includes('河口') || t.includes('Estuaire') || t.includes('Flussmündung') || t.includes('Ría')) return 'Ría / Desembocadura';
  if (t === 'lake_pond' || t.includes('湖') || t.includes('Lac') || t.includes('See') || t.includes('Embalse')) return 'Embalse / Lago / Laguna';
  if (t === 'port' || t.includes('漁港') || t.includes('Port') || t.includes('Hafen') || t.includes('Puerto')) return 'Puerto / Marina';
  if (t === 'boat' || t.includes('ボート') || t.includes('Bateau') || t.includes('Boot') || t.includes('Embarcación')) return 'Embarcación / Altura';
  if (t === 'stream' || t.includes('渓流') || t.includes('Ruisseau') || t.includes('Bach') || t.includes('Río')) return 'Río / Torrente truchero';
  return type;
}

export function formatBottomType(bottom?: string | null): string {
  if (!bottom) return '';
  const b = bottom.trim();
  const map: Record<string, string> = {
    '砂地': 'Arena',
    '砂': 'Arena',
    'Sand': 'Arena',
    'Sable': 'Arena',
    'Arena': 'Arena',
    '泥': 'Fango / Cieno',
    '泥底': 'Fango / Cieno',
    'Mud': 'Fango / Cieno',
    'Vase / Boue': 'Fango / Cieno',
    'Schlamm / Modder': 'Fango / Cieno',
    'Fango / Cieno': 'Fango / Cieno',
    '敷石': 'Escollera / Piedra suelta',
    'Enrochement / Pierres': 'Escollera / Piedra suelta',
    'Steinpackung / Schotter': 'Escollera / Piedra suelta',
    '沈み根': 'Bajos rocosos / Arrecife',
    'Récif submergé': 'Bajos rocosos / Arrecife',
    'Unterwasserberg / Riff': 'Bajos rocosos / Arrecife',
    'Bajos rocosos / Arrecife': 'Bajos rocosos / Arrecife',
    '海藻・ウィード': 'Algas / Praderas submarinas',
    'Algues / Herbier': 'Algas / Praderas submarinas',
    'Herbier': 'Algas',
    'Krautfeld / Wasserpflanzen': 'Algas / Praderas submarinas',
    'Krautfeld': 'Algas',
    'Algas / Praderas submarinas': 'Algas / Praderas submarinas',
    'テトラポッド': 'Bloques de hormigón',
    'Tétrapodes': 'Bloques de hormigón',
    'Tetrapoden / Deckwerk': 'Bloques de hormigón',
    'ブレイク・カケアガリ': 'Cantil / Desnivel',
    'Tombant / Cassure': 'Cantil / Desnivel',
    'Abbruchkante / Unterwasserkante': 'Cantil / Desnivel',
    'Cantil / Desnivel': 'Cantil / Desnivel',
    'ゴロタ石': 'Guijarros / Cantos rodados',
    'Galets / Gros blocs': 'Guijarros / Cantos rodados',
    'Geröll / Grobe Steine': 'Guijarros / Cantos rodados',
    'Guijarros / Cantos rodados': 'Guijarros / Cantos rodados',
    'Roches / Récif': 'Rocas / Arrecife',
    'Felsen / Riff': 'Rocas / Arrecife',
    'Rocas / Arrecife': 'Rocas / Arrecife',
    '立ち木': 'Árboles sumergidos',
    'Bois immergé': 'Árboles sumergidos',
    'Totholz / Versunkene Bäume': 'Árboles sumergidos',
    'Árboles sumergidos': 'Árboles sumergidos',
  };
  return map[b] || b;
}

const SPECIES_TRANSLATION_MAP: Record<string, string> = {
  // Multilingual mapping to Spanish
  'Hecht': 'Lucio',
  'Pike': 'Lucio',
  'Northern Pike': 'Lucio',
  'Brochet': 'Lucio',
  'Lucio': 'Lucio',

  'Zander': 'Lucioperca',
  'Sandre': 'Lucioperca',
  'Walleye': 'Lucioperca',
  'Lucioperca': 'Lucioperca',

  'Flussbarsch': 'Perca europea',
  'Barsch': 'Perca',
  'Perch': 'Perca',
  'European Perch': 'Perca europea',
  'Perche': 'Perca',
  'Perche commune': 'Perca europea',
  'Perca': 'Perca',

  'Forelle': 'Trucha',
  'Bachforelle': 'Trucha común / Fario',
  'Brown Trout': 'Trucha común / Fario',
  'Truite fario': 'Trucha común / Fario',
  'Trucha': 'Trucha',
  'Trucha común': 'Trucha común',

  'Regenbogenforelle': 'Trucha arcoíris',
  'Rainbow Trout': 'Trucha arcoíris',
  'Truite arc-en-ciel': 'Trucha arcoíris',
  'ニジマス': 'Trucha arcoíris',
  'Trucha arcoíris': 'Trucha arcoíris',

  'Seeforelle': 'Trucha de lago',
  'Lake Trout': 'Trucha de lago',
  'Truite de lac': 'Trucha de lago',

  'Meerforelle': 'Reo / Trucha marina',
  'Sea Trout': 'Reo / Trucha marina',
  'Truite de mer': 'Reo / Trucha marina',
  'Reo': 'Reo',

  'Dorsch': 'Bacalao',
  'Kabeljau': 'Bacalao',
  'Cod': 'Bacalao',
  'Cabillaud / Morue': 'Bacalao',
  'Bacalao': 'Bacalao',

  'Wolfsbarsch': 'Lubina',
  'Sea Bass': 'Lubina',
  'Bar commun (Loup)': 'Lubina',
  'Bar commun': 'Lubina',
  'シーバス': 'Lubina',
  'スズキ': 'Lubina',
  'Lubina': 'Lubina',
  'Róbalo': 'Lubina',

  'Karpfen': 'Carpa',
  'Carp': 'Carpa',
  'Common Carp': 'Carpa común',
  'Carpe': 'Carpa',
  'コイ': 'Carpa',
  'Carpa': 'Carpa',

  'Wels': 'Siluro',
  'Waller': 'Siluro',
  'Catfish': 'Siluro / Bagre',
  'Silure': 'Siluro',
  'Siluro': 'Siluro',

  'Aal': 'Anguila',
  'Eel': 'Anguila',
  'Anguille': 'Anguila',
  'Anguila': 'Anguila',

  'Schleie': 'Tenca',
  'Tench': 'Tenca',
  'Tanche': 'Tenca',
  'Tenca': 'Tenca',

  'Barbe': 'Barbo',
  'Barbel': 'Barbo',
  'Barbeau': 'Barbo',
  'Barbo': 'Barbo',

  'Brasse': 'Brema',
  'Bream': 'Brema',
  'Brème': 'Brema',
  'Brema': 'Brema',

  'Makrele': 'Caballa',
  'Mackerel': 'Caballa',
  'Maquereau': 'Caballa',
  'Caballa': 'Caballa',

  'Daurade royale': 'Dorada',
  'Goldbrasse / Dorade': 'Dorada',
  'Dorade': 'Dorada',
  'Dorada': 'Dorada',

  'Daurade / Pagre': 'Pargo / Pagel',
  'Meerbrasse': 'Sargo / Pargo',
  'Sargo': 'Sargo',
  'Sar commun': 'Sargo',

  'Dentex': 'Dentón',
  'Dentón': 'Dentón',

  'Mero': 'Mero',
  'Mérou': 'Mero',
  'Grouper': 'Mero',

  'Bonito': 'Bonito del norte',
  'Atún': 'Atún rojo',
  'Jurel': 'Jurel',
  'Chinchard': 'Jurel',

  'Lieu jaune': 'Abadejo',
  'Pollack': 'Abadejo',
  'Abadejo': 'Abadejo',

  'Seiche': 'Sepia / Choco',
  'Sepia / Tintenfisch': 'Sepia / Choco',
  'Sepia': 'Sepia / Choco',
  'Choco': 'Sepia / Choco',

  'Calmar / Seiche': 'Calamar',
  'Kalmar / Tintenfisch': 'Calamar',
  'Calamar': 'Calamar',

  'Pulpo': 'Pulpo',
  'Octopus': 'Pulpo',
  'Poulpe': 'Pulpo',

  'Black Bass': 'Black Bass',
  'Bass': 'Black Bass',
};

export function formatSpeciesName(species?: string | null): string {
  if (!species) return '';
  const s = species.trim();
  return SPECIES_TRANSLATION_MAP[s] || s;
}

export function formatSpotName(name?: string | null): string {
  if (!name) return 'Spot sin nombre';
  return name.trim();
}

export function formatSeason(season?: string | null): string {
  if (!season) return '';
  const s = season.toLowerCase().trim();
  if (s.includes('primavera') || s.includes('spring') || s.includes('printemps') || s.includes('frühling') || s.includes('春')) return 'Primavera';
  if (s.includes('verano') || s.includes('summer') || s.includes('été') || s.includes('sommer') || s.includes('夏')) return 'Verano';
  if (s.includes('otoño') || s.includes('autumn') || s.includes('fall') || s.includes('automne') || s.includes('herbst') || s.includes('秋')) return 'Otoño';
  if (s.includes('invierno') || s.includes('winter') || s.includes('hiver') || s.includes('冬')) return 'Invierno';
  return season;
}

export function formatTimeOfDay(tod?: string | null): string {
  if (!tod) return '';
  const t = tod.toLowerCase().trim();
  if (t.includes('amanecer') || t.includes('dawn') || t.includes('aube') || t.includes('morgen') || t.includes('朝')) return 'Amanecer';
  if (t.includes('atardecer') || t.includes('dusk') || t.includes('crépuscule') || t.includes('abend') || t.includes('夕')) return 'Atardecer';
  if (t.includes('día') || t.includes('day') || t.includes('jour') || t.includes('tag') || t.includes('昼')) return 'Durante el día';
  if (t.includes('noche') || t.includes('night') || t.includes('nuit') || t.includes('nacht') || t.includes('夜')) return 'Noche';
  return tod;
}

export function formatSnagRisk(risk?: string | null): string {
  if (!risk) return 'Bajo';
  const r = risk.trim().toLowerCase();
  if (r === 'low' || r === 'faible' || r === 'gering' || r === 'bajo' || r === '低' || r === 'なし' || r === 'none') return 'Bajo';
  if (r === 'medium' || r === 'modéré' || r === 'mäßig' || r === 'mittel' || r === 'moderado' || r === 'medio' || r === '中') return 'Moderado';
  if (r === 'high' || r === 'élevé' || r === 'hoch' || r === 'alto' || r === '高') return 'Alto';
  return risk;
}
