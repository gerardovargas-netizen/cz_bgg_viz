const CSV_PATH = "bgg_data/bgg_full_metadata_ranks.csv";

const IMG_MAP = {
  "Kanban 01": {
    src: "img/Kanban_01.webp",
    caption:
      "*Kanban EV*, Vital Lacerda, 2020. \"Los trabajadores de la fábrica de vehículos eléctricos optimizan e innovan para destacar en la gran reunión de la junta directiva\". (@newrev, https://boardgamegeek.com/image/5095231/kanban-ev)",
  },
  "Agricola 01": {
    src: "img/Agricola_01.webp",
    caption:
      "*Agricola*, Uwe Rosenberg, 2007. \"Construye tu granja sembrando campos y criando ganado. ¡Pero no olvides comer!\". (@nerdymove, https://boardgamegeek.com/image/1885236/agricola)",
  },
  "Freedom 01": {
    src: "img/Freedom_01.webp",
    caption:
      "*Freedom: The Underground Railroad*, Brian Mayer, 2013. \"Únete a otros abolicionistas para emancipar a los esclavos y guiarlos hacia la libertad en Canadá\". (@Puma85, https://boardgamegeek.com/image/5783098/freedom-the-underground-railroad)",
  },
  "Freedom 02": {
    src: "img/Freedom_02.webp",
    caption:
      "*Freedom: The Underground Railroad*, Brian Mayer, 2013. \"Únete a otros abolicionistas para emancipar a los esclavos y guiarlos hacia la libertad en Canadá\". (@Puma85, https://boardgamegeek.com/image/5783098/freedom-the-underground-railroad)",
  },
  "AceSpades 01": {
    src: "img/AceSpades_01.webp",
    caption:
      "*Ace of Spades*, Benjamín Amorín, 2025. \"Canaliza tu magia a través de jugadas de póker para resolver duelos peligrosos\". (@NasumQSU, https://boardgamegeek.com/image/9026993/ace-of-spades).",
  },
  "AceSpades 02": {
    src: "img/AceSpades_02.webp",
    caption:
      "*Ace of Spades*, Benjamín Amorín, 2025. \"Canaliza tu magia a través de jugadas de póker para resolver duelos peligrosos\". (@jambapg, https://boardgamegeek.com/image/9032399).",
  },
  "IanBogost 01": {
    src: "img/IanBogost_01.avif",
    caption:
      'Ian Bogost, Persuasive Games. The Expressive Power of Videogames, MIT Press, 2010. "Una exploración de la forma en que los videojuegos plantean argumentos y hacen declaraciones expresivas sobre el mundo, y que analiza su singular poder persuasivo en términos de sus propiedades computacionales"',
  },
  "CV 01": {
    src: "img/CV_01.webp",
    caption:
      "*CV*, Filip Miłuński, 2013. \"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\". (@szafa, https://boardgamegeek.com/image/1695059/cv)",
  },
  "CV 02": {
    src: "img/CV_02.webp",
    caption:
      "*CV*, Filip Miłuński, 2013. \"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\". (@Benterdimensional, https://boardgamegeek.com/image/5404873/cv)",
  },
  "CV 03": {
    src: "img/CV_03.webp",
    caption:
      "*CV*, Filip Miłuński, 2013. \"Construye una vida mejor a medida que adquieres conocimientos, una carrera profesional e incluso encuentras la felicidad social\". (@p0w3rserj, https://boardgamegeek.com/image/3598537/cv)",
  },
  "Santa Maria 01": {
    src: "img/SantaMaria_01.webp",
    caption:
      "*Santa Maria*, Kristian Amundsen Østby y Eilif Svensson, 2017. \"Construye y maximiza tu colonia de poliominós en el Nuevo Mundo\". (@sverbeure, https://boardgamegeek.com/image/3919584/santa-maria)",
  },
  "Azul 01": {
    src: "img/Azul_01.webp",
    caption:
      "*Azul*, Michael Kiesling, 2017. \"Embellece artísticamente las paredes de tu palacio obteniendo los azulejos más hermosos\". (@EchoOperative, https://boardgamegeek.com/image/3720018/azul)",
  },
  "Hegemony 01": {
    src: "img/Hegemony_01.webp",
    caption:
      "*Hegemony: Lead Your Class to Victory*, Vangelis Bagiartakis y Varnavas Timotheou, 2023. \"Simula una nación contemporánea completa en este eurojuego asimétrico de corte político-económico\". (@Tabletopping_Games, https://boardgamegeek.com/image/6499211/hegemony-lead-your-class-to-victory)",
  },
  "Heat 01": {
    src: "img/Heat_01.webp",
    caption:
      "*Heat: Pedal to the Metal*, Asger Aleksandrov Granerud y Daniel Skjold Pedersen, 2022. \"Lleva tu coche al límite en busca de la victoria, pero no lo sobrecalientes\". (@SlyMathMan, https://boardgamegeek.com/image/7600012/heat-pedal-to-the-metal)",
  },
  "Chess 01": {
    src: "img/Chess_01.webp",
    caption:
      '*Ajedrez*, c. s. 15. "Jaque mate a tu oponente en este atemporal abstracto". (@jack61, https://boardgamegeek.com/image/322244/chess)',
  },
  "Yinsh 01": {
    src: "img/Yinsh_01.webp",
    caption:
      "*YINSH*, Kris Burm, 2003. \"Mueve los anillos sobre las piezas para darles la vuelta, creando filas de cinco de tu color\". (@minordemon, https://boardgamegeek.com/image/32162/yinsh)",
  },
  "Planted 01": {
    src: "img/Planted_01.webp",
    caption:
      "*Planted*, Phil Walker-Harding, 2022. \"Cuida tu propia colección de plantas de interior\". (@huggynkiss, https://boardgamegeek.com/image/7535111/planted-a-game-of-nature-and-nurture)",
  },
  "Amritsar 01": {
    src: "img/Planted_01.webp",
    caption:
      "*Amritsar: The Golden Temple*, David Heras Pino, 2023. \"El maharajá necesita tus habilidades con el mancala y tu elefante para reconstruir el templo\". (@dramaplastika, https://boardgamegeek.com/image/7606954/amritsar-the-golden-temple)",
  },
};

