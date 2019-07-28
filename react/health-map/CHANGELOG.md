# CHANGELOG

All notable changes to this project will be documented in this file.
CURRENT VERSION: 1.0.15 - FORMAT: version - dd/mm/yyyy

## 1.0.15 - 18/07/2019
* Merge and Destroy working with jobs
* Permanent ghost path on map bug fix
* Minor UI fixes

## 1.0.14 - 16/07/2019
* Move deliveries from one route to another
* Minimum deliveries capacity
* New interface of how points are visualized in the map
* Using destroy refactor with jobs

## 1.0.13 - 4/07/2019
* Filter points inside polygon
* Multi city filter for SAAS

## 1.0.12 - 1/07/2019
* Show route tags
* Merge Recommendation
* Multi capacity routing
* Time windows routing

## 1.0.11 - 13/06/2019
* Split Routes functionality (remove and create)
* Autorouting Per Pickup using clusterize insted of create
* Consistency support of tasks on UI
* List width fix

## 1.0.10 - 30/06/2019
* Fallback to maintain consistency with DB on Polygon Tool
* Let user paste a list of tasks ids on filter
* Fixing crazy map zoom of previous release

## 1.0.9 - 29/05/2019
* Fix of unexisting cities & fix of route per pickup
* Fixing UI on pickup-per-route

## 1.0.8 - 22/05/2019
* One Pickup-Per-Route autorouting.
* Filtering deliveries on map by common point
* Filtering deliveries on map by type of activity
* Filtering deliveryes by status

## 1.0.7 - 16/05/2019
* Redering single delivery trajectory when selected
* Allowing ops to see the remaining single deliveries in the polygon tool
* Fixing the add deliveries tool from failing when a suggested delivery had
packages with prices

## 1.0.6 - 16/04/2019
* Add deliveries fix

## 1.0.5 - 15/04/2019
* Remove deliveries from route

## 1.0.4 - 08/04/2019
* Displaying delivery address for pickups and dropoffs in the polygon tool
* Differenciating pickups from dropoffs in the polygon tool
* Filter by delivery type in the polygon tool

## 1.0.3 - 04/04/2019
* Fixing a bug that did not show the deliveries when grouping by pickup
* Reverse logic when creating a polygon. If a delivery is inside a polygon,
it'll stay in that polygon, even if you draw a new polygon over it.

## 1.0.2 - 04/04/2019
* Routing socket url and client restrictions
* Cursor as pointer when hover a stop in the map

## 1.0.1 - 03/04/2019
Fixing the polygon tool from breaking and adding an error message

## 1.0.0 - 03/04/2019
New routing tool
