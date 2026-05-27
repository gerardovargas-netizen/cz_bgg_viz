// Este archivo es el “cableado” del prototipo:
// cuando el lector avanza por el texto (a la derecha), Scrollama nos avisa,
// y nosotros cambiamos el contenido de la tarjeta fija (a la izquierda).

const CSV_PATH = "bgg_data/BGG_FullExtras_Final_V3.csv";

let bggData = [];

// Guardamos aquí el estado del paso actual cuando tiene varias claves (por el “+”).
let activeKeys = [];
let activeKeyIndex = 0;

let activeEcharts = null;

const scroller = scrollama();

const scrollyEl = document.getElementById("scrolly");
const stickyMediaEl = document.getElementById("sticky-media");
const stickyControlsEl = document.getElementById("sticky-controls");
const stickyIndicatorEl = document.getElementById("sticky-indicator");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");

// Esta tabla viene de ImgRef.md. La intención es simple: cuando el texto pide una imagen,
// sabemos exactamente qué archivo y qué pie de foto mostrar.
const IMG_MAP = {
  "Kanban 01": { file: "img/Kanban_01.webp", captionLines: ["*Kanban EV*, Vital Lacerda, Eagle-Gryphon Games, 2020", "\"Los trabajadores de la fábrica de vehículos eléctricos optimizan e innovan para destacar en la gran reunión de la junta directiva\"", "(@newrev, https://boardgamegeek.com/image/5095231/)"] },
  "Agricola 01": { file: "img/Agricola_01.webp", captionLines: ["*Agricola*, Uwe Rosenberg, Lookout Games, 2007", "\"Construye tu granja sembrando campos y criando ganado. ¡Pero no olvides comer!\"", "(@nerdymove, https://boardgamegeek.com/image/1885236/)"] },
  "Freedom 01": { file: "img/Freedom_01.webp", captionLines: ["*Freedom: The Underground Railroad*, Brian Mayer, Academy Games, 2013", "\"Únete a otros abolicionistas para emancipar a los esclavos y guiarlos hacia la libertad en Canadá\"", "(@Puma85, https://boardgamegeek.com/image/5783098/)"] },
  "Freedom 02": { file: "img/Freedom_02.webp", captionLines: ["*Freedom: The Underground Railroad*, Brian Mayer, Academy Games, 2013", "\"Únete a otros abolicionistas para emancipar a los esclavos y guiarlos hacia la libertad en Canadá\"", "(@Puma85, https://boardgamegeek.com/image/5783098/)"] },
  "AceSpades 01": { file: "img/AceSpades_01.webp", captionLines: ["*Ace of Spades*, Benjamín Amorín, Devir, 2025", "\"Canaliza tu magia a través de jugadas de póker para resolver duelos peligrosos\"", "(@NasumQSU, https://boardgamegeek.com/image/9026993/)"] },
  "AceSpades 02": { file: "img/AceSpades_02.webp", captionLines: ["*Ace of Spades*, Benjamín Amorín, Devir, 2025", "\"Canaliza tu magia a través de jugadas de póker para resolver duelos peligrosos\"", "(@jambapg, https://boardgamegeek.com/image/9032399)"] },
  "IanBogost 01": { file: "img/IanBogost_01.avif", captionLines: ["Ian Bogost, Persuasive Games. The Expressive Power of Videogames, MIT Press, 2010", "\"Una exploración de la forma en que los videojuegos plantean argumentos y hacen declaraciones expresivas sobre el mundo, y que analiza su singular poder persuasivo en términos de sus propiedades computacionales\""] },
  "CV 01": { file: "img/CV_01.webp", captionLines: ["*CV*, Filip Miłuński, Gigamic, 2013", "\"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\"", "(@szafa, https://boardgamegeek.com/image/1695059/)"] },
  "CV 02": { file: "img/CV_02.webp", captionLines: ["*CV*, Filip Miłuński, Gigamic, 2013", "\"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\"", "(@Benterdimensional, https://boardgamegeek.com/image/5404873/)"] },
  "CV 03": { file: "img/CV_03.webp", captionLines: ["*CV*, Filip Miłuński, Gigamic, 2013", "\"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\"", "(@p0w3rserj, https://boardgamegeek.com/image/3598537/)"] },
  "Santa Maria 01": { file: "img/SantaMaria_01.webp", captionLines: ["*Santa Maria*, Kristian Amundsen Østby y Eilif Svensson, Aporta Games, 2017", "\"Construye y maximiza tu colonia de poliominós en el Nuevo Mundo\"", "(@sverbeure, https://boardgamegeek.com/image/3919584/)"] },
  "Azul 01": { file: "img/Azul_01.webp", captionLines: ["*Azul*, Michael Kiesling, Next Move Games, 2017", "\"Embellece artísticamente las paredes de tu palacio obteniendo los azulejos más hermosos\"", "(@EchoOperative, https://boardgamegeek.com/image/3720018/)"] },
  "Hegemony 01": { file: "img/Hegemony_01.webp", captionLines: ["*Hegemony: Lead Your Class to Victory*, Vangelis Bagiartakis y Varnavas Timotheou, Hegemonic Project Games, 2023", "\"Simula una nación contemporánea completa en este eurojuego asimétrico de corte político-económico\"", "(@Tabletopping_Games, https://boardgamegeek.com/image/6499211/)"] },
  "Heat 01": { file: "img/Heat_01.webp", captionLines: ["*Heat: Pedal to the Metal*, Asger Aleksandrov Granerud y Daniel Skjold Pedersen, Days of Wonder, 2022", "\"Lleva tu coche al límite en busca de la victoria, pero no lo sobrecalientes\"", "(@SlyMathMan, https://boardgamegeek.com/image/7600012/)"] },
  "Chess 01": { file: "img/Chess_01.webp", captionLines: ["*Ajedrez*, c. s. 15", "\"Jaque mate a tu oponente en este atemporal abstracto\"", "(@jack61, https://boardgamegeek.com/image/322244/)"] },
  "Yinsh 01": { file: "img/Yinsh_01.webp", captionLines: ["*YINSH*, Kris Burm, Don & Co., 2003", "\"Mueve los anillos sobre las piezas para darles la vuelta, creando filas de cinco de tu color\"", "(@minordemon, https://boardgamegeek.com/image/32162/)"] },
  "Planted 01": { file: "img/Planted_01.webp", captionLines: ["*Planted*: A Game of Nature & Nurture, Phil Walker-Harding, Buffalo Games, 2022", "\"Cuida tu propia colección de plantas de interior\"", "(@huggynkiss, https://boardgamegeek.com/image/7535111/)"] },
  "Amritsar 01": { file: "img/Amritsar_01.webp", captionLines: ["*Amritsar: The Golden Temple*, David Heras Pino, Ludonova, 2023", "\"El maharajá necesita tus habilidades con el mancala y tu elefante para reconstruir el templo\"", "(@dramaplastika, https://boardgamegeek.com/image/7606954/)"] },
  "Agricola 02": { file: "img/Agricola_02.webp", captionLines: ["*Agricola*, Uwe Rosenberg, Lookout Games, 2007", "\"Construye tu granja sembrando campos y criando ganado. ¡Pero no olvides comer!\"", "(@milenaguberinic, https://boardgamegeek.com/image/2459385/)"] },
  "MenNefer 01": { file: "img/MenNefer_01.webp", captionLines: ["*Men-Nefer*, Germán P. Millán, Ludonova, 2024", "\"Viaja a la capital del antiguo Egipto y participa en el desarrollo de su cultura\"", "(@dramaplastika, https://boardgamegeek.com/image/8306856/)"] },
  "LittleWars 01": { file: "img/LittleWars_01.jpg", captionLines: ["*Little Wars*, H. G. Wells, Frank Palmer, 1913", "\"Un juego para chicos de doce a ciento cincuenta años y para ese tipo de chica inteligente a la que le gustan los juegos y libros de chicos\"", "(https://en.wikipedia.org/wiki/Little_Wars#/media/File:HG_Wells_playing_to_Little_Wars.jpg)"] },
  "Gettysburg 01": { file: "img/Gettysburg_01.webp", captionLines: ["*Gettysburg*, Charles S. Roberts, The Avalon Hills Games, 1958", "\"Una representación temprana de un juego de guerra de mesa sobre la crucial batalla de la Guerra Civil\"", "(@theaney, https://boardgamegeek.com/image/131796/)"] },
  "Granada 01": { file: "img/Granada_01.webp", captionLines: ["*Granada*, Iván Cáceres, Compass Games, 2021", "\"Los últimos años de la Reconquista\"", "(@perdut, https://boardgamegeek.com/image/5366074/)"] },
  "FireLake 01": { file: "img/FireLake_01.webp", captionLines: ["*Fire in the Lake*, Mark Herman y Volko Ruhnke, GMT Games, 2014", "\"Juega como Estados Unidos, el Vietcong, el Ejército de la República de Vietnam o el Ejército Popular de Vietnam para controlar Vietnam en COIN: Volumen IV\"", "(@Jobermallow, https://boardgamegeek.com/image/2212850/)"] },
  "DienBienPhu 01": { file: "img/DienBienPhu_01.webp", captionLines: ["*Dien Bien Phu: The Final Gamble*, Kim Kanger, Legion Wargames LLC, 2014", "\"El enfrentamiento final entre el Viet Minh y Francia en un valle remoto de Vietnam\"", "(@Jean_Leviathan, https://boardgamegeek.com/image/8890208/)"] },
  "EmbersWar 01": { file: "img/EmbersWar_01.jpg", captionLines: ["*Embers of War: The Fall of an Empire and the Making of America's Vietnam*, Frederik Logevall, Random House, 2013", "\"Ganador del Premio Pullitzer en 2013, el libro abarca el conflicto de Vietnam desde la Conferencia de Paz de Versalles de 1919 hasta 1959, cuando los primeros soldados estadounidenses mueren en una emboscada cerca de Saigón en Vietnam, centrándose en la Guerra de Indochina entre Francia y el Viet Minh\""] },
  "Memoir44 01": { file: "img/Memoir44_01.webp", captionLines: ["*Memoir '44*, Richard Borg, Days of Wonder, 2004", "\"Revive las batallas del Día D y controla las fuerzas de los Aliados y del Eje\"", "(@chuckles2000, https://boardgamegeek.com/image/61082/)"] },
  "CubaLibre 01": { file: "img/CubaLibre_01.webp", captionLines: ["*Cuba Libre*, Jeff Grossman y Volko Ruhnke, GMT Games, 2013", "\"Juega como una de las cuatro facciones que compiten por el control de Cuba en COIN Vol:2, un juego de cartas\"", "(@Djord, https://boardgamegeek.com/image/3885338/)"] },
  "BritishWay 01": { file: "img/BritishWay_01.webp", captionLines: ["*The British Way: Counterinsurgency at the End of Empire*, Stephen Rangazas, GMT Games, 2023", "\"Cuatro simulacros de guerra sobre la contrainsurgencia británica en Palestina, Malasia, Kenia y Chipre\"", "(@Djord, https://boardgamegeek.com/image/7597139/)"] },
  "BritishWay 02": { file: "img/BritishWay_02.webp", captionLines: ["*The British Way: Counterinsurgency at the End of Empire*, Stephen Rangazas, GMT Games, 2023", "\"Cuatro simulacros de guerra sobre la contrainsurgencia británica en Palestina, Malasia, Kenia y Chipre\"", "(@Boardgamespixels, https://boardgamegeek.com/image/8640543/)"] },
  "GuerrillaGeneration 01": { file: "img/GuerrillaGeneration_01.webp", captionLines: ["*The Guerrilla Generation: Cold War Insurgencies in Latin America*, Stephen Rangazas, GMT Games, 2026", "\"Cuatro juegos sobre insurgencias de la Guerra Fría en Uruguay, Nicaragua, El Salvador y Perú\"", "(@lesgrossman20, https://boardgamegeek.com/image/9310516/)"] },
  "SpiritIsland 01": { file: "img/SpiritIsland_01.webp", captionLines: ["*Spirit Island*, R. Eric Reuss, Greater Than Games LLC, 2017", "\"Los espíritus de la isla unen fuerzas usando poderes elementales para defender su hogar de los invasores\"", "(@skutsch, https://boardgamegeek.com/image/3656498/)"] },
  "JohnCompany 01": { file: "img/JohnCompany_01.webp", captionLines: ["*John Company: Second Edition*, Cole Wehrle, Wehrlegig Games, 2022", "\"Prométete y engatusa para llegar a la cima mientras diriges la Compañía Británica de las Indias Orientales\"", "(@bladerunner007, https://boardgamegeek.com/image/8380925/)"] },
  "Amritsar 02": { file: "img/Amritsar_02.webp", captionLines: ["*Amritsar: The Golden Temple*, David Heras Pino, Ludonova, 2023", "\"El maharajá necesita tus habilidades con el mancala y tu elefante para reconstruir el templo\"", "(@Littleboy6, https://boardgamegeek.com/image/7928918/)"] },
  "Amritsar 03": { file: "img/Amritsar_03.webp", captionLines: ["*Amritsar: The Golden Temple*, David Heras Pino, Ludonova, 2023", "\"El maharajá necesita tus habilidades con el mancala y tu elefante para reconstruir el templo\"", "(@dramaplastika, https://boardgamegeek.com/image/7606951/)"] },
  "Lisboa 01": { file: "img/Lisboa_01.webp", captionLines: ["*Lisboa*, Vital Lacerda, Eagle-Gryphon Games, 2017", "\"Compite para reconstruir la ciudad de Lisboa tras el gran terremoto de 1755\"", "(@MeepleMaven, https://boardgamegeek.com/image/3599777/)"] },
};

