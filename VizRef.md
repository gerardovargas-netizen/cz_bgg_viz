# Visualization Reference Guide
 
Use this document as reference to know which visualizations to attach to each step of the scroll.

Nested below each {{}} key you will find the cart type, the dataset used and descriptions about the filters and manipulations needed to produce the chart.
## Datasets

All the visualizations use the BGG_FullExtras_Final_V3.csv dataset. This is the data dictionary:

- **Property:** `Game ID`
    - **Description:** Unique numeric identifier for the board game on BoardGameGeek.
    - **Datatype:** `int64`
- **Property:** `Rank`
    - **Description:** Current global popularity rank of the board game.
    - **Datatype:** `int64`
- **Property:** `Game Name`
    - Description: Official title of the board game.
    - **Datatype:** `object`
- **Property:** `Description`
    - **Description:** Full descriptive text of the game's premise, theme, and gameplay.
        
    - **Datatype:** `object`
        
- **Property:** `Yearpublished`
    
    - **Description:** The calendar year the game was originally released.
        
    - **Datatype:** `int64`
        
- **Property:** `Minplayers`
    
    - **Description:** The minimum recommended number of players.
        
    - **Datatype:** `int64`
        
- **Property:** `Maxplayers`
    
    - **Description:** The maximum recommended number of players.
        
    - **Datatype:** `int64`
        
- **Property:** `Playingtime`
    
    - **Description:** The typical average duration of a game session in minutes.
        
    - **Datatype:** `int64`
        
- **Property:** `Minplaytime`
    
    - **Description:** The minimum expected duration of a game session.
        
    - **Datatype:** `int64`
        
- **Property:** `Maxplaytime`
    
    - **Description:** The maximum expected duration of a game session.
        
    - **Datatype:** `int64`
        
- **Property:** `Minage`
    
    - **Description:** The recommended minimum age of players.
        
    - **Datatype:** `int64`
        
- **Property:** `Thumbnail`
    
    - **Description:** URL pointing to the low-resolution thumbnail image of the game.
        
    - **Datatype:** `object`
        
- **Property:** `Image`
    
    - **Description:** URL pointing to the full-resolution artwork or box art image.
        
    - **Datatype:** `object`
        
- **Property:** `Categories`
    
    - **Description:** Comma-separated list of thematic genres assigned to the game.
        
    - **Datatype:** `object`
        
- **Property:** `Mechanics`
    
    - **Description:** Comma-separated list of gameplay systems and core mechanics.
        
    - **Datatype:** `object`
        
- **Property:** `Families`
    
    - **Description:** Raw crowd-sourced tags representing game family groupings, settings, and themes.
        
    - **Datatype:** `object`
        
- **Property:** `Expansions`
    
    - **Description:** List of official expansions available for the game.
        
    - **Datatype:** `object`
        
- **Property:** `Accessories`
    
    - **Description:** List of official accessories (inserts, playmats, coins) associated with the game.
        
    - **Datatype:** `object`
        
- **Property:** `Integrations`
    
    - **Description:** Related systems or shared-universe integration references.
        
    - **Datatype:** `object`
        
- **Property:** `Implementations`
    
    - **Description:** Direct game engine or ruleset implementations/predecessors.
        
    - **Datatype:** `object`
        
- **Property:** `Designers`
    
    - **Description:** List of the primary game designers.
        
    - **Datatype:** `object`
        
- **Property:** `Artists`
    
    - **Description:** List of the primary graphic artists and illustrators.
        
    - **Datatype:** `object`
        
- **Property:** `Publishers`
    
    - **Description:** Full list of companies that have published the game.
        
    - **Datatype:** `object`
        
- **Property:** `MainPublisher`
    
    - **Description:** The single primary publisher associated with the game.
        
    - **Datatype:** `object`
        
- **Property:** `PubOriginCountry`
    
    - **Description:** ISO-3 standard code representing the country of origin for the main publisher.
        
    - **Datatype:** `object`
        
- **Property:** `PubOriginCoordLon`
    - **Description:** Geographic longitude (EPSG:4326) for the center of the publisher's country.
    - **Datatype:** `float64`
- **Property:** `PubOriginCoordLat`
    - **Description:** Geographic latitude (EPSG:4326) for the center of the publisher's country.
    - **Datatype:** `float64`