const VIZ_META = {
  "Donut: AbstractNonAbstract": {
    caption:
      'Aquí aparecen los juegos clasificados como "Abstract Strategy" en BGG, frente a los que no tienen esa etiqueta',
  },
  "Histogram: TimeSeriesAbstractNonAbstract": {
    caption: "Proporción de juegos abstractos y no abstractos desde 1990",
  },
  "Donut: ThemedAbstractPureAbstract": {
    caption: "Juegos abstractos con tema y sin tema",
  },
  "Histogram: TimeSeriesThemedAbstractPureAbstract": {
    caption: "Juegos abstractos con tema y sin tema, desde 1990",
  },
};

const THEMED_DONUT_KEY = "Donut: ThemedAbstractPureAbstract";

const CATEGORY_COLORS = {
  themed: "#5F7D6E",
  pure: "#B85C38",
};

let bggData = [];
let currentVizKeys = [];
let activeVizIndex = 0;
let suppressCardFade = false;
let resizeDebounceTimer = null;

const scroller = scrollama();
const graphicEl = document.getElementById("graphic");
const stickyStage = document.getElementById("sticky-stage");

const VIZ_RENDERERS = {
  [THEMED_DONUT_KEY]: renderThemedAbstractDonut,
};

function fieldIncludes(value, needle) {
  if (!value || !needle) return false;
  return value.toLowerCase().includes(needle.toLowerCase());
}

function isAbstractStrategy(row) {
  return fieldIncludes(row.Categories, "Abstract Strategy");
}

function hasFamilyTheme(row) {
  return fieldIncludes(row.Families, "Theme:");
}

function yearGte(row, y) {
  const year = +row.Yearpublished;
  return !Number.isNaN(year) && year >= y;
}

function filterAbstractNonAbstract(data) {
  const abstract = data.filter(isAbstractStrategy);
  const nonAbstract = data.filter((row) => !isAbstractStrategy(row));
  return { abstract, nonAbstract, total: data.length };
}

