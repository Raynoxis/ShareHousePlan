# Introduction
ShareHousePlan lets you share the plans of a house under construction, which are in the format of “*.SVG*” files (Example : SweetHome3D export). ShareHousePlan lets you manage the different floors of the building, with filters and interest points (linked img, pdf, html) you can add. It's a PWA (Web app), which can be deployed as a Docker container.

I'll show you how it all works, from creation in SweetHome3D with SVG export to the configuration  of the application on my Youtube channel. : https://www.youtube.com/@Raynoxis (French)

# Deployment
## docker-compose.yml
```yaml
services:
  sharehouseplan:
    container_name: ShareHousePlan-Test
    image: raynoxis/sharehouseplan:version1.0
    restart: always
    volumes:
      - ./datas:/app/datas
    ports:
      - 8080:8080
```
# Configuration
## Datas
In **/app/datas** folder, you need to put all the configuration files and the datas.
| Name | Description|
| --- | --- |
| *config.json* | This file allows you to create the floors and their associated filters. Floors and Filters are associated to specific *.SVG* file. |
| *points.json* | This file allows you to create points at specific coordinates on the plan. Each point is associated with a floor, and opens the viewing of a file (*text, pdf, img*) when clicked.  |
| *.svg* | Put all *.SVG* files for all your floors and filters. (Example below) |
| others files.. | Put all files needed by your *point.json* (jpg, webp, png, pdf, etc..) |

***

#### config.json
##### Example (French naming of floors ;-) )
```json
{
    "RDC": {
      "nofilter": "datas/RDC.svg",
      "lights": "datas/RDC_lights.svg",
      "electricity": "datas/RDC_electricity.svg"
    },

    "R+1": {
      "nofilter": "datas/R+1.svg",
      "lights": "datas/R+1_lights.svg",
      "electricity": "datas/R+1_electricity.svg"
    }
}
```
***

#### points.json
When you open the application, you can click on an area of interest, and retrieve the coordinates in the top right-hand corner to then add a new point to the file.
##### Example
```json
[
    {
      "geometry": {
        "type": "Point",
        "coordinates": [80, -85]
      },
      "properties": {
        "name": "Kitchen",
        "floor": "RDC",
        "type": "image",
        "data": "/datas/kitchen.jpg"
      }
    },
    {
      "geometry": {
        "type": "Point",
        "coordinates": [86, -105]
      },
      "properties": {
        "name": "Salon 1",
        "floor": "RDC",
        "type": "html",
        "data": "Warning on the number of lights in this room !!!"
      }
    },
    {
      "geometry": {
        "type": "Point",
        "coordinates": [12, -42]
      },
      "properties": {
        "name": "Room 1",
        "floor": "R+1",
        "type": "image",
        "data": "/datas/idea.webp"
      }
    }
  ]
```

## License
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