- **Property:** `RawGeoTags`
    - **Description:** Intermediate extraction of geographic family tags for audit purposes.
    - **Datatype:** `object`
- **Property:** `ReprDestCountry`
    - **Description:** ISO-3 standard code representing the thematic location/setting of the game.
    - **Datatype:** `object`
- **Property:** `ReprDestCoordLon`
    - **Description:** Geographic longitude (EPSG:4326) for the center of the thematic destination.
    - **Datatype:** `float64`
- **Property:** `ReprDestCoordLat`
    - **Description:** Geographic latitude (EPSG:4326) for the center of the thematic destination.
    - **Datatype:** `float64`
        
- **Property:** `BGGHistoricCatAges`
    
    - **Description:** Standardized historical era tag (e.g., 'World War II', 'Ancient') extracted from categories.
        
    - **Datatype:** `object`
- **Property:** `BGG20thCentFamiliesDecades
    - **Description:** Isolated 20th-century decade tag (e.g., '1920's') extracted from family tags.        
    - **Datatype:** `object
- **Property:** War
	- **Description:** Isolated wars from "Families" and "Categories" with cleanup to remove redundancies.        
    - **Datatype:** `object`
## Visualizations key

- {{Viz: Donut: AbstractNonAbstract}}
	- Chart Type: Donut
	- Data Processing Logic:
		- Use the column "Categories"
		- Display: Group 1 (Juegos abstractos), items that have "Abstract Strategy", Group 2 (Juegos no abstractos), items that don't have "Abstract Strategy"
	- Labels: 
	- Caption: Aquí aparecen los juegos clasificados como "Abstract Strategy" en BGG, frente a los que no tienen esa etiqueta

- {{Viz: StackedArea: TimeSeriesAbstractNonAbstract}}
	- Chart Type: Time series stacked area chart
	- Data Processing Logic:
		- Use columns "Yearpublished" and "Categories"
		- Display: A time series stacked area chart
			- X axis: Yearpublished >= 1990
			- Y axis: Group 1 (Juegos abstractos), items that have "Abstract Strategy", Group 2 (Juegos no abstractos), items that don't have "Abstract Strategy"
	- Labels: 
		- X axis: Año de publicación
		- Y axis:
		- Legend:
			- Juegos abstractos
			- Juegos no abstractos
	- Caption: Proporción de juegos abstractos y no abstractos desde 1990

- {{Viz: Donut: ThemedAbstractPureAbstract}}
	- Chart Type: Donut
	- Data Processing Logic:
		- Use columns "Categories" and "Families"
		- Display: Group 1 (Abstractos con tema), items where Categories contains "Abstract strategy" & items where Families contain "Theme:"; Group 2 (Abstractos puros), items where Categories contains "Abstract strategy" & items where Families does not contain "Theme:"
	- Labels: 
		- Legend: 
	- Caption: Juegos abstractos con tema y sin tema

- {{Viz: StackedArea: TimeSeriesThemedAbstractPureAbstract}}
	- Chart Type: Time series, stacked area chart
	- Data Processing Logic:
		- Use columns "Yearpublished" and "Categories" and "Families"
		- Display: A time series stacked area chart
			- X axis: Yearpublished >= 1990
			- Y axis: Group 1 (Abstractos con tema), items where Categories contains "Abstract strategy" & items where Families contain "Theme:"; Group 2 (Abstractos puros), items where Categories contains "Abstract strategy" & items where Families does not contain "Theme:"
	- Labels: 
		-  X axis: Año de publicación
		- Y axis:
		- Legend: 
			- Abstractos con tema
			- Abstractos puros
	- Caption: Juegos abstractos con tema y sin tema, desde 1990

- {{Viz: HorBar: AbstractThemes}}
	- Chart Type: Horizontal bars
	- Data Processing Logic:
		- Use columns "Categories" and "Families"
		- Filter "Categories", when contains "Abstract Strategy"
		- Count from column "Families", only values where text begins with "Theme:"
	- Display: Horizontal bars, starting from biggest, of "Theme:" values
	- Caption: Los temas representados en juegos abstractos

