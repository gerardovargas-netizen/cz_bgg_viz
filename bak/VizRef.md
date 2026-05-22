# Visualization Reference Guide
 
Short descr

## Datasets

- For the visualizations that use the bgg_data/bgg_full:metadata_ranks.csv dataset, the available columns are:
	- Game ID
	- Rank
	- Game Name
	- Description
	- Yearpublished
	- Minplayers
	- Maxplayers
	- Playingtime
	- Minplaytime
	- Maxplaytime
	- Minage
	- Thumbnail
	- Image
	- Categories
	- Mechanics
	- Families
	- Expansions
	- Accessories
	- Integrations
	- Implementations
	- Designers
	- Artists
	- Publishers

## Visualizations key

- {{Viz: Donut: AbstractNonAbstract}}
	- Chart Type: Donut
	- Dataset: bgg_data/bgg_full_metadata_ranks.csv
	- Dataframe: Use the column "Categories"
		- Display: Group 1 (Juegos abstractos), items that have "Abstract Strategy", Group 2 (Juegos no abstractos), items that don't have "Abstract Strategy"
	- Labels: 
	- Caption: Aquí aparecen los juegos clasificados como "Abstract Strategy" en BGG, frente a los que no tienen esa etiqueta

- {{Viz: Histogram: TimeSeriesAbstractNonAbstract}}
	- Chart Type: Time series histogram
	- Dataset: bgg_data/bgg_full_metadata_ranks.csv
	- Dataframe: Use columns "Yearpublished" and "Categories"
		- Display: A time series histogram
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
	- Dataset: bgg_data/bgg_full_metadata_ranks.csv
	- Dataframe: Use columns "Categories" and "Families"
		- Display: Group 1 (Abstractos con tema), items where Categories contains "Abstract strategy" & items where Families contain "Theme:"; Group 2 (Abstractos puros), items where Categories contains "Abstract strategy" & items where Families does not contain "Theme:"
	- Labels: 
		- Legend: 
	- Caption: Juegos abstractos con tema y sin tema

- 
	- Chart Type: chart
	- Dataset: bgg_data/bgg_full_metadata_ranks.csv
	- Dataframe: Use columns "Yearpublished" and "Categories" and "Families"
		- Display: A time series histogram
			- X axis: Yearpublished >= 1990
			- Y axis: Group 1 (Abstractos con tema), items where Categories contains "Abstract strategy" & items where Families contain "Theme:"; Group 2 (Abstractos puros), items where Categories contains "Abstract strategy" & items where Families does not contain "Theme:"
	- Labels: 
		-  X axis: Año de publicación
		- Y axis:
		- Legend: 
			- Abstractos con tema
			- Abstractos puros
	- Caption: Juegos abstractos con tema y sin tema, desde 1990

- 
	- Chart Type: chart
	- Dataset: bgg_data/bgg_full:metadata_ranks.csv
	- Dataframe: 
		- Display: 
	- Labels: 
		- Legend: 
	- Caption: 

- 
	- Chart Type: chart
	- Dataset: bgg_data/bgg_full:metadata_ranks.csv
	- Dataframe: 
		- Display: 
	- Labels: 
		- Legend: 
	- Caption: 

- 
	- Chart Type: chart
	- Dataset: bgg_data/bgg_full:metadata_ranks.csv
	- Dataframe: 
		- Display: 
	- Labels: 
		- Legend: 
	- Caption: 

- 
	- Chart Type: chart
	- Dataset: bgg_data/bgg_full:metadata_ranks.csv
	- Dataframe: 
		- Display: 
	- Labels: 
		- Legend: 
	- Caption: 