// Esto viene de VizRef.md. Por ahora lo usamos para mostrar un pie de visualización
// y para recordar (a simple vista) qué estamos intentando medir.
const VIZ_SPEC_INDEX = {
  "Donut: AbstractNonAbstract": { caption: 'Aquí aparecen los juegos clasificados como \"Abstract Strategy\" en BGG, frente a los que no tienen esa etiqueta' },
  "Histogram: TimeSeriesAbstractNonAbstract": { caption: "Proporción de juegos abstractos y no abstractos desde 1990" },
  "Donut: ThemedAbstractPureAbstract": { caption: "Juegos abstractos con tema y sin tema" },
  "Histogram: TimeSeriesThemedAbstractPureAbstract": { caption: "Juegos abstractos con tema y sin tema, desde 1990" },
  "Stellar: AbstractThemes": { caption: "Temas que aparecen en juegos abstractos (placeholder)" },
  "WorldMapGraph: OriginDestinyNetwork": { caption: "Mapa que muestra origen de publicación y país representado" },
  "Choropleth: Destiny: SliderAges": { caption: "Países representados por épocas históricas" },
  "Choropleth: Destiny: SliderDecades": { caption: "Países representados por décadas del siglo XX" },
  "Choropleth: DestinyAbstractNonAbstract": { caption: "Proporción de juegos abstractos/temáticos por país representado" },
  "Choropleth: DestinyLudemeDensity": { caption: "Densidad lúdica (cantidad de mecánicas) por país representado" },
  "HorBar: MostCommonWars": { caption: "Las guerras más representadas en los wargames" },
  "Choropleth: CountryTargetWargame": { caption: "Países más representados en wargames" },
  "Choropleth: OriginFranceDestinyAll": { caption: "Países representados en wargames franceses" },
  "Choropleth: OriginUSDestinyAll": { caption: "Países representados en wargames norteamericanos" },
  "Choropleth: OriginCountryIndochina": { caption: "País de origen de wargames sobre Guerra de Indochina" },
  "Choropleth: OriginCountryVietnam": { caption: "País de origen de wargames sobre Guerra de Vietnam" },
  "TimeSeries: TimeSeriesIndochinaVietnam / 2012 Embers of War": { caption: "Publicación a lo largo del tiempo (Indochina vs Vietnam) con hito 2012" },
  "Donut: IndochinaBDPhu": { caption: "Dien Bien Phu aparece (o no) en el título de wargames de Indochina" },
  "Choropleth: CategoriesWargamePolitical": { caption: "Países representados en wargames clasificados como políticos" },
  "TimeStackedArea: WargamesPoliticalTime": { caption: "Wargames vs wargames políticos (tiempo)" },
  "WorldMapGraph: OriginDestinyNetworkFilterColonial": { caption: "Origen/destino en juegos con Theme: Colonial" },
  "NetworkGraph: MechanicsFilterColonial": { caption: "Red de mecánicas en juegos coloniales" },
  "TimeSeries: ThemeEnvironmentalProtection": { caption: "Juegos sobre degradación ambiental a lo largo del tiempo" },
  "Donut: ColonialIntersectPolitical": { caption: "Intersección: colonial vs político" },
  "NetworkGraph: FilterEducationalMechanicsCoocurrence": { caption: "Red de mecánicas en juegos educativos" },
  "NetworkGraph: FilterEducationalCategoriesCoocurrence": { caption: "Red de categorías asociadas a juegos educativos" },
  "TimeSeriesArea: TimeSeriesFarmingVsNonFarming": { caption: "Todos vs Farming a lo largo del tiempo" },
};

// Esta función hace una búsqueda “amable” en campos que vienen como lista separada por comas.
function fieldHasToken(value, token) {
  if (!value || !token) return false;
  return String(value).toLowerCase().includes(String(token).toLowerCase());
}