- {{Viz: WorldMapGraph: OriginDestinyNetwork}}
	- Chart Type: World map network chart
	- Data Processing Logic:
		- Origin point coordinates are stored in longitude, PubOriginCoordLon; latitude, PubOriginCoordLat
		- Destiny point coordinates are stored in longitude, ReprDestCoordLon; latitude, ReprDestCoordLat
		- Move destiny points to the right to avoid overlap with origin points
		- Display:
			- A World map with origin-destiny network lines
			- Origin points rendered in a single color
			- Destiny points rendered in a different color
			- Nodes have the info of how many items share the same origin-destiny combination
		- Labels: 
			- Legend:
				- Origin points color with caption: "País de editorial"
				- Destiny points color with caption: "País representado"
	- Caption: Mapa que muestra el origen de publicación y el país representado de todos los juegos de mesa que tratan sobre un país o ciudad específicos

- {{Viz: Choropleth: Destiny: SliderAges}}
	- Chart Type: Choropleth
	- Data Processing Logic: 
		- World map
		- ReprDestCountry stores ISO-3 standard code of countries represented in the dataset
		- Exclude rows where ReprDestCountry == "XXX"
		- Count means darker
		- BGGHistoricCatAges is used as a exclusive filter that applies to the dataset in the following order:
			- Ancient
			- Medieval
			- Renaissance
			- Pike and Shot
			- Age of Reason
			- Napoleonic
			- Post-Napoleonic
			- World War I
			- World War II
			- Korean War
			- Vietnam War
			- Modern Warfare
		- Display: Choropleth world map with a slider horizontal that filters data using BGGHistoricCatAges in the above order
	- Caption: Mapa que muestra cuántos juegos representan ciertos países en diversas épocas

- {{Viz: Choropleth: Destiny: SliderDecades}}
	- Chart Type: Choropleth
	- Data Processing Logic: 
		- World map
		- ReprDestCountry stores ISO-3 standard code of countries represented in the dataset
		- Exclude rows where ReprDestCountry == "XXX"
		- Count means darker
		- BGG20thCentFamiliesDecades is used as a exclusive filter that applies to the dataset in the following order:
			- 1920's
			- 1930's
			- 1940's
			- 1950's
			- 1960's
			- 1970's
			- 1980's
			- 1990's
			- 2000's
		- Display: Choropleth world map with a slider horizontal that filters data using BGG20thCentFamiliesDecades in the above order
	- Caption: Mapa que muestra cuántos juegos representan ciertos países en diversas décadas del Siglo XX

- {{Viz: Choropleth: DestinyAbstractNonAbstract}}
	- Chart Type: Choropleth Map
	- Data Processing Logic: 
		- World map
		- ReprDestCountry stores ISO-3 standard code of countries represented in the dataset
		- Check column "Categories" for presence of value "Abstract"
		- Display: Diverging color palette
			- "Abstract" is the color that represents items that contain "Abstract" in column "Categories"
			- "Thematic" is the color that represents items that does not contain "Abstract" in column "Categories"
	- Labels: 
		- Legend: Color key for the diverging palette from "Abstract" color to "Thematic" color
	- Caption: Proporción de juegos temáticos y no temáticos para los países representados en juegos de mesa

- {{Viz: Choropleth: DestinyLudemeDensity}}
	- Chart Type: Choropleth Map
	- Data Processing Logic: 
		- World map
		- ReprDestCountry stores ISO-3 standard code of countries represented in the dataset
		- Check column "Mechanics" for unique values
		- Count unique values and assign the resulting number to each country code
		- Display:
			- Color palette that expresses the amount of unique values in "Mechanics" for each country
	- Caption: ¿Con cuánta "densidad lúdica" son representados los países en los juegos de mesa?

- {{Viz: HorBar: MostCommonWars}}
	- Chart Type: Horizontal bars
	- Data Processing Logic: 
		- Check column "War"
		- Count every instance of each value
		- Order values from larges to smallest
		- Display: 
			- Horizontal bars for each value
			- The chart is vertically scrollable to be able to see every value (chart canvas height should be around 7 bars)
			- Horizontal canvas size should be able to fit the longes horizontal bar
			- Start from largest count at the top
	- Caption: Las guerras más representadas en los wargames

- {{Viz: Choropleth: CountryTargetWargame}}
	- Chart Type: Choropleth Map
	- Data Processing Logic: 
		- World map
		- ReprDestCountry stores ISO-3 standard code of countries represented in the dataset
		- Filter data, only items that contain "Wargame" under the column "Categories"
		- Display: Color palette that expresses the amount of appearances of each ReprDestCountry country after filtering as above
	- Caption: Los países más representados en los wargames

