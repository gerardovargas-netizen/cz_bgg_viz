# Layout General Guide

This documents contains rules and guidelines regarding the general layout and position of objects within the screen. This is a Scrollytelling project and thus is organized around two basic principles:
- A scrolling component (that function as step triggers)
- A sticky component

The scrolling component is inhabited by text, the sticky component will be of two main kinds:
- Images
- Data visualizations
On certain instances, specific text components will break this general rule, but will be clearly noted whenever that's the case.

## Sticky and scrolling components

The project uses a standard scrollytelling split-screen format.

The general rules for scrolling components are:
- They are the main step trigger for the scrollytelling / Scrollama functioning of the project
- Within @InfoOutline.md, scrolling elements are introduced as bullets with text
- Maintain bold and cursive text (indicated as markdown)
- Scrolling components appear on the right
- Specifications for the visual design of this text are noted elsewhere

The general rules for sticky components are:
- Within @InfoOutline.md, sticky elements are introduced as keys inside {Img: ...} or {{Viz: ...}} tags:
	- @ImgRef.md indicates  what images and captions belong to the {Img: ...} tags in the story
	- @VizRef.md contains the data visualization specifications for the {{Viz: ...}} tags
- Sticky components (both Img and Viz) appear on the left
- Sticky components use a card element that blocks the background
	- Specifications for the visual design of this card are noted elsewhere
- Whenever a single bullet contains more than one key, indicated by the presence of a "+" sign, interactive buttons should be added to switch between the elements (both Img and Viz) declared

## Accordion-type elements

A nested bullet within the text components of InfoOutline.md indicates the need of an accordion-like interaction.
- The nested bullet contains the hidden/expandable text
- In the parent bullet, bold text (noted in markdown) indicates the interactive element that expands/collapses the accordion text
- No extra visual or design elements are needed for accordion-type text, as it inherits any visual properties noted for its parent text

## Full-witdth components

Certain elements will break the sticky/scrolling general rule.

We'll use the notation present in @InfoOutline.md.

- H1 or # header is the main title of the project
	- Must be in bold typeface
	- Must use the full-width of the screen
	- Must appear at 50% screen height (the middle of the screen)
	- There's no content above it
	- Specifications for the visual design of this text are noted elsewhere
- H2 or ## headers are subtitles within the project
	- Must be in bold typeface
	- Must use the full-width of the screen
	- Specifications for the visual design of this card are noted elsewhere
- H3 or ### headers should not be rendered, but they indicate that the bullet within them should be treated in a specific way:
	- Full width text with no sticky or step trigger elements
	- Should appear centered
	- 45% empty space above
	- 45% empty space below
- H4 or #### headers should not be rendered, but they indicate that the bullet within them should be treated in a specific way:
	- A screen-width div card with the text contained in the bullet

### Added Rules

Any rules or comments or decisions (related to the layout) added to the project during the planning / building steps should be appended here:
- 