function filterAbstractNonAbstractSince1990(data) {
  const filtered = data.filter((row) => yearGte(row, 1990));
  const { abstract, nonAbstract, total } = filterAbstractNonAbstract(filtered);
  return { abstract, nonAbstract, total, yearFiltered: filtered.length };
}

function filterThemedPureAbstract(data) {
  const abstractOnly = data.filter(isAbstractStrategy);
  const themed = abstractOnly.filter(hasFamilyTheme);
  const pure = abstractOnly.filter((row) => !hasFamilyTheme(row));
  return { themed, pure, abstractTotal: abstractOnly.length };
}

function filterThemedPureAbstractSince1990(data) {
  const filtered = data.filter((row) => yearGte(row, 1990));
  const { themed, pure, abstractTotal } = filterThemedPureAbstract(filtered);
  return {
    themed,
    pure,
    abstractTotal,
    yearFiltered: filtered.length,
  };
}

const VIZ_FILTERS = {
  "Donut: AbstractNonAbstract": (data) => {
    const { abstract, nonAbstract, total } = filterAbstractNonAbstract(data);
    return {
      lines: [
        `Chart: Donut: AbstractNonAbstract`,
        `Loaded with ${total} rows`,
        `Juegos abstractos: ${abstract.length}`,
        `Juegos no abstractos: ${nonAbstract.length}`,
      ],
    };
  },
  "Histogram: TimeSeriesAbstractNonAbstract": (data) => {
    const result = filterAbstractNonAbstractSince1990(data);
    return {
      lines: [
        `Chart: Histogram: TimeSeriesAbstractNonAbstract`,
        `Rows since 1990: ${result.yearFiltered}`,
        `Juegos abstractos: ${result.abstract.length}`,
        `Juegos no abstractos: ${result.nonAbstract.length}`,
      ],
    };
  },
  "Donut: ThemedAbstractPureAbstract": (data) => {
    const { themed, pure, abstractTotal } = filterThemedPureAbstract(data);
    return {
      lines: [
        `Chart: Donut: ThemedAbstractPureAbstract`,
        `Loaded with ${data.length} rows`,
        `Abstractos (total): ${abstractTotal}`,
        `Abstractos con tema: ${themed.length}`,
        `Abstractos puros: ${pure.length}`,
      ],
    };
  },
  "Histogram: TimeSeriesThemedAbstractPureAbstract": (data) => {
    const result = filterThemedPureAbstractSince1990(data);
    return {
      lines: [
        `Chart: Histogram: TimeSeriesThemedAbstractPureAbstract`,
        `Rows since 1990: ${result.yearFiltered}`,
        `Abstractos con tema: ${result.themed.length}`,
        `Abstractos puros: ${result.pure.length}`,
      ],
    };
  },
};

function captionToHtml(text) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts
    .map((part) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return `<em>${part.slice(1, -1)}</em>`;
      }
      return part;
    })
    .join("");
}

function getCardContent() {
  let el = document.getElementById("card-content");
  if (!el) {
    el = document.createElement("div");
    el.id = "card-content";
    graphicEl.appendChild(el);
  }
  return el;
}

function clearCardContent() {
  const el = getCardContent();
  el.classList.remove("is-visible");
  el.innerHTML = "";
}

function fadeInCardContent() {
  if (suppressCardFade) return;
  const el = getCardContent();
  el.classList.remove("is-visible");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add("is-visible");
    });
  });
}

function clearGraphic() {
  const controls = stickyStage.querySelector(".viz-controls");
  if (controls) controls.remove();
  graphicEl.innerHTML = "";
  const card = document.createElement("div");
  card.id = "card-content";
  graphicEl.appendChild(card);
}

function getThemedAbstractSlices() {
  const { themed, pure } = filterThemedPureAbstract(bggData);
  return [
    {
      id: "themed",
      label: "Abstractos con tema",
      value: themed.length,
      color: CATEGORY_COLORS.themed,
    },
    {
      id: "pure",
      label: "Abstractos puros",
      value: pure.length,
      color: CATEGORY_COLORS.pure,
    },
  ];
}