function toYear(row) {
  const y = Number(row.Yearpublished);
  return Number.isFinite(y) ? y : null;
}

// Códigos ISO-3 inválidos o reservados para datos nulos (VizRef.md).
function isValidCountryCode(code) {
  const c = (code || "").trim();
  return c.length > 0 && c !== "XXX";
}

// Para mapas: en GitHub Pages conviene cargar recursos por URL absoluta.
// Usamos un GeoJSON donde cada país tiene ISO_A3 (ISO-3) para casar con nuestro dataset.
const WORLD_GEOJSON_URL = "https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson";
const WORLD_MAP_KEY = "worldIso3";
let worldMapReady = null;

function ensureWorldMapRegistered() {
  if (worldMapReady) return worldMapReady;

  worldMapReady = fetch(WORLD_GEOJSON_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`No pude cargar el mapa mundial (${r.status})`);
      return r.json();
    })
    .then((geojson) => {
      // ECharts empareja por “name”. Ajustamos para que “name” sea ISO-3.
      (geojson.features || []).forEach((f) => {
        const iso3 = f?.properties?.ISO_A3 || f?.properties?.ISO3 || f?.properties?.iso_a3;
        if (iso3) {
          f.properties = f.properties || {};
          f.properties.name = iso3;
        }
      });
      echarts.registerMap(WORLD_MAP_KEY, geojson);
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });

  return worldMapReady;
}

function parseNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asISO3(value) {
  const c = (value || "").trim();
  return isValidCountryCode(c) ? c : null;
}

