# Contribution

Not all the world boundaries are straight forward yet. There are a lot of disputed territories, there are countries which are associated to another countries, there are overseas territories and much more. This repository's goal is to cover as much as possible. That's why there are countries, areas/regions and states (coming in release 3) boundaries included. Besides that, there are different maps with slightly different geography, i.e. different minor islands, coast lines, etc. This repository was created mostly using "Mapbox" so some boundaries might not fit Gmaps and other maps perfectly.

Contributions are highly encouraged in order to increase this repository consistency and accuracy. Below are some tips on how a code contribution should be made.


## Scale
If you use geojson tool mentioned in the README, please make sure that you are on a proper scale when creating 
polygons - 20km (better 10km) should be displayed in the bottom-right corner. For smaller countries/states 
10km (better 5km) scale is preferrable.

Ther is no need to be accurate on this scale. It's usually enough to have about 1cm between points, however if border
changes direction drastically, it would be a good idea to put points closer and follow the direction. There are a lot 
of examples in existings files.

## Coast lines
Put 3 to 5 millimeter space between coast line and polygon line in the proposed scale.

## Islands
If an island is visible on the proposed scale, it should be marked around.

## Island groups
Groups of smaller islands located close to one another should be placed into one polygon.

## Map compatibility
Try to check compatibility with most used maps if possible. Increase polygon area if it's needed.
