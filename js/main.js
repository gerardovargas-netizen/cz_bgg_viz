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
  "Kanban 01": { file: "/img/Kanban_01.webp", captionLines: ["*Kanban EV*, Vital Lacerda, Eagle-Gryphon Games, 2020", "\"Los trabajadores de la fábrica de vehículos eléctricos optimizan e innovan para destacar en la gran reunión de la junta directiva\"", "(@newrev, https://boardgamegeek.com/image/5095231/)"] },
  "Agricola 01": { file: "/img/Agricola_01.webp", captionLines: ["*Agricola*, Uwe Rosenberg, Lookout Games, 2007", "\"Construye tu granja sembrando campos y criando ganado. ¡Pero no olvides comer!\"", "(@nerdymove, https://boardgamegeek.com/image/1885236/)"] },
  "Freedom 01": { file: "/img/Freedom_01.webp", captionLines: ["*Freedom: The Underground Railroad*, Brian Mayer, Academy Games, 2013", "\"Únete a otros abolicionistas para emancipar a los esclavos y guiarlos hacia la libertad en Canadá\"", "(@Puma85, https://boardgamegeek.com/image/5783098/)"] },
  "Freedom 02": { file: "/img/Freedom_02.webp", captionLines: ["*Freedom: The Underground Railroad*, Brian Mayer, Academy Games, 2013", "\"Únete a otros abolicionistas para emancipar a los esclavos y guiarlos hacia la libertad en Canadá\"", "(@Puma85, https://boardgamegeek.com/image/5783098/)"] },
  "AceSpades 01": { file: "/img/AceSpades_01.webp", captionLines: ["*Ace of Spades*, Benjamín Amorín, Devir, 2025", "\"Canaliza tu magia a través de jugadas de póker para resolver duelos peligrosos\"", "(@NasumQSU, https://boardgamegeek.com/image/9026993/)"] },
  "AceSpades 02": { file: "/img/AceSpades_02.webp", captionLines: ["*Ace of Spades*, Benjamín Amorín, Devir, 2025", "\"Canaliza tu magia a través de jugadas de póker para resolver duelos peligrosos\"", "(@jambapg, https://boardgamegeek.com/image/9032399)"] },
  "IanBogost 01": { file: "/img/IanBogost_01.avif", captionLines: ["Ian Bogost, Persuasive Games. The Expressive Power of Videogames, MIT Press, 2010", "\"Una exploración de la forma en que los videojuegos plantean argumentos y hacen declaraciones expresivas sobre el mundo, y que analiza su singular poder persuasivo en términos de sus propiedades computacionales\""] },
  "CV 01": { file: "/img/CV_01.webp", captionLines: ["*CV*, Filip Miłuński, Gigamic, 2013", "\"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\"", "(@szafa, https://boardgamegeek.com/image/1695059/)"] },
  "CV 02": { file: "/img/CV_02.webp", captionLines: ["*CV*, Filip Miłuński, Gigamic, 2013", "\"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\"", "(@Benterdimensional, https://boardgamegeek.com/image/5404873/)"] },
  "CV 03": { file: "/img/CV_03.webp", captionLines: ["*CV*, Filip Miłuński, Gigamic, 2013", "\"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\"", "(@p0w3rserj, https://boardgamegeek.com/image/3598537/)"] },
  "Santa Maria 01": { file: "/img/SantaMaria_01.webp", captionLines: ["*Santa Maria*, Kristian Amundsen Østby y Eilif Svensson, Aporta Games, 2017", "\"Construye y maximiza tu colonia de poliominós en el Nuevo Mundo\"", "(@sverbeure, https://boardgamegeek.com/image/3919584/)"] },
  "Azul 01": { file: "/img/Azul_01.webp", captionLines: ["*Azul*, Michael Kiesling, Next Move Games, 2017", "\"Embellece artísticamente las paredes de tu palacio obteniendo los azulejos más hermosos\"", "(@EchoOperative, https://boardgamegeek.com/image/3720018/)"] },
  "Hegemony 01": { file: "/img/Hegemony_01.webp", captionLines: ["*Hegemony: Lead Your Class to Victory*, Vangelis Bagiartakis y Varnavas Timotheou, Hegemonic Project Games, 2023", "\"Simula una nación contemporánea completa en este eurojuego asimétrico de corte político-económico\"", "(@Tabletopping_Games, https://boardgamegeek.com/image/6499211/)"] },
  "Heat 01": { file: "/img/Heat_01.webp", captionLines: ["*Heat: Pedal to the Metal*, Asger Aleksandrov Granerud y Daniel Skjold Pedersen, Days of Wonder, 2022", "\"Lleva tu coche al límite en busca de la victoria, pero no lo sobrecalientes\"", "(@SlyMathMan, https://boardgamegeek.com/image/7600012/)"] },
  "Chess 01": { file: "/img/Chess_01.webp", captionLines: ["*Ajedrez*, c. s. 15", "\"Jaque mate a tu oponente en este atemporal abstracto\"", "(@jack61, https://boardgamegeek.com/image/322244/)"] },
  "Yinsh 01": { file: "/img/Yinsh_01.webp", captionLines: ["*YINSH*, Kris Burm, Don & Co., 2003", "\"Mueve los anillos sobre las piezas para darles la vuelta, creando filas de cinco de tu color\"", "(@minordemon, https://boardgamegeek.com/image/32162/)"] },
  "Planted 01": { file: "/img/Planted_01.webp", captionLines: ["*Planted*: A Game of Nature & Nurture, Phil Walker-Harding, Buffalo Games, 2022", "\"Cuida tu propia colección de plantas de interior\"", "(@huggynkiss, https://boardgamegeek.com/image/7535111/)"] },
  "Amritsar 01": { file: "/img/Amritsar_01.webp", captionLines: ["*Amritsar: The Golden Temple*, David Heras Pino, Ludonova, 2023", "\"El maharajá necesita tus habilidades con el mancala y tu elefante para reconstruir el templo\"", "(@dramaplastika, https://boardgamegeek.com/image/7606954/)"] },
  "Agricola 02": { file: "/img/Agricola_02.webp", captionLines: ["*Agricola*, Uwe Rosenberg, Lookout Games, 2007", "\"Construye tu granja sembrando campos y criando ganado. ¡Pero no olvides comer!\"", "(@milenaguberinic, https://boardgamegeek.com/image/2459385/)"] },
  "MenNefer 01": { file: "/img/MenNefer_01.webp", captionLines: ["*Men-Nefer*, Germán P. Millán, Ludonova, 2024", "\"Viaja a la capital del antiguo Egipto y participa en el desarrollo de su cultura\"", "(@dramaplastika, https://boardgamegeek.com/image/8306856/)"] },
  "LittleWars 01": { file: "/img/LittleWars_01.jpg", captionLines: ["*Little Wars*, H. G. Wells, Frank Palmer, 1913", "\"Un juego para chicos de doce a ciento cincuenta años y para ese tipo de chica inteligente a la que le gustan los juegos y libros de chicos\"", "(https://en.wikipedia.org/wiki/Little_Wars#/media/File:HG_Wells_playing_to_Little_Wars.jpg)"] },
  "Gettysburg 01": { file: "/img/Gettysburg_01.webp", captionLines: ["*Gettysburg*, Charles S. Roberts, The Avalon Hills Games, 1958", "\"Una representación temprana de un juego de guerra de mesa sobre la crucial batalla de la Guerra Civil\"", "(@theaney, https://boardgamegeek.com/image/131796/)"] },
  "Granada 01": { file: "/img/Granada_01.webp", captionLines: ["*Granada*, Iván Cáceres, Compass Games, 2021", "\"Los últimos años de la Reconquista\"", "(@perdut, https://boardgamegeek.com/image/5366074/)"] },
  "FireLake 01": { file: "/img/FireLake_01.webp", captionLines: ["*Fire in the Lake*, Mark Herman y Volko Ruhnke, GMT Games, 2014", "\"Juega como Estados Unidos, el Vietcong, el Ejército de la República de Vietnam o el Ejército Popular de Vietnam para controlar Vietnam en COIN: Volumen IV\"", "(@Jobermallow, https://boardgamegeek.com/image/2212850/)"] },
  "DienBienPhu 01": { file: "/img/DienBienPhu_01.webp", captionLines: ["*Dien Bien Phu: The Final Gamble*, Kim Kanger, Legion Wargames LLC, 2014", "\"El enfrentamiento final entre el Viet Minh y Francia en un valle remoto de Vietnam\"", "(@Jean_Leviathan, https://boardgamegeek.com/image/8890208/)"] },
  "EmbersWar 01": { file: "/img/EmbersWar_01.jpg", captionLines: ["*Embers of War: The Fall of an Empire and the Making of America's Vietnam*, Frederik Logevall, Random House, 2013", "\"Ganador del Premio Pullitzer en 2013, el libro abarca el conflicto de Vietnam desde la Conferencia de Paz de Versalles de 1919 hasta 1959, cuando los primeros soldados estadounidenses mueren en una emboscada cerca de Saigón en Vietnam, centrándose en la Guerra de Indochina entre Francia y el Viet Minh\""] },
  "Memoir44 01": { file: "/img/Memoir44_01.webp", captionLines: ["*Memoir '44*, Richard Borg, Days of Wonder, 2004", "\"Revive las batallas del Día D y controla las fuerzas de los Aliados y del Eje\"", "(@chuckles2000, https://boardgamegeek.com/image/61082/)"] },
  "CubaLibre 01": { file: "/img/CubaLibre_01.webp", captionLines: ["*Cuba Libre*, Jeff Grossman y Volko Ruhnke, GMT Games, 2013", "\"Juega como una de las cuatro facciones que compiten por el control de Cuba en COIN Vol:2, un juego de cartas\"", "(@Djord, https://boardgamegeek.com/image/3885338/)"] },
  "BritishWay 01": { file: "/img/BritishWay_01.webp", captionLines: ["*The British Way: Counterinsurgency at the End of Empire*, Stephen Rangazas, GMT Games, 2023", "\"Cuatro simulacros de guerra sobre la contrainsurgencia británica en Palestina, Malasia, Kenia y Chipre\"", "(@Djord, https://boardgamegeek.com/image/7597139/)"] },
  "BritishWay 02": { file: "/img/BritishWay_02.webp", captionLines: ["*The British Way: Counterinsurgency at the End of Empire*, Stephen Rangazas, GMT Games, 2023", "\"Cuatro simulacros de guerra sobre la contrainsurgencia británica en Palestina, Malasia, Kenia y Chipre\"", "(@Boardgamespixels, https://boardgamegeek.com/image/8640543/)"] },
  "GuerrillaGeneration 01": { file: "/img/GuerrillaGeneration_01.webp", captionLines: ["*The Guerrilla Generation: Cold War Insurgencies in Latin America*, Stephen Rangazas, GMT Games, 2026", "\"Cuatro juegos sobre insurgencias de la Guerra Fría en Uruguay, Nicaragua, El Salvador y Perú\"", "(@lesgrossman20, https://boardgamegeek.com/image/9310516/)"] },
  "SpiritIsland 01": { file: "/img/SpiritIsland_01.webp", captionLines: ["*Spirit Island*, R. Eric Reuss, Greater Than Games LLC, 2017", "\"Los espíritus de la isla unen fuerzas usando poderes elementales para defender su hogar de los invasores\"", "(@skutsch, https://boardgamegeek.com/image/3656498/)"] },
  "JohnCompany 01": { file: "/img/JohnCompany_01.webp", captionLines: ["*John Company: Second Edition*, Cole Wehrle, Wehrlegig Games, 2022", "\"Prométete y engatusa para llegar a la cima mientras diriges la Compañía Británica de las Indias Orientales\"", "(@bladerunner007, https://boardgamegeek.com/image/8380925/)"] },
  "Amritsar 02": { file: "/img/Amritsar_02.webp", captionLines: ["*Amritsar: The Golden Temple*, David Heras Pino, Ludonova, 2023", "\"El maharajá necesita tus habilidades con el mancala y tu elefante para reconstruir el templo\"", "(@Littleboy6, https://boardgamegeek.com/image/7928918/)"] },
  "Amritsar 03": { file: "/img/Amritsar_03.webp", captionLines: ["*Amritsar: The Golden Temple*, David Heras Pino, Ludonova, 2023", "\"El maharajá necesita tus habilidades con el mancala y tu elefante para reconstruir el templo\"", "(@dramaplastika, https://boardgamegeek.com/image/7606951/)"] },
  "Lisboa 01": { file: "/img/Lisboa_01.webp", captionLines: ["*Lisboa*, Vital Lacerda, Eagle-Gryphon Games, 2017", "\"Compite para reconstruir la ciudad de Lisboa tras el gran terremoto de 1755\"", "(@MeepleMaven, https://boardgamegeek.com/image/3599777/)"] },
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

// Esta función crea una “prueba visual” para un viz: un gráfico simple con ECharts.
// La idea no es que sea el resultado final, sino confirmar que las cuentas y filtros son correctos.
function showVizPlaceholder(vizKey) {
  clearStickyMedia();

  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "320px";
  stickyMediaEl.appendChild(container);

  const summary = computeVizSummary(vizKey, bggData);

  activeEcharts = echarts.init(container);
  activeEcharts.setOption(buildPlaceholderOption(summary));

  showStickyFadeIn();
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
  if (current.type === "viz") showVizPlaceholder(current.key);
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