function listFromField(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function countByISO3(rows, fieldName) {
  const counts = new Map();
  rows.forEach((r) => {
    const code = asISO3(r[fieldName]);
    if (!code) return;
    counts.set(code, (counts.get(code) || 0) + 1);
  });
  return [...counts.entries()].map(([name, value]) => ({ name, value }));
}

function computeYearSeries(rows, predicate) {
  const byYear = new Map();
  rows.forEach((r) => {
    const y = toYear(r);
    if (!y) return;
    if (y < 1900 || y > 2035) return;
    if (!predicate(r)) return;
    byYear.set(y, (byYear.get(y) || 0) + 1);
  });
  const years = [...byYear.keys()].sort((a, b) => a - b);
  return { years, values: years.map((y) => byYear.get(y) || 0) };
}

function computeTwoYearSeries(rows, predA, predB, minYear) {
  const bucket = new Map();
  rows.forEach((r) => {
    const y = toYear(r);
    if (!y) return;
    if (minYear && y < minYear) return;
    if (y < 1900 || y > 2035) return;
    const cur = bucket.get(y) || { a: 0, b: 0 };
    if (predA(r)) cur.a += 1;
    if (predB(r)) cur.b += 1;
    bucket.set(y, cur);
  });
  const years = [...bucket.keys()].sort((a, b) => a - b);
  return {
    years,
    a: years.map((y) => (bucket.get(y)?.a || 0)),
    b: years.map((y) => (bucket.get(y)?.b || 0)),
  };
}

function computeCooccurrenceGraph(rows, fieldName, options = {}) {
  const {
    filterToken = null,
    excludeToken = null,
    maxNodes = 26,
  } = options;

  const nodeCounts = new Map();
  const edgeCounts = new Map();

  rows.forEach((r) => {
    if (filterToken && !fieldHasToken(r.Categories, filterToken) && !fieldHasToken(r.Families, filterToken)) return;

    const items = listFromField(r[fieldName]).map((x) => x.trim()).filter(Boolean);
    const cleaned = excludeToken ? items.filter((x) => x.toLowerCase() !== excludeToken.toLowerCase()) : items;
    const uniq = [...new Set(cleaned)];
    uniq.forEach((a) => nodeCounts.set(a, (nodeCounts.get(a) || 0) + 1));

    for (let i = 0; i < uniq.length; i += 1) {
      for (let j = i + 1; j < uniq.length; j += 1) {
        const a = uniq[i];
        const b = uniq[j];
        const k = a < b ? `${a}|||${b}` : `${b}|||${a}`;
        edgeCounts.set(k, (edgeCounts.get(k) || 0) + 1);
      }
    }
  });

  const topNodes = [...nodeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxNodes)
    .map(([name, value]) => ({ name, value }));

  const allowed = new Set(topNodes.map((n) => n.name));
  const edges = [...edgeCounts.entries()]
    .map(([k, value]) => {
      const [source, target] = k.split("|||");
      return { source, target, value };
    })
    .filter((e) => allowed.has(e.source) && allowed.has(e.target))
    .sort((a, b) => b.value - a.value)
    .slice(0, 80);

  const nodes = topNodes.map((n) => ({
    name: n.name,
    value: n.value,
    symbolSize: Math.max(8, Math.min(34, 6 + Math.sqrt(n.value))),
  }));

  return { nodes, edges };
}

// Esta función resume un viz en números fáciles de mostrar.
// Todavía no “dibujamos” el gráfico real: solo probamos que el filtro funciona.
function computeVizSummary(vizKey, data) {
  const rows = data.length;

  if (vizKey === "Donut: AbstractNonAbstract") {
    const abstract = data.filter((r) => fieldHasToken(r.Categories, "Abstract Strategy")).length;
    return {
      title: vizKey,
      rows,
      groups: [
        { name: "Juegos abstractos", value: abstract },
        { name: "Juegos no abstractos", value: rows - abstract },
      ],
    };
  }

  if (vizKey === "Histogram: TimeSeriesAbstractNonAbstract") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) >= 1990);
    const abstract = filtered.filter((r) => fieldHasToken(r.Categories, "Abstract Strategy")).length;
    return {
      title: vizKey,
      rows,
      subtitle: "Yearpublished >= 1990",
      groups: [
        { name: "Juegos abstractos (>=1990)", value: abstract },
        { name: "Juegos no abstractos (>=1990)", value: filtered.length - abstract },
      ],
    };
  }

  if (vizKey === "Donut: ThemedAbstractPureAbstract") {
    const abstractOnly = data.filter((r) => fieldHasToken(r.Categories, "Abstract Strategy"));
    const themed = abstractOnly.filter((r) => fieldHasToken(r.Families, "Theme:")).length;
    return {
      title: vizKey,
      rows,
      groups: [
        { name: "Abstractos con tema", value: themed },
        { name: "Abstractos puros", value: abstractOnly.length - themed },
      ],
    };
  }

  if (vizKey === "Histogram: TimeSeriesThemedAbstractPureAbstract") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) >= 1990);
    const abstractOnly = filtered.filter((r) => fieldHasToken(r.Categories, "Abstract Strategy"));
    const themed = abstractOnly.filter((r) => fieldHasToken(r.Families, "Theme:")).length;
    return {
      title: vizKey,
      rows,
      subtitle: "Yearpublished >= 1990",
      groups: [
        { name: "Abstractos con tema (>=1990)", value: themed },
        { name: "Abstractos puros (>=1990)", value: abstractOnly.length - themed },
      ],
    };
  }

  if (vizKey === "WorldMapGraph: OriginDestinyNetwork") {
    const pairs = new Map();
    data.forEach((r) => {
      const o = (r.PubOriginCountry || "").trim();
      const d = (r.ReprDestCountry || "").trim();
      if (!isValidCountryCode(o) || !isValidCountryCode(d)) return;
      const k = `${o}→${d}`;
      pairs.set(k, (pairs.get(k) || 0) + 1);
    });
    const top = [...pairs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    return {
      title: vizKey,
      rows,
      subtitle: `Pares únicos origen→destino: ${pairs.size}`,
      groups: top.map(([name, value]) => ({ name, value })),
    };
  }

  // Choropleths: mostramos un “top” por país como prueba del conteo.
  if (vizKey.startsWith("Choropleth:")) {
    let filtered = data;

    if (vizKey === "Choropleth: CountryTargetWargame") {
      filtered = data.filter((r) => fieldHasToken(r.Categories, "Wargame"));
    }

    if (vizKey === "Choropleth: CategoriesWargamePolitical") {
      filtered = data.filter((r) => fieldHasToken(r.Categories, "Wargame") && fieldHasToken(r.Categories, "Political"));
    }

    if (vizKey === "Choropleth: OriginFranceDestinyAll") {
      filtered = data.filter((r) => isValidCountryCode(r.PubOriginCountry) && (r.PubOriginCountry || "").trim() === "FRA" && fieldHasToken(r.Categories, "Wargame"));
    }

    if (vizKey === "Choropleth: OriginUSDestinyAll") {
      filtered = data.filter((r) => isValidCountryCode(r.PubOriginCountry) && (r.PubOriginCountry || "").trim() === "USA" && fieldHasToken(r.Categories, "Wargame"));
    }

    if (vizKey === "Choropleth: OriginCountryIndochina") {
      filtered = data.filter((r) => fieldHasToken(r.War, "First Indochina War"));
      const counts = new Map();
      filtered.forEach((r) => {
        const c = (r.PubOriginCountry || "").trim();
        if (!isValidCountryCode(c)) return;
        counts.set(c, (counts.get(c) || 0) + 1);
      });
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
      return { title: vizKey, rows, subtitle: `Filtrados: ${filtered.length}`, groups: top.map(([name, value]) => ({ name, value })) };
    }

    if (vizKey === "Choropleth: OriginCountryVietnam") {
      filtered = data.filter((r) => fieldHasToken(r.War, "Vietnam War"));
      const counts = new Map();
      filtered.forEach((r) => {
        const c = (r.PubOriginCountry || "").trim();
        if (!isValidCountryCode(c)) return;
        counts.set(c, (counts.get(c) || 0) + 1);
      });
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
      return { title: vizKey, rows, subtitle: `Filtrados: ${filtered.length}`, groups: top.map(([name, value]) => ({ name, value })) };
    }

    // Por defecto, contamos ReprDestCountry (país representado).
    const counts = new Map();
    filtered.forEach((r) => {
      const c = (r.ReprDestCountry || "").trim();
      if (!isValidCountryCode(c)) return;
      counts.set(c, (counts.get(c) || 0) + 1);
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    return {
      title: vizKey,
      rows,
      subtitle: `Filtrados: ${filtered.length}`,
      groups: top.map(([name, value]) => ({ name, value })),
    };
  }

  if (vizKey === "HorBar: MostCommonWars") {
    const counts = new Map();
    data.forEach((r) => {
      const wars = (r.War || "").split(",").map((s) => s.trim()).filter(Boolean);
      wars.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    return {
      title: vizKey,
      rows,
      subtitle: `Valores únicos en “War”: ${counts.size}`,
      groups: top.map(([name, value]) => ({ name, value })),
    };
  }

  if (vizKey === "TimeSeries: TimeSeriesIndochinaVietnam / 2012 Embers of War") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) > 1990);
    const v = filtered.filter((r) => fieldHasToken(r.War, "Vietnam War")).length;
    const i = filtered.filter((r) => fieldHasToken(r.War, "First Indochina War")).length;
    return {
      title: vizKey,
      rows,
      subtitle: `Yearpublished > 1990 (filtrados: ${filtered.length})`,
      groups: [
        { name: "Guerra de Vietnam", value: v },
        { name: "Guerra de Indochina", value: i },
      ],
    };
  }

  if (vizKey === "Donut: IndochinaBDPhu") {
    const filtered = data.filter((r) => fieldHasToken(r.War, "First Indochina War"));
    const yes = filtered.filter((r) => fieldHasToken(r["Game Name"], "Dien Bien Phu") || fieldHasToken(r["Game Name"], "Bien Dien Phu")).length;
    return {
      title: vizKey,
      rows,
      subtitle: `Filtrados (First Indochina War): ${filtered.length}`,
      groups: [
        { name: "Dien Bien Phu aparece en el título", value: yes },
        { name: "Dien Bien Phu no aparece en el título", value: filtered.length - yes },
      ],
    };
  }

  if (vizKey === "WorldMapGraph: OriginDestinyNetworkFilterColonial") {
    const filtered = data.filter((r) => fieldHasToken(r.Families, "Theme: Colonial"));
    const pairs = new Map();
    filtered.forEach((r) => {
      const o = (r.PubOriginCountry || "").trim();
      const d = (r.ReprDestCountry || "").trim();
      if (!isValidCountryCode(o) || !isValidCountryCode(d)) return;
      const k = `${o}→${d}`;
      pairs.set(k, (pairs.get(k) || 0) + 1);
    });
    const top = [...pairs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    return {
      title: vizKey,
      rows,
      subtitle: `Theme: Colonial (filtrados: ${filtered.length}; pares: ${pairs.size})`,
      groups: top.map(([name, value]) => ({ name, value })),
    };
  }

  if (vizKey === "NetworkGraph: MechanicsFilterColonial") {
    const filtered = data.filter((r) => fieldHasToken(r.Families, "Theme: Colonial"));
    const counts = new Map();
    filtered.forEach((r) => {
      const mechs = (r.Mechanics || "").split(",").map((s) => s.trim()).filter(Boolean);
      mechs.forEach((m) => counts.set(m, (counts.get(m) || 0) + 1));
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    return { title: vizKey, rows, subtitle: `Theme: Colonial (filtrados: ${filtered.length})`, groups: top.map(([name, value]) => ({ name, value })) };
  }

  if (vizKey === "TimeSeries: ThemeEnvironmentalProtection") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) > 1990 && fieldHasToken(r.Families, "Theme: Environmental Protection / Degradation / Pollution"));
    return {
      title: vizKey,
      rows,
      subtitle: "Yearpublished > 1990 + Theme: Environmental Protection / Degradation / Pollution",
      groups: [{ name: "Juegos filtrados", value: filtered.length }],
    };
  }

  if (vizKey === "Donut: ColonialIntersectPolitical") {
    const filtered = data.filter((r) => fieldHasToken(r.Families, "Theme: Colonial"));
    const political = filtered.filter((r) => fieldHasToken(r.Categories, "Political")).length;
    return {
      title: vizKey,
      rows,
      subtitle: `Theme: Colonial (filtrados: ${filtered.length})`,
      groups: [
        { name: "Colonial + Political", value: political },
        { name: "Colonial sin Political", value: filtered.length - political },
      ],
    };
  }

  if (vizKey === "NetworkGraph: FilterEducationalMechanicsCoocurrence") {
    const filtered = data.filter((r) => fieldHasToken(r.Categories, "Educational"));
    const counts = new Map();
    filtered.forEach((r) => {
      const mechs = (r.Mechanics || "").split(",").map((s) => s.trim()).filter(Boolean);
      mechs.forEach((m) => counts.set(m, (counts.get(m) || 0) + 1));
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    return { title: vizKey, rows, subtitle: `Educational (filtrados: ${filtered.length})`, groups: top.map(([name, value]) => ({ name, value })) };
  }

  if (vizKey === "NetworkGraph: FilterEducationalCategoriesCoocurrence") {
    const filtered = data.filter((r) => fieldHasToken(r.Categories, "Educational"));
    const counts = new Map();
    filtered.forEach((r) => {
      const cats = (r.Categories || "").split(",").map((s) => s.trim()).filter(Boolean);
      cats.filter((c) => c.toLowerCase() !== "educational").forEach((c) => counts.set(c, (counts.get(c) || 0) + 1));
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    return { title: vizKey, rows, subtitle: `Educational (filtrados: ${filtered.length})`, groups: top.map(([name, value]) => ({ name, value })) };
  }

  if (vizKey === "TimeStackedArea: WargamesPoliticalTime") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) > 1990);
    const w = filtered.filter((r) => fieldHasToken(r.Categories, "Wargame")).length;
    const wp = filtered.filter((r) => fieldHasToken(r.Categories, "Wargame") && fieldHasToken(r.Categories, "Political")).length;
    return {
      title: vizKey,
      rows,
      subtitle: `Yearpublished > 1990 (filtrados: ${filtered.length})`,
      groups: [
        { name: "Wargames", value: w },
        { name: "Wargames políticos", value: wp },
      ],
    };
  }

  if (vizKey === "TimeSeriesArea: TimeSeriesFarmingVsNonFarming") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) > 1990);
    const farming = filtered.filter((r) => fieldHasToken(r.Categories, "Farming")).length;
    return {
      title: vizKey,
      rows,
      subtitle: `Yearpublished > 1990 (filtrados: ${filtered.length})`,
      groups: [
        { name: "Todos", value: filtered.length },
        { name: "Farming", value: farming },
      ],
    };
  }

  // Stellar: AbstractThemes no tiene una lógica definida todavía en VizRef,
  // así que por ahora mostramos un marcador con el total de filas.
  if (vizKey === "Stellar: AbstractThemes") {
    const abstractOnly = data.filter((r) => fieldHasToken(r.Categories, "Abstract Strategy"));
    return {
      title: vizKey,
      rows,
      subtitle: `Abstract Strategy (filtrados: ${abstractOnly.length})`,
      groups: [{ name: "Juegos abstractos", value: abstractOnly.length }],
    };
  }

  return { title: vizKey, rows, groups: [{ name: "Filas cargadas", value: rows }] };
}

function formatCaptionLines(lines) {
  return (lines || [])
    .map((line) => line.replace(/\*([^*]+)\*/g, "<em>$1</em>"))
    .join("<br><br>");
}