function setDonutLegendActive(activeId) {
  document.querySelectorAll(".donut-legend-item").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.sliceId === activeId);
  });
}

function highlightDonutSlice(activeId) {
  d3.selectAll(".donut-arc").attr("opacity", (d) =>
    d.data.id === activeId ? 1 : 0.35
  );
  setDonutLegendActive(activeId);
}

function resetDonutHighlight() {
  d3.selectAll(".donut-arc").attr("opacity", 1);
  d3.selectAll(".donut-legend-item").classed("is-active", false);
}

function bindSliceHover(targetId) {
  highlightDonutSlice(targetId);
}

function renderThemedAbstractDonut() {
  const cardContent = getCardContent();
  const slices = getThemedAbstractSlices();
  const total = d3.sum(slices, (d) => d.value);

  const wrap = document.createElement("div");
  wrap.className = "donut-chart";

  if (total === 0) {
    wrap.innerHTML = "<p>No hay juegos abstractos en el dataset.</p>";
    cardContent.appendChild(wrap);
    appendVizCaption(cardContent, THEMED_DONUT_KEY);
    return;
  }

  const width = Math.min(320, cardContent.clientWidth || 320);
  const height = width;
  const radius = width / 2;
  const innerRadius = radius * 0.55;

  const svg = d3
    .select(wrap)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .style("max-width", `${width}px`);

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const pie = d3.pie().sort(null).value((d) => d.value);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius - 4);

  g.selectAll("path")
    .data(pie(slices))
    .join("path")
    .attr("class", (d) => `donut-arc donut-arc-${d.data.id}`)
    .attr("d", arc)
    .attr("fill", (d) => d.data.color)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .attr("opacity", 1)
    .on("mouseenter", (_, d) => bindSliceHover(d.data.id))
    .on("mouseleave", resetDonutHighlight);

  const legend = document.createElement("div");
  legend.className = "donut-legend";
  legend.setAttribute("role", "list");

  slices.forEach((slice) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "donut-legend-item";
    item.dataset.sliceId = slice.id;
    item.setAttribute("role", "listitem");

    const swatch = document.createElement("span");
    swatch.className = "donut-legend-swatch";
    swatch.style.backgroundColor = slice.color;

    const label = document.createElement("span");
    label.textContent = `${slice.label} (${slice.value.toLocaleString("es")})`;

    item.appendChild(swatch);
    item.appendChild(label);
    item.addEventListener("mouseenter", () => bindSliceHover(slice.id));
    item.addEventListener("mouseleave", resetDonutHighlight);
    item.addEventListener("focus", () => bindSliceHover(slice.id));
    item.addEventListener("blur", resetDonutHighlight);

    legend.appendChild(item);
  });

  cardContent.appendChild(wrap);
  cardContent.appendChild(legend);
  appendVizCaption(cardContent, THEMED_DONUT_KEY);
}

function appendVizCaption(parent, vizKey) {
  const meta = VIZ_META[vizKey];
  if (!meta?.caption) return;
  const cap = document.createElement("p");
  cap.className = "viz-caption";
  cap.textContent = meta.caption;
  parent.appendChild(cap);
}

function renderImage(key) {
  clearGraphic();
  const cardContent = getCardContent();
  const entry = IMG_MAP[key];
  if (!entry) {
    cardContent.innerHTML = `<p>Image key not found: ${key}</p>`;
    fadeInCardContent();
    return;
  }
  const wrap = document.createElement("div");
  const img = document.createElement("img");
  img.src = entry.src;
  img.alt = key;
  const cap = document.createElement("p");
  cap.className = "caption";
  cap.innerHTML = captionToHtml(entry.caption);
  wrap.appendChild(img);
  wrap.appendChild(cap);
  cardContent.appendChild(wrap);
  fadeInCardContent();
}