- {{Viz: Choropleth: OriginFranceDestinyAll}} 
	- Chart Type: Choropleth Map
	- Data Processing Logic: 
		- World map
		- PubOriginCountry stores ISO-3 standard code of countries represented in the dataset
		- Filter PubOriginCountry so that == FRA
		- Exclude rows where PubOriginCountry == "XXX"
		- ReprDestCountry stores ISO-3 standard code of countries represented in the dataset
		- Exclude rows where ReprDestCountry == "XXX"
		- Filter data, only items that contain "Wargame" under the column "Categories"
		- Display: Color palette that expresses the amount of appearances of each ReprDestCountry country after filtering as above
	- Caption: Los países representados en wargames franceses

- {{Viz: Choropleth: OriginUSDestinyAll}} 
	- Chart Type: Choropleth Map
	- Data Processing Logic: 
		- World map
		- PubOriginCountry stores ISO-3 standard code of countries represented in the dataset
		- Filter PubOriginCountry so that == USA
		- Exclude rows where PubOriginCountry == "XXX"
		- ReprDestCountry stores ISO-3 standard code of countries represented in the dataset
		- Exclude rows where ReprDestCountry == "XXX"
		- Filter data, only items that contain "Wargame" under the column "Categories"
		- Display: Color palette that expresses the amount of appearances of each ReprDestCountry country after filtering as above
	- Caption: Los países representados en wargames norteamericanos

- {{Viz: Choropleth: OriginCountryIndochina}}
	- Chart Type: Choropleth Map
	- Data Processing Logic: 
		- World map
		- Filter data, only items that contain "First Indochina War" under the column "War"
		- PubOriginCountry stores ISO-3 standard code of countries represented in the dataset
		- Exclude rows where PubOriginCountry == "XXX"
		- Display: Color palette that expresses the amount of appearances of each PubOriginCountry country after filtering as above
	- Caption: El país de origen de los wargames que tratan de la Guerra Indochina

- {{Viz: Choropleth: OriginCountryVietnam}} 
	- Chart Type: chart
	- Data Processing Logic: 
		- World map
		- Filter data, only items that contain "First Indochina War" under the column "War"
		- PubOriginCountry stores ISO-3 standard code of countries represented in the dataset
		- Exclude rows where PubOriginCountry == "XXX"
		- Display: Color palette that expresses the amount of appearances of each PubOriginCountry country after filtering as above
	- Caption: El país de origen de los wargames que tratan de la Guerra de Vietnam

- {{Viz: TimeSeries: TimeSeriesIndochinaVietnam / 2012 Embers of War}}
	- Chart Type: Time series
	- Data Processing Logic: 
		- Yearpublished > 1990
		- Time series, x is Yearpublished
		- Series one is column "War" contains "Vietnam War"
		- Series two is column "War" contains "First Indochina War"
		- Display:
			- Time series
			- A line at Yearpublished 2012 with a label: "Se publica Embers of War"
	- Labels: 
		- Legend:
			- Series one, "Guerra de Vietnam"
			- Series two, "Guerra de Indochina"
	- Caption: En 2012 se publica Embers of War, libro ganador del Premio Pullitzer que da gran visibilidad a la Guerra de Indochina

- {{Viz: Donut: IndochinaBDPhu}}
	- Chart Type: Donut
	- Data Processing Logic:
		- Filter data where column "War" contains "First Indochina War"
		- Read "Game Name" of filtered items
			- Group one is "Game Name" contains "Bien Dien Phu"
			- Group two is "Game Name" does not "Bien Dien Phu"
	- Labels: 
		- Legend:
			- Group one, "La batalla de Bien Dien Phu aparece en el título"
			- Group one, "La batalla de Bien Dien Phu no aparece en el título"
	- Caption: 
		- La batalla de Bien Dien Phu (13 de marzo al 7 de mayo, 1954) representa una victoria decisiva de las fuerzas del Viet Minh sobre el ejército del Imperio Francés. Ese mismo año se declara la independencia del Estado de Vietnam y un año después da inicio la Guerra de Vietnam.