function clearStickyMedia() {
  if (activeEcharts) {
    activeEcharts.dispose();
    activeEcharts = null;
  }
  stickyMediaEl.classList.remove("is-visible");
  stickyMediaEl.innerHTML = "";
}

function showStickyFadeIn() {
  requestAnimationFrame(() => stickyMediaEl.classList.add("is-visible"));
}

// Si la imagen es muy alargada, la recortamos para que no desborde la tarjeta.
function applyImageCrop(img, frame) {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return;
  const aspect = Math.max(nw, nh) / Math.min(nw, nh);
  if (aspect > 1.45) {
    frame.classList.add("is-cropped");
  }
}

// Esta función muestra una imagen y su pie de foto.
// Es la versión más simple posible de “una tarjeta fija con una imagen”.
function showImage(imgKey) {
  clearStickyMedia();

  const entry = IMG_MAP[imgKey];
  if (!entry) {
    stickyMediaEl.innerHTML = `<p style="margin:0;color:#555;">No encuentro la imagen: <strong>${imgKey}</strong></p>`;
    showStickyFadeIn();
    return;
  }

  const frame = document.createElement("div");
  frame.className = "img-frame";

  const img = document.createElement("img");
  img.src = entry.file;
  img.alt = imgKey;
  if (img.complete) {
    applyImageCrop(img, frame);
  } else {
    img.addEventListener("load", () => applyImageCrop(img, frame), { once: true });
  }

  frame.appendChild(img);

  const cap = document.createElement("p");
  cap.className = "caption";
  cap.innerHTML = formatCaptionLines(entry.captionLines);

  stickyMediaEl.appendChild(frame);
  stickyMediaEl.appendChild(cap);
  showStickyFadeIn();
}

function openLightbox(src, alt) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector("img");
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

// Un clic en la imagen fija abre la vista ampliada (lightbox).
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  stickyMediaEl.addEventListener("click", (event) => {
    const img = event.target.closest(".img-frame img");
    if (!img) return;
    openLightbox(img.src, img.alt);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

function buildPlaceholderOption(summary) {
  const caption = VIZ_SPEC_INDEX[summary.title]?.caption || "";
  const names = (summary.groups || []).map((g) => g.name);
  const values = (summary.groups || []).map((g) => g.value);

  return {
    backgroundColor: "transparent",
    title: {
      text: summary.title,
      subtext: `${caption}${summary.subtitle ? `\n${summary.subtitle}` : ""}\nFilas en memoria: ${summary.rows.toLocaleString("es")}`,
      left: "center",
      top: 6,
      textStyle: { fontSize: 12, fontWeight: 700, color: "#1a1a1a" },
      subtextStyle: { fontSize: 11, color: "#444", lineHeight: 16 },
    },
    grid: { left: 12, right: 12, top: 96, bottom: 10, containLabel: true },
    xAxis: { type: "value", axisLabel: { color: "#444" }, splitLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } } },
    yAxis: { type: "category", data: names, axisLabel: { color: "#444", width: 220, overflow: "truncate" } },
    series: [
      {
        type: "bar",
        data: values,
        itemStyle: { color: "#3b6b88" },
        label: { show: true, position: "right", color: "#222" },
      },
    ],
    animationDuration: 300,
  };
}

function buildCaptionElement(vizKey) {
  const cap = document.createElement("p");
  cap.className = "caption";
  const caption = VIZ_SPEC_INDEX[vizKey]?.caption || "";
  cap.textContent = caption || "";
  return cap;
}

function buildDonutOption(title, caption, seriesName, groups) {
  return {
    backgroundColor: "transparent",
    title: {
      text: title,
      subtext: caption || "",
      left: "center",
      top: 6,
      textStyle: { fontSize: 12, fontWeight: 700, color: "#1a1a1a" },
      subtextStyle: { fontSize: 11, color: "#444", lineHeight: 16 },
    },
    tooltip: { trigger: "item" },
    legend: { bottom: 0, left: "center", textStyle: { color: "#333" } },
    series: [
      {
        name: seriesName,
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "52%"],
        avoidLabelOverlap: true,
        label: { color: "#222" },
        labelLine: { lineStyle: { color: "rgba(0,0,0,0.25)" } },
        data: groups,
        itemStyle: { borderColor: "rgba(0,0,0,0.12)", borderWidth: 1 },
      },
    ],
    animationDuration: 400,
  };
}

function buildBarTimeOption(title, caption, years, series) {
  return {
    backgroundColor: "transparent",
    title: {
      text: title,
      subtext: caption || "",
      left: "center",
      top: 6,
      textStyle: { fontSize: 12, fontWeight: 700, color: "#1a1a1a" },
      subtextStyle: { fontSize: 11, color: "#444", lineHeight: 16 },
    },
    tooltip: { trigger: "axis" },
    legend: { top: 56, left: "center", textStyle: { color: "#333" } },
    grid: { left: 10, right: 10, top: 92, bottom: 16, containLabel: true },
    xAxis: { type: "category", data: years, axisLabel: { color: "#444", interval: Math.ceil(years.length / 10) } },
    yAxis: { type: "value", axisLabel: { color: "#444" }, splitLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } } },
    series,
    dataZoom: years.length > 35 ? [{ type: "inside" }] : [],
    animationDuration: 400,
  };
}

function buildWorldChoroplethOption(title, caption, data, visualMax) {
  const maxVal = visualMax || Math.max(1, ...data.map((d) => d.value || 0));
  return {
    backgroundColor: "transparent",
    title: {
      text: title,
      subtext: caption || "",
      left: "center",
      top: 6,
      textStyle: { fontSize: 12, fontWeight: 700, color: "#1a1a1a" },
      subtextStyle: { fontSize: 11, color: "#444", lineHeight: 16 },
    },
    tooltip: { trigger: "item", formatter: (p) => `${p.name}: ${p.value || 0}` },
    visualMap: {
      min: 0,
      max: maxVal,
      left: 10,
      bottom: 10,
      text: ["Más", "Menos"],
      inRange: { color: ["#f6efe6", "#d19e2b", "#b84a39"] },
      textStyle: { color: "#333" },
      calculable: true,
    },
    series: [
      {
        type: "map",
        map: WORLD_MAP_KEY,
        roam: true,
        nameProperty: "name",
        emphasis: { label: { show: false } },
        itemStyle: { borderColor: "rgba(0,0,0,0.18)", borderWidth: 0.6 },
        data,
      },
    ],
    animationDuration: 400,
  };
}

function buildWorldNetworkOption(title, caption, links, originPoints, destPoints) {
  return {
    backgroundColor: "transparent",
    title: {
      text: title,
      subtext: caption || "",
      left: "center",
      top: 6,
      textStyle: { fontSize: 12, fontWeight: 700, color: "#1a1a1a" },
      subtextStyle: { fontSize: 11, color: "#444", lineHeight: 16 },
    },
    tooltip: { trigger: "item" },
    geo: {
      map: WORLD_MAP_KEY,
      roam: true,
      nameProperty: "name",
      itemStyle: { areaColor: "#f6efe6", borderColor: "rgba(0,0,0,0.16)" },
      emphasis: { itemStyle: { areaColor: "#efe3d2" } },
    },
    series: [
      {
        name: "Conexiones",
        type: "lines",
        coordinateSystem: "geo",
        zlevel: 1,
        effect: { show: false },
        lineStyle: { width: 1, opacity: 0.35, color: "#3b6b88" },
        data: links,
      },
      {
        name: "Origen",
        type: "scatter",
        coordinateSystem: "geo",
        symbolSize: (v) => Math.max(4, Math.min(16, 2 + Math.sqrt(v[2] || 1))),
        itemStyle: { color: "#4a7a61" },
        data: originPoints,
      },
      {
        name: "Destino",
        type: "scatter",
        coordinateSystem: "geo",
        symbolSize: (v) => Math.max(4, Math.min(16, 2 + Math.sqrt(v[2] || 1))),
        itemStyle: { color: "#b84a39" },
        data: destPoints,
      },
    ],
    legend: { bottom: 0, left: "center", textStyle: { color: "#333" } },
    animationDuration: 400,
  };
}

function buildForceGraphOption(title, caption, nodes, edges) {
  return {
    backgroundColor: "transparent",
    title: {
      text: title,
      subtext: caption || "",
      left: "center",
      top: 6,
      textStyle: { fontSize: 12, fontWeight: 700, color: "#1a1a1a" },
      subtextStyle: { fontSize: 11, color: "#444", lineHeight: 16 },
    },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "graph",
        layout: "force",
        roam: true,
        data: nodes,
        links: edges.map((e) => ({ source: e.source, target: e.target, value: e.value })),
        force: { repulsion: 110, edgeLength: [40, 120] },
        label: { show: true, color: "#222", fontSize: 10, formatter: "{b}" },
        lineStyle: { color: "rgba(0,0,0,0.15)", width: 1 },
        emphasis: { focus: "adjacency" },
      },
    ],
    animationDuration: 400,
  };
}

