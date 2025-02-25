## 0.19.0 (2020-12-23)
### editor
* improved: zoneSelector is still active and visible after mapview change
* improved: updated zoneSelector styling and improved customization
* fixed: display correct Zone offset positions in all cases
* fixed: Zone Markers are not draggable in some cases
### core
* fixed: data will be send twice if a remote postProcessor is used.
### display
* added: line geometries can now be split into several segments and styled individually. usage: style.from/to=number[0-1] (0-100%)
* added: Support to display lines offset to the left or right side. use: style.offset=number. positive/negative values offsets in pixel to the left/right side (relative to line direction)
* improved: crisp icon rendering
* improved: Image tiles are rendered more sharply
* fixed: proper pointer-event triggering for offset point-styles
* fixed: map aligned icons are displayed with double size
* fixed: trigger pointer-events for lines and polygons correctly in all cases
* fixed: point data of MVT datasources that`s located outside of the actual tile boundaries might be placed incorrectly
* fixed: rotated text can be invisible
* fixed: offset text can be placed incorrectly if map is rotated
* fixed: label collision detection for offset text

## 0.18.0 (2020-12-7)
### display
* added: support for right to left text and arabic contextual forms
* added: Automatic line wrapping for Text on Point geometries. use
* added: support explicit line breaks '\n' for text on Point geometries
* improved: Correctly render font outlines in case of text characters are overlapping/nested
* improved: sharper text rendering
* improved: text rendering performance and memory usage.
* fixed: font opacity is ignored if the style is using alpha in fill or stroke colors
* fixed: text on line geometry can be upside down if map is rotated

## 0.17.0 (2020-11-9)
### core
* added: introduced provider postprocessors and preprocessors to enable custom data processing for remote data sources.
* improved: add/remove Feature is more robust for invalid input
* fixed: adding an empty FeatureCollection/Array via provider.addFeature(..) throws an exception. [fix #43]
### editor
* fixed: zoneSelector util does not display side of zone [fix #44]
### display
* fixed: tiny lines (centimeter range) might only be partially rendered [fix #42]
* fixed: mapdata can be invisible if map is initialized with zoomlevel greater than 20
* fixed: text-style properties for line geometries are ignored if defined as style-functions. [fix #41]

## 0.16.0 (2020-10-9)
### display
* added: Support for global style-based feature drawing order across all layers. usage: style.zLayer=number
* improved: Drawing order doesn't affect label priority handling in collision detection
* fixed: slight flickering at image tile boundaries/edges on iOS devices
* fixed: possible invisible labels that are colliding and placed very close to tile boundaries
### editor
* improved: use cross layer styling to ensure routing-point is always rendered below display-point
* fixed: navlink direction/turn-restriction icons are aligned incorrectly when map is pitched/rotated [fix #40]

## 0.15.2 (2020-9-11)
### editor
* improved: Area drawing with drawingBoard. invalid geometry (self-intersections) are temporarily allowed and highlighted.
### display
* fixed: Zoom steps using the mousewheel in Firefox are very small [fixes #36]
* fixed: layerStyles backgroundColor is ignored in case of default backgroundColor is set via display.setBackgroundColor(..) [fixes #35]
* fixed: invisible viewport in case of map is initialized with element that`s not inserted into DOM

## 0.15.1 (2020-8-21)
### display
* improved: Icon positioning precision when map is zoomed in very close (zoomlevel >22)
* fixed: ZoomControl UI becomes invisible on safari when map is pitched and Compass UI is active
* fixed: Circles/Rects are partially not visible on mobile (iOS/Android)

## 0.15.0 (2020-8-19)
### editor
* improved: Geometry editing when map is pitched or rotated
* improved: indexing of Places and Addresses that are including routing points
* fixed: update custom zlevels when a navlink shape gets removed
### display
* added: the map can now be zoomed in much closer to enable use cases like indoor editing. use: displayOptions.maxLevel=number to set max allowed zoomlevel
* added: Support for alignment "map" for Rects and Circles
* added: Support for alignment "viewport" for Icons/Images [default]
* added: Polygons/Lines and Points(Rect/Circle/Image/Text) can be drawn in front or behind of extruded polygons (buildings) depending on "zIndex" property
* improved: improved animation when zooming in/out
* fixed: Image styles using rotation with negative angle is ignored
* fixed: Circle and Rects are cut off on the plane when map is pitched
* fixed: draw strokeWidth of rects with correct size in pixel
* fixed: Possible rendering artifacts for polygon outlines when map is pitched
* fixed: various issues when browser zoom is active
* fixed: possible bright outlines for lines using stroke dasharray

## 0.14.1 (2020-7-27)
### editor
* fixed:  (virtual)shapes of simple LINE features are not draggable
* fixed:  remote feature search by id errors in case of result feature geometry is missing

