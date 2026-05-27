# Core Rules

This documents contains the general agent rules for this project.

This is a web storytelling project.

## Code comments

All code must be commented in a non-technical way, with proper explanations regarding its function and intention.

## Content

The text content included in InfoOutline.md should be hardcoded.

## Provided files

### Specifications

These are the project specifications:
- CoreRules.md
	- This rules document
- InfoOutline.md
	- This contains the narrative blocks and keys for images and data visualizations
- ImgRef.md
	- This contains the full catalog of images used
	- Keys for images as needed by InfoOutline.md are referenced here
- VizRef.md
	- This contains the full catalog of data visualizations used
	- Keys for images as needed by InfoOutline.md are referenced here
- Layout.md
	- This contains the general visual needs for the project
	- Rules that govern basic project functionality are here
- GraphicDesign.md
	- Graphic design, color and visual elements are explained here

### Folders
- img/ contains all the images used in the "sticky" element of the project
	- ImgRef.md points towards this folder as part of its specifications
- g_design/ contains graphical elements, such as background images
	- GraphicDesign.md points towards this folder as part of its specifications
- reference_images/ contains some visual reference images
	- GraphicDesign.md points towards this folder as part of its specifications

### Dataset
- An important component of this project is a series of data visualization
	- The dataset needed is in the file bgg_data/BGG_FullExtras_Final_V3.csv

### Interactive elements
Whenever the viz specification for a given data visualization indicate the presence of interactive elements / filters, said elements should integrated within the visualization space itself

## Libraries

This is a web project that requires Javascript libraries for some of its functions:
- Preferred scrollytelling library: Scrollama
- Preferred visualization library: Apache ECharts
	- When Apache ECharts is not the ideal library for any given visualization, use D3
	- When deciding which visualization to use, remember: while function and performance are priority, visual appeal is important

## Added Rules

Any rules or comments or decisions (related to the core rules governing the agent) added to the project during the planning / building steps should be appended here:

- 