function computeVizOption(vizKey, data) {
  const caption = VIZ_SPEC_INDEX[vizKey]?.caption || "";

  // Ignorado por ahora: no existe en VizRef.md.
  if (vizKey === "Stellar: AbstractThemes") return null;

  if (vizKey === "Donut: AbstractNonAbstract") {
    const abstract = data.filter((r) => fieldHasToken(r.Categories, "Abstract Strategy")).length;
    const groups = [
      { name: "Juegos abstractos", value: abstract },
      { name: "Juegos no abstractos", value: data.length - abstract },
    ];
    return { height: 340, option: buildDonutOption(vizKey, caption, "Abstractos", groups) };
  }

  if (vizKey === "Donut: ThemedAbstractPureAbstract") {
    const abstractOnly = data.filter((r) => fieldHasToken(r.Categories, "Abstract Strategy"));
    const themed = abstractOnly.filter((r) => fieldHasToken(r.Families, "Theme:")).length;
    const groups = [
      { name: "Abstractos con tema", value: themed },
      { name: "Abstractos puros", value: abstractOnly.length - themed },
    ];
    return { height: 340, option: buildDonutOption(vizKey, caption, "Temas", groups) };
  }

  if (vizKey === "Donut: IndochinaBDPhu") {
    const filtered = data.filter((r) => fieldHasToken(r.War, "First Indochina War"));
    const yes = filtered.filter((r) => fieldHasToken(r["Game Name"], "Dien Bien Phu") || fieldHasToken(r["Game Name"], "Bien Dien Phu")).length;
    const groups = [
      { name: "Aparece en el título", value: yes },
      { name: "No aparece en el título", value: filtered.length - yes },
    ];
    return { height: 340, option: buildDonutOption(vizKey, caption, "Título", groups) };
  }

  if (vizKey === "Donut: ColonialIntersectPolitical") {
    const filtered = data.filter((r) => fieldHasToken(r.Families, "Theme: Colonial"));
    const political = filtered.filter((r) => fieldHasToken(r.Categories, "Political")).length;
    const groups = [
      { name: "Colonial + Political", value: political },
      { name: "Colonial sin Political", value: filtered.length - political },
    ];
    return { height: 340, option: buildDonutOption(vizKey, caption, "Intersección", groups) };
  }

  if (vizKey === "Histogram: TimeSeriesAbstractNonAbstract") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) >= 1990);
    const s = computeTwoYearSeries(
      filtered,
      (r) => fieldHasToken(r.Categories, "Abstract Strategy"),
      (r) => !fieldHasToken(r.Categories, "Abstract Strategy"),
      1990
    );
    const option = buildBarTimeOption(vizKey, caption, s.years, [
      { name: "Abstractos", type: "bar", data: s.a, itemStyle: { color: "#4a7a61" } },
      { name: "No abstractos", type: "bar", data: s.b, itemStyle: { color: "#3b6b88" } },
    ]);
    return { height: 360, option };
  }

  if (vizKey === "Histogram: TimeSeriesThemedAbstractPureAbstract") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) >= 1990 && fieldHasToken(r.Categories, "Abstract Strategy"));
    const s = computeTwoYearSeries(
      filtered,
      (r) => fieldHasToken(r.Families, "Theme:"),
      (r) => !fieldHasToken(r.Families, "Theme:"),
      1990
    );
    const option = buildBarTimeOption(vizKey, caption, s.years, [
      { name: "Con tema", type: "bar", data: s.a, itemStyle: { color: "#d19e2b" } },
      { name: "Puros", type: "bar", data: s.b, itemStyle: { color: "#7a4b75" } },
    ]);
    return { height: 360, option };
  }

  if (vizKey === "HorBar: MostCommonWars") {
    const counts = new Map();
    data.forEach((r) => {
      listFromField(r.War).forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
    const names = top.map((x) => x[0]);
    const values = top.map((x) => x[1]);
    const option = {
      backgroundColor: "transparent",
      title: { text: vizKey, subtext: caption, left: "center", top: 6, textStyle: { fontSize: 12, fontWeight: 700 }, subtextStyle: { fontSize: 11, color: "#444" } },
      tooltip: { trigger: "axis" },
      grid: { left: 10, right: 10, top: 84, bottom: 22, containLabel: true },
      xAxis: { type: "value", axisLabel: { color: "#444" }, splitLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } } },
      yAxis: { type: "category", data: names, axisLabel: { color: "#444", width: 220, overflow: "truncate" } },
      dataZoom: [{ type: "inside" }, { type: "slider", yAxisIndex: 0, right: 2, width: 10 }],
      series: [{ type: "bar", data: values, itemStyle: { color: "#3b6b88" }, label: { show: true, position: "right", color: "#222" } }],
      animationDuration: 400,
    };
    return { height: 420, option };
  }

  if (vizKey === "TimeSeries: TimeSeriesIndochinaVietnam / 2012 Embers of War") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) > 1990);
    const s = computeTwoYearSeries(
      filtered,
      (r) => fieldHasToken(r.War, "Vietnam War"),
      (r) => fieldHasToken(r.War, "First Indochina War"),
      1990
    );
    const option = {
      backgroundColor: "transparent",
      title: { text: vizKey, subtext: caption, left: "center", top: 6, textStyle: { fontSize: 12, fontWeight: 700 }, subtextStyle: { fontSize: 11, color: "#444" } },
      tooltip: { trigger: "axis" },
      legend: { top: 56, left: "center", textStyle: { color: "#333" } },
      grid: { left: 10, right: 10, top: 92, bottom: 16, containLabel: true },
      xAxis: { type: "category", data: s.years, axisLabel: { color: "#444", interval: Math.ceil(s.years.length / 10) } },
      yAxis: { type: "value", axisLabel: { color: "#444" }, splitLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } } },
      series: [
        {
          name: "Guerra de Vietnam",
          type: "line",
          data: s.a,
          smooth: true,
          symbolSize: 3,
          lineStyle: { color: "#3b6b88" },
          itemStyle: { color: "#3b6b88" },
          markLine: { silent: true, data: [{ xAxis: 2012, label: { formatter: "2012: Embers of War" } }] },
        },
        { name: "Guerra de Indochina", type: "line", data: s.b, smooth: true, symbolSize: 3, lineStyle: { color: "#b84a39" }, itemStyle: { color: "#b84a39" } },
      ],
      animationDuration: 400,
    };
    return { height: 360, option };
  }

  if (vizKey === "TimeStackedArea: WargamesPoliticalTime") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) > 1990);
    const s = computeTwoYearSeries(
      filtered,
      (r) => fieldHasToken(r.Categories, "Wargame"),
      (r) => fieldHasToken(r.Categories, "Wargame") && fieldHasToken(r.Categories, "Political"),
      1990
    );
    const option = {
      backgroundColor: "transparent",
      title: { text: vizKey, subtext: caption, left: "center", top: 6, textStyle: { fontSize: 12, fontWeight: 700 }, subtextStyle: { fontSize: 11, color: "#444" } },
      tooltip: { trigger: "axis" },
      legend: { top: 56, left: "center", textStyle: { color: "#333" } },
      grid: { left: 10, right: 10, top: 92, bottom: 16, containLabel: true },
      xAxis: { type: "category", data: s.years, axisLabel: { color: "#444", interval: Math.ceil(s.years.length / 10) } },
      yAxis: { type: "value", axisLabel: { color: "#444" }, splitLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } } },
      series: [
        { name: "Wargames", type: "line", stack: "total", areaStyle: {}, smooth: true, data: s.a, lineStyle: { color: "#3b6b88" }, itemStyle: { color: "#3b6b88" }, symbolSize: 2 },
        { name: "Wargames políticos", type: "line", stack: "total", areaStyle: {}, smooth: true, data: s.b, lineStyle: { color: "#b84a39" }, itemStyle: { color: "#b84a39" }, symbolSize: 2 },
      ],
      animationDuration: 400,
    };
    return { height: 360, option };
  }

  if (vizKey === "TimeSeriesArea: TimeSeriesFarmingVsNonFarming") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) > 1990);
    const s = computeTwoYearSeries(
      filtered,
      () => true,
      (r) => fieldHasToken(r.Categories, "Farming"),
      1990
    );
    const option = {
      backgroundColor: "transparent",
      title: { text: vizKey, subtext: caption, left: "center", top: 6, textStyle: { fontSize: 12, fontWeight: 700 }, subtextStyle: { fontSize: 11, color: "#444" } },
      tooltip: { trigger: "axis" },
      legend: { top: 56, left: "center", textStyle: { color: "#333" } },
      grid: { left: 10, right: 10, top: 92, bottom: 16, containLabel: true },
      xAxis: { type: "category", data: s.years, axisLabel: { color: "#444", interval: Math.ceil(s.years.length / 10) } },
      yAxis: { type: "value", axisLabel: { color: "#444" }, splitLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } } },
      series: [
        { name: "Todos", type: "line", smooth: true, areaStyle: { opacity: 0.15 }, data: s.a, lineStyle: { color: "#3b6b88" }, itemStyle: { color: "#3b6b88" }, symbolSize: 2 },
        { name: "Farming", type: "line", smooth: true, areaStyle: { opacity: 0.18 }, data: s.b, lineStyle: { color: "#4a7a61" }, itemStyle: { color: "#4a7a61" }, symbolSize: 2 },
      ],
      animationDuration: 400,
    };
    return { height: 360, option };
  }

  if (vizKey === "TimeSeries: ThemeEnvironmentalProtection") {
    const filtered = data.filter((r) => (toYear(r) ?? 0) > 1990 && fieldHasToken(r.Families, "Theme: Environmental Protection / Degradation / Pollution"));
    const s = computeYearSeries(filtered, () => true);
    const option = buildBarTimeOption(vizKey, caption, s.years, [
      { name: "Juegos", type: "bar", data: s.values, itemStyle: { color: "#4a7a61" } },
    ]);
    return { height: 360, option };
  }

  if (vizKey === "NetworkGraph: MechanicsFilterColonial") {
    const filtered = data.filter((r) => fieldHasToken(r.Families, "Theme: Colonial"));
    const g = computeCooccurrenceGraph(filtered, "Mechanics", { maxNodes: 26 });
    return { height: 420, option: buildForceGraphOption(vizKey, caption, g.nodes, g.edges) };
  }

  if (vizKey === "NetworkGraph: FilterEducationalMechanicsCoocurrence") {
    const filtered = data.filter((r) => fieldHasToken(r.Categories, "Educational"));
    const g = computeCooccurrenceGraph(filtered, "Mechanics", { maxNodes: 26 });
    return { height: 420, option: buildForceGraphOption(vizKey, caption, g.nodes, g.edges) };
  }

  if (vizKey === "NetworkGraph: FilterEducationalCategoriesCoocurrence") {
    const filtered = data.filter((r) => fieldHasToken(r.Categories, "Educational"));
    const g = computeCooccurrenceGraph(filtered, "Categories", { excludeToken: "Educational", maxNodes: 26 });
    return { height: 420, option: buildForceGraphOption(vizKey, caption, g.nodes, g.edges) };
  }

  if (vizKey === "WorldMapGraph: OriginDestinyNetwork" || vizKey === "WorldMapGraph: OriginDestinyNetworkFilterColonial") {
    const filtered = vizKey === "WorldMapGraph: OriginDestinyNetworkFilterColonial"
      ? data.filter((r) => fieldHasToken(r.Families, "Theme: Colonial"))
      : data;

    const links = [];
    const originAgg = new Map();
    const destAgg = new Map();

    filtered.forEach((r) => {
      const o = asISO3(r.PubOriginCountry);
      const d = asISO3(r.ReprDestCountry);
      if (!o || !d) return;

      const olon = parseNum(r.PubOriginCoordLon);
      const olat = parseNum(r.PubOriginCoordLat);
      const dlon0 = parseNum(r.ReprDestCoordLon);
      const dlat = parseNum(r.ReprDestCoordLat);
      if (olon == null || olat == null || dlon0 == null || dlat == null) return;

      const dlon = dlon0 + 3; // pequeño empuje a la derecha para evitar solapamiento
      links.push({ coords: [[olon, olat], [dlon, dlat]] });

      const ok = `${olon},${olat}`;
      originAgg.set(ok, (originAgg.get(ok) || 0) + 1);
      const dk = `${dlon},${dlat}`;
      destAgg.set(dk, (destAgg.get(dk) || 0) + 1);
    });

    const originPoints = [...originAgg.entries()].map(([k, value]) => {
      const [lon, lat] = k.split(",").map(Number);
      return { name: "Origen", value: [lon, lat, value] };
    });

    const destPoints = [...destAgg.entries()].map(([k, value]) => {
      const [lon, lat] = k.split(",").map(Number);
      return { name: "Destino", value: [lon, lat, value] };
    });

    return { height: 420, needsWorldMap: true, option: buildWorldNetworkOption(vizKey, caption, links.slice(0, 900), originPoints, destPoints) };
  }

  if (vizKey.startsWith("Choropleth:")) {
    let filtered = data;

    if (vizKey === "Choropleth: CountryTargetWargame") {
      filtered = data.filter((r) => fieldHasToken(r.Categories, "Wargame"));
      const mapData = countByISO3(filtered, "ReprDestCountry");
      return { height: 420, needsWorldMap: true, option: buildWorldChoroplethOption(vizKey, caption, mapData) };
    }

    if (vizKey === "Choropleth: CategoriesWargamePolitical") {
      filtered = data.filter((r) => fieldHasToken(r.Categories, "Wargame") && fieldHasToken(r.Categories, "Political"));
      const mapData = countByISO3(filtered, "ReprDestCountry");
      return { height: 420, needsWorldMap: true, option: buildWorldChoroplethOption(vizKey, caption, mapData) };
    }

    if (vizKey === "Choropleth: OriginFranceDestinyAll") {
      filtered = data.filter((r) => asISO3(r.PubOriginCountry) === "FRA" && fieldHasToken(r.Categories, "Wargame"));
      const mapData = countByISO3(filtered, "ReprDestCountry");
      return { height: 420, needsWorldMap: true, option: buildWorldChoroplethOption(vizKey, caption, mapData) };
    }

    if (vizKey === "Choropleth: OriginUSDestinyAll") {
      filtered = data.filter((r) => asISO3(r.PubOriginCountry) === "USA" && fieldHasToken(r.Categories, "Wargame"));
      const mapData = countByISO3(filtered, "ReprDestCountry");
      return { height: 420, needsWorldMap: true, option: buildWorldChoroplethOption(vizKey, caption, mapData) };
    }

    if (vizKey === "Choropleth: OriginCountryIndochina") {
      filtered = data.filter((r) => fieldHasToken(r.War, "First Indochina War"));
      const mapData = countByISO3(filtered, "PubOriginCountry");
      return { height: 420, needsWorldMap: true, option: buildWorldChoroplethOption(vizKey, caption, mapData) };
    }

    if (vizKey === "Choropleth: OriginCountryVietnam") {
      filtered = data.filter((r) => fieldHasToken(r.War, "Vietnam War"));
      const mapData = countByISO3(filtered, "PubOriginCountry");
      return { height: 420, needsWorldMap: true, option: buildWorldChoroplethOption(vizKey, caption, mapData) };
    }

    if (vizKey === "Choropleth: Destiny: SliderAges") {
      const order = ["Ancient", "Medieval", "Renaissance", "Pike and Shot", "Age of Reason", "Napoleonic", "Post-Napoleonic", "World War I", "World War II", "Korean War", "Vietnam War", "Modern Warfare"];
      const options = order.map((age) => {
        const rows = data.filter((r) => fieldHasToken(r.BGGHistoricCatAges, age));
        const mapData = countByISO3(rows, "ReprDestCountry");
        return buildWorldChoroplethOption(`${vizKey}`, `${caption}\nFiltro: ${age}`, mapData);
      });
      return {
        height: 440,
        needsWorldMap: true,
        option: {
          baseOption: {
            timeline: { axisType: "category", autoPlay: false, data: order, bottom: 0, left: 10, right: 10, label: { color: "#333" } },
          },
          options,
        },
      };
    }

    if (vizKey === "Choropleth: Destiny: SliderDecades") {
      const order = ["1920's", "1930's", "1940's", "1950's", "1960's", "1970's", "1980's", "1990's", "2000's"];
      const options = order.map((dec) => {
        const rows = data.filter((r) => fieldHasToken(r.BGG20thCentFamiliesDecades, dec));
        const mapData = countByISO3(rows, "ReprDestCountry");
        return buildWorldChoroplethOption(`${vizKey}`, `${caption}\nFiltro: ${dec}`, mapData);
      });
      return {
        height: 440,
        needsWorldMap: true,
        option: {
          baseOption: {
            timeline: { axisType: "category", autoPlay: false, data: order, bottom: 0, left: 10, right: 10, label: { color: "#333" } },
          },
          options,
        },
      };
    }

    if (vizKey === "Choropleth: DestinyAbstractNonAbstract") {
      const rows = data.filter((r) => asISO3(r.ReprDestCountry));
      const abs = new Map();
      const them = new Map();
      rows.forEach((r) => {
        const c = asISO3(r.ReprDestCountry);
        if (!c) return;
        if (fieldHasToken(r.Categories, "Abstract")) abs.set(c, (abs.get(c) || 0) + 1);
        else them.set(c, (them.get(c) || 0) + 1);
      });
      const mapData = [...new Set([...abs.keys(), ...them.keys()])].map((k) => {
        const a = abs.get(k) || 0;
        const t = them.get(k) || 0;
        const total = a + t;
        const ratio = total ? (a / total) : 0;
        return { name: k, value: Math.round(ratio * 100) };
      });
      const opt = buildWorldChoroplethOption(vizKey, `${caption}\nValor: % abstractos`, mapData, 100);
      return { height: 420, needsWorldMap: true, option: opt };
    }

    if (vizKey === "Choropleth: DestinyLudemeDensity") {
      const perCountry = new Map();
      data.forEach((r) => {
        const c = asISO3(r.ReprDestCountry);
        if (!c) return;
        const set = perCountry.get(c) || new Set();
        listFromField(r.Mechanics).forEach((m) => set.add(m));
        perCountry.set(c, set);
      });
      const mapData = [...perCountry.entries()].map(([name, set]) => ({ name, value: set.size }));
      return { height: 420, needsWorldMap: true, option: buildWorldChoroplethOption(vizKey, caption, mapData) };
    }

    // Si aparece un choropleth nuevo, al menos no rompemos.
    const mapData = countByISO3(filtered, "ReprDestCountry");
    return { height: 420, needsWorldMap: true, option: buildWorldChoroplethOption(vizKey, caption, mapData) };
  }

  return null;
}