- {{Viz: Choropleth: CategoriesWargamePolitical}}
	- Chart Type: Choropleth map
	- Data Processing Logic: 
		- World map
		- Filter column "Categories", contains "Wargame" and "Political"
		- ReprDestCountry stores ISO-3 standard code of countries represented in the dataset
		- Display: Color palette that expresses the amount of appearances of each ReprDestCountry country after filtering as above
	- Caption: Países representados en wargames clasificados como "políticos" en BGG

- {{Viz: TimeStackedArea: WargamesPoliticalTime}}
	- Chart Type: Stacked area time series
	- Data Processing Logic: 
		- Time series, x is Yearpublished
		- Filter Yearpublished > 1990
		- Group one is column "Catiegories", contains "Wargame"
		- Group two is column "Catiegories", contains "Wargame" and "Political"
		- Display:
			- Series one, "Wargames"
			- Series two, "Wargames políticos"
	- Caption: Publicación a lo largo del tiempo de wargames clasificados como "políticos" en BGG

- {{Viz: WorldMapGraph: OriginDestinyNetworkFilterColonial}}
	- Chart Type: Network map
	- Data Processing Logic:
		- Filter column "Families", contains "Theme: Colonial"
		- Origin point coordinates are stored in longitude, PubOriginCoordLon; latitude, PubOriginCoordLat
		- Destiny point coordinates are stored in longitude, ReprDestCoordLon; latitude, ReprDestCoordLat
		- Move destiny points to the right to avoid overlap with origin points
		- Display: 
			- A World map with origin-destiny network lines
			- Origin points rendered in a single color
			- Destiny points rendered in a different color
			- Nodes have the info of how many items share the same origin-destiny combination
	- Labels: 
		- Legend: 
			- Origin points color with caption: "País de editorial"
			- Destiny points color with caption: "País representado"
	- Caption:  Mapa que muestra el origen de publicación y el país representado de todos los juegos de mesa de temática colonial

- {{Viz: Alluvial: CatsThemesFilterColonial}}
	- Chart Type: Alluvial Driagram
	- Data Processing Logic:
		- First, filter column "Families", contains "Theme: Colonial"
		- Then, count and keep top ten values out of the columns:
			- "Categories", exclude "Card Game"
			- "Families", only values that begin with the text "Theme:", and exclude "Theme:Colonial"
			- "Mechanics"
		- Display:
			- Alluvial driagram
			- Steps:
				- "Categories"
				- "Families"
				- "Mechanics"
			- Horizontal bar to scroll, don't fill all the diagram within the canvas
	- Caption: Temas y mecánicas que aparecen en juegos "coloniales"

- {{Viz: TimeSeries: ThemeEnvironmentalProtection}}
	- Chart Type: Time series
	- Data Processing Logic: 
		- Time series, x is Yearpublished
		- Yearpublished > 1990
		- Data is filter, column "Families" contains "Theme: Environmental Protection / Degradation / Pollution"
	- Caption: Publicación a lo largo del tiempo de juegos de mesa que abordan el problema de la degradación ambiental

- {{Viz: Donut: ColonialIntersectPolitical}}
	- Chart Type: Donut
	- Data Processing Logic: 
		- Filter when column "Families" contains "Theme: Colonial"
		- Group one is items where column "Categories" contains "Political"
		- Group two is items where column "Categories" does not contain "Political"
	- Labels: 
		- Legend: 
			- Group one, "Juegos de temática clasificados como políticos
			- Group one, "Juegos de temática colonial que no están clasificados como políticos"
	- Caption: 
		- La representación de lo colonial en un juego de mesa no significa una adhesión u oposición política, ni sugiere de antemano que sus ludemas estén organizados para promover un mensaje explícito

- {{Viz: TimeSeriesArea: TimeSeriesFarmingVsNonFarming}}
	- Chart Type: Time Series Stacked Area
	- Data Processing Logic: 
		- Time series, x is Yearpublished
		- Yearpublished > 1990
		- Group one is all items
		- Group two is filter column "Categories", contains "Farming"
	- Labels: 
		- Legend: 
			- Group one, "Todos los juegos de mesa"
			- Group two, "Juegos de mesa sobre granjas"
	- Caption: Los juegos de mesa europeos han cargado durante años con el estereotipo de tener la agricultura como tema predominante