## 0.14.0 (2020-7-14)
### editor
* added: attribute reader/writer interface to allow use of custom zLevel models
### display
* added: styling support of 3-digit hex color codes
* added: styling now supports "zoomRanges" to define zoom dependant values. values for intermediate zoom levels will be interpolated linearly. e.g. "radius": { "5": 10, "15": 20 }
* added: hide tile boundaries of polygon geometry from clipped datasources
* improved: disable pointerevent triggering while mapview is changing
* improved: more robust/tolerant parsing of invalid css rgb(a) color codes
* fixed: trigger pointerevents for MVT datasources
* fixed: artifacts when map is pitched and image tiles are placed below vector tiles
* fixed: allow style functions for font stroke/fill colors
* fixed: possible flicker of tile boundaries
* fixed: call stylefunctions always with correct zoomlevel
### core
* fixed: consider tilesize for contentbounds determination when tilemargin is used

## 0.13.0 (2020-6-10)
### editor
* added: Full editing support of LocalProvider data with Editor component. use providerOptions.editable=true to allow editing.
* fixed: add hole(s) to polygon geometries works in all cases
* removed: deprecated legacy API interface
### display
* added: show map Compass UI widget when rotate/pitch behaviour is activated. Mapview gets reset on click.
* improved: optimized triangulation of extrudes from unclipped source data
* fixed: visible tile boundaries for certain geometries using alpha when map is pitched/rotated
* fixed: trigger "mapviewchange" event if map pitch is changing only.
* fixed: correct drawing order for tile preview data in all cases
* fixed: triangulation of polygon geometry from geojson 2d datasources
* fixed: draw full polygon geometry when coordinates are modified/updated
* fixed: visible tile flickering on zoom changes

## 0.12.0 (2020-5-22)
### display
* added: control minimum distance of repeated text labels on line geometries via style.repeat=number
* improved: optimised memory usage and performance improvement of geometry buffer creation
* improved: optimised triangulation of polygons from unclipped source data
* improved: reuse projected coordinates if line geometry is rendered multiple times
* improved: major performance improvement of line triangulation of very large unclipped geometries
* fixed: behavior settings on mobile/touch have no effect
* fixed: set exact minimum/maximum configured zoomlevel by mouse/touch
* fixed: default to configured "minLevel" when viewport lock gets reset
* fixed: text labels are placed correctly on line geometries in all cases
* fixed: possible strokedasharray pattern mismatch of ending line segments
* fixed: artifacts for polygon geometry with very large coordinate count
### editor
* fixed: update "hovered" state of places/addresses when pointerenter/pointerleave listeners are executed
### core
* added: preprocess result of remote search by id(s) if custom preprocessor is defined

## 0.11.1 (2020-4-24)
### display
* improved: two finger pinch gesture detection on touch devices
* improved: cross layers collision detection with mixed tilesizes
* fixed: FeatureProviders are hidden if used in combination with ImageProvider
* improved: correct orientation of text on line geometry when map is rotated

## 0.11.0 (2020-4-21)
### display
* added: it's now possible to pitch and rotate the map
* added: label collision detection for Text based on Line geometries.
* added: realtime label collision when map gets transformed
* added: control visibility of Text in case of label collision via style.priority=number
* added: control alignment of Text if map is pitched/rotated via style.alignment="map"|"viewport"
* added: set initial map pitch/rotate via options.pitch/options.rotate=number
* added: initial behavior settings can now be configured via options.behavior
* added: pitch/rotate map via api by map.pitch(deg) or map.rotate(deg)
* fixed: init map with float zoomlevel
* fixed: show TAC UI even if no url is defined
* fixed: viewportReady event can get triggered too early (webgl only)
* fixed: stroke of rects/circles is rendered with wrong strokeWidth on retina devices
* fixed: text positioning on retina devices if style uses offsetX/offsetY
### editor
* fixed: make sure parentlink is in origin state if linksplit gets reverted in any case

## 0.10.1 (2020-3-9)
### general
* fixed:  bundling issues when webpack is used to consume packages
### editor
* fixed:  Line/Navlink Shapes not displayed correctly in case of feature style is using value functions

## 0.10.0 (2020-03-03)
### display
* added: new webgl based 3d map renderer.
* added: use style.extrude property to render polygon extrudes (buildings).
* added: label collision detection. active by default. use style.collide=false to deactivate.
* added: Default Copyright Owner can now be set via display options: options.UI.Copyright.defaultOwner=string
* added: Terms and Conditions UI can now be configured: options.UI.Copyright.termsAndConditions={label?:string, url:string}
* added: custom Map Logo can now be set via displayOptions.UI.Logo.url=string
* fixed: Copyright UI is initially showing details button even if enough space is available
* fixed: Copyright UI is updating copyright info on zoom change in any case
* fixed: pointerevent triggering is not disabled during pan/zoom animations for better smoothness
* fixed: pointerevent triggering ignores zIndex for stacked (multi)polygons
* fixed: try to recreate tile preview if none is available
* fixed: rect positioning and rotation
### core
* improved: clipped data processing improves map responsiveness
* fixed: calculate feature's bbox in case its already existing