// Esta función renderiza el viz real (en lugar del placeholder).
function showViz(vizKey) {
  clearStickyMedia();

  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "360px";
  stickyMediaEl.appendChild(container);

  const capEl = buildCaptionElement(vizKey);
  stickyMediaEl.appendChild(capEl);

  const model = computeVizOption(vizKey, bggData);
  if (!model) {
    // Fallback: si el viz no está implementado, mostramos el placeholder anterior.
    const summary = computeVizSummary(vizKey, bggData);
    activeEcharts = echarts.init(container);
    activeEcharts.setOption(buildPlaceholderOption(summary));
    showStickyFadeIn();
    return;
  }

  const render = () => {
    container.style.height = `${model.height || 360}px`;
    activeEcharts = echarts.init(container);
    activeEcharts.setOption(model.option, true);
    showStickyFadeIn();
    if (activeEcharts) activeEcharts.resize();
  };

  if (model.needsWorldMap) {
    ensureWorldMapRegistered().then((ok) => {
      if (!ok) {
        const summary = computeVizSummary(vizKey, bggData);
        activeEcharts = echarts.init(container);
        activeEcharts.setOption(buildPlaceholderOption(summary));
        showStickyFadeIn();
        return;
      }
      render();
    });
    return;
  }

  render();
}