function renderVizPlaceholder(vizKey) {
  const cardContent = getCardContent();
  const filterFn = VIZ_FILTERS[vizKey];
  const meta = VIZ_META[vizKey] || {};
  const result = filterFn ? filterFn(bggData) : { lines: [`Unknown viz: ${vizKey}`] };

  const container = document.createElement("div");
  container.className = "viz-placeholder";

  const width = 360;
  const height = 200;
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#bbb");

  const textGroup = svg.append("g").attr("transform", "translate(12, 24)");

  result.lines.forEach((line, i) => {
    textGroup
      .append("text")
      .attr("y", i * 22)
      .attr("fill", "#222")
      .attr("font-size", "13px")
      .text(line);
  });

  cardContent.appendChild(container);
  appendVizCaption(cardContent, vizKey);
}

function renderViz(vizKey) {
  clearCardContent();
  const renderer = VIZ_RENDERERS[vizKey] || renderVizPlaceholder;
  renderer(vizKey);
  fadeInCardContent();
}

function getActiveVizKey() {
  return currentVizKeys[activeVizIndex];
}

function handleResize() {
  scroller.resize();
  if (getActiveVizKey() !== THEMED_DONUT_KEY) return;
  clearTimeout(resizeDebounceTimer);
  resizeDebounceTimer = setTimeout(() => {
    suppressCardFade = true;
    clearCardContent();
    renderThemedAbstractDonut();
    suppressCardFade = false;
    getCardContent().classList.add("is-visible");
  }, 150);
}

function ensureVizControls() {
  let controls = stickyStage.querySelector(".viz-controls");
  if (!controls) {
    controls = document.createElement("div");
    controls.className = "viz-controls";
    stickyStage.appendChild(controls);
  }
  controls.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.textContent = "← Anterior";
  prevBtn.addEventListener("click", () => {
    if (activeVizIndex > 0) {
      activeVizIndex -= 1;
      updateVizPanel();
    }
  });

  const indicator = document.createElement("span");
  indicator.className = "viz-indicator";

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.textContent = "Siguiente →";
  nextBtn.addEventListener("click", () => {
    if (activeVizIndex < currentVizKeys.length - 1) {
      activeVizIndex += 1;
      updateVizPanel();
    }
  });

  controls.appendChild(prevBtn);
  controls.appendChild(indicator);
  controls.appendChild(nextBtn);
  controls._indicator = indicator;
  controls._prevBtn = prevBtn;
  controls._nextBtn = nextBtn;
  return controls;
}

function updateVizControlsState() {
  const controls = stickyStage.querySelector(".viz-controls");
  if (!controls) return;
  controls._indicator.textContent = `${activeVizIndex + 1} / ${currentVizKeys.length}`;
  controls._prevBtn.disabled = activeVizIndex === 0;
  controls._nextBtn.disabled = activeVizIndex === currentVizKeys.length - 1;
}

function updateVizPanel() {
  clearGraphic();
  renderViz(currentVizKeys[activeVizIndex]);
  if (currentVizKeys.length > 1) {
    ensureVizControls();
    updateVizControlsState();
  }
}

function renderVizStep(vizKeysStr) {
  currentVizKeys = vizKeysStr.split(",").map((k) => k.trim());
  activeVizIndex = 0;
  updateVizPanel();
}

function handleStepEnter(response) {
  const el = response.element;
  const media = el.dataset.media;

  if (media === "img") {
    renderImage(el.dataset.imgKey);
    return;
  }

  if (media === "viz") {
    renderVizStep(el.dataset.vizKeys);
  }
}

function initScroller() {
  scroller
    .setup({
      step: ".step",
      offset: 0.5,
      debug: false,
    })
    .onStepEnter(handleStepEnter);

  window.addEventListener("resize", handleResize);
}

d3.csv(CSV_PATH)
  .then((rows) => {
    bggData = rows;
    console.log(`BGG data loaded: ${bggData.length} rows`);
    getCardContent().innerHTML = "";
    initScroller();
  })
  .catch((err) => {
    console.error(err);
    getCardContent().innerHTML =
      "<p class=\"loading\">Error al cargar CSV. Sirve la página con un servidor HTTP local.</p>";
  });