function parseStepKeys(element) {
  const keys = [];

  if (element.dataset.img) {
    keys.push({ type: "img", key: element.dataset.img.trim() });
  }

  if (element.dataset.viz) {
    element.dataset.viz
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .forEach((k) => keys.push({ type: "viz", key: k }));
  }

  // Algunos pasos (por ejemplo “viz + img”) guardan el orden explícito en data-keys.
  if (element.dataset.keys) {
    element.dataset.keys
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .forEach((token) => {
        const parts = token.split(":");
        if (parts.length < 2) return;
        const type = parts[0].trim();
        const key = parts.slice(1).join(":").trim();
        if (type === "img" || type === "viz") keys.push({ type, key });
      });
  }

  return keys;
}

function renderActiveKey() {
  const current = activeKeys[activeKeyIndex];
  if (!current) return;
  if (current.type === "img") showImage(current.key);
  if (current.type === "viz") showViz(current.key);
}

function setStickyControlsVisible(visible) {
  stickyControlsEl.classList.toggle("is-visible", visible);
}

function updateStickyControls() {
  const total = activeKeys.length || 1;
  stickyIndicatorEl.textContent = `${activeKeyIndex + 1} / ${total}`;
  btnPrev.disabled = activeKeyIndex <= 0;
  btnNext.disabled = activeKeyIndex >= total - 1;
  setStickyControlsVisible(total > 1);
}

function setSplitLayout(active) {
  if (!scrollyEl) return;
  const wasFullwidth = scrollyEl.classList.contains("layout-fullwidth");
  scrollyEl.classList.toggle("layout-split", active);
  scrollyEl.classList.toggle("layout-fullwidth", !active);
  if (wasFullwidth !== !active) {
    scroller.resize();
    if (activeEcharts) activeEcharts.resize();
  }
}

function isElementInScrollCenter(el) {
  const rect = el.getBoundingClientRect();
  const mid = window.innerHeight * 0.5;
  return rect.top <= mid && rect.bottom >= mid;
}

function updateLayoutMode() {
  const steps = document.querySelectorAll(".step");
  const fullwidthBlocks = document.querySelectorAll(".section-break, .fullwidth-center, .fullwidth-card");

  const activeStep = [...steps].find(isElementInScrollCenter);
  if (activeStep) {
    setSplitLayout(true);
    return;
  }

  const activeFullwidth = [...fullwidthBlocks].find(isElementInScrollCenter);
  if (activeFullwidth) {
    setSplitLayout(false);
  }
}

function initFullwidthLayout() {
  window.addEventListener("scroll", updateLayoutMode, { passive: true });
  updateLayoutMode();
}

function onStepEnter({ element }) {
  setSplitLayout(true);
  activeKeys = parseStepKeys(element);
  activeKeyIndex = 0;
  updateStickyControls();
  renderActiveKey();
}

function initAccordions() {
  // El acordeón crece dentro del paso sin encogerlo (evita que Scrollama “salte” al siguiente bullet).
  const resizeScrollama = () => scroller.resize();

  document.querySelectorAll(".step[data-accordion=\"true\"]").forEach((step) => {
    const toggle = step.querySelector(".accordion-toggle");
    const body = step.querySelector(".accordion-body");
    const inner = body?.querySelector(".accordion-inner");
    if (!toggle || !body || !inner) return;

    toggle.setAttribute("aria-expanded", "false");
    body.style.maxHeight = "0";

    const fullHeightPx = () => `${inner.scrollHeight}px`;

    body.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "max-height") return;
      if (body.style.maxHeight === "0px" || body.style.maxHeight === "0") {
        body.classList.remove("is-open");
      }
      resizeScrollama();
    });

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      const opening = !body.classList.contains("is-open");

      if (opening) {
        body.classList.add("is-open");
        body.style.maxHeight = fullHeightPx();
        toggle.setAttribute("aria-expanded", "true");
        return;
      }

      body.style.maxHeight = fullHeightPx();
      requestAnimationFrame(() => {
        body.style.maxHeight = "0";
      });
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initScroller() {
  scroller
    .setup({ step: ".step", offset: 0.5, debug: false })
    .onStepEnter(onStepEnter);

  window.addEventListener("resize", () => {
    scroller.resize();
    if (activeEcharts) activeEcharts.resize();
  });
}

function loadData() {
  // Este es el “momento clave” del prototipo: cargar el dataset una sola vez,
  // para que el resto de la historia solo reutilice esa memoria.
  return d3.csv(CSV_PATH).then((rows) => {
    bggData = rows;
    console.log(`BGG_FullExtras_Final_V3.csv cargado: ${bggData.length} filas`);
  });
}

btnPrev.addEventListener("click", () => {
  if (activeKeyIndex <= 0) return;
  activeKeyIndex -= 1;
  updateStickyControls();
  renderActiveKey();
});

btnNext.addEventListener("click", () => {
  if (activeKeyIndex >= activeKeys.length - 1) return;
  activeKeyIndex += 1;
  updateStickyControls();
  renderActiveKey();
});

loadData()
  .then(() => {
    initLightbox();
    initAccordions();
    initFullwidthLayout();
    initScroller();
    clearStickyMedia();
    stickyMediaEl.innerHTML = `<p style="margin:0;color:#555;">Listo. Empieza a hacer scroll para activar imágenes y visualizaciones.</p>`;
    showStickyFadeIn();
    updateStickyControls();
  })
  .catch((err) => {
    console.error(err);
    clearStickyMedia();
    stickyMediaEl.innerHTML =
      '<p style="margin:0;color:#555;">No pude cargar el CSV. Asegúrate de abrir la página con un servidor HTTP local (por ejemplo, <code>python3 -m http.server</code>).</p>';
    showStickyFadeIn();
  });
