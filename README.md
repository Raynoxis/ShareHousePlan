# Introduction
ShareHousePlan lets you share the plans of a house under construction, which are in the format of “*.SVG*” files (Example : SweetHome3D export). ShareHousePlan lets you manage the different floors of the building, with filters and interest points (linked img, pdf, html) you can add. It's a PWA (Web app), which can be deployed as a Docker container.

I'll show you how it works soon on my Youtube channel. : https://www.youtube.com/@Raynoxis (*French*)
- Creation in SweetHome3D (with SVG export)
- The configuration of the application.

**[Subscribe](https://www.youtube.com/@Raynoxis)** if you want to help me ! Bye ;)
  
***

## Demo PC
[demoPc.webm](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/a60e24d3-3a94-40ad-9c98-d11a470a8788)

## Demo Mobile (PWA)
[demoMobile.webm](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/fb1d1eff-23c5-43ea-86f0-faffa37bcb4b)

*If you have more than two floors on your plans, don't worry, the buttons will become a drop-down list on mobile.*

***

# Deployment

**Available on Docker Hub : https://hub.docker.com/r/raynoxis/sharehouseplan**

## docker-compose.yml
```yaml
services:
  sharehouseplan:
    container_name: ShareHousePlan
    image: raynoxis/sharehouseplan:v1.1
    restart: always
    volumes:
      - ./datas:/app/datas
    ports:
      - 8080:8080
```

# SweetHome3D Use
- Before all, you have to install a Plug-in on SweetHome3D to enhances the export to SVG (better compression for Web..)
https://sourceforge.net/p/sweethome3d/plug-ins/43/

- First you haves to create some classic floor on SweetHome3D like : Floor1 or Floor2 and design your house floor by floor.
  
- After, for all your filters, you have to create somes "Floor of same Elevation" depending Floor1, and depending Floor2.
  
- Finally you can show/hide each to have the result : Floor + Filter
  
![SweetHome3D1](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/a37781eb-04af-4db0-9ce9-774f723bb069)
*Example to generate 'floor1_electricity.svg' : I add layers : 'Floor1' + 'Floor1 Elec'*

***

![SweetHome3D2](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/d0007e33-bf2b-495e-95c6-c911f7e27fdb)
 *With the active selection on 'Floor1 Elec' i can generate 'floor1_electricity.svg' (Before i hide 'Floor1 Legend' and 'Floor1 Lights')*

 - (OPTIONAL) : Install the Plug-in : '2DSymbols' on SweetHome3D, to have the same symbols as me.

***

# Configuration
## Datas
In **/app/datas** folder, you need to put all the configuration files and the datas.
| Name | Description|
| --- | --- |
| *config.json* | This file allows you to create the floors and their associated filters. Floors and Filters are associated to specific *.SVG* file. |
| *points.json* | This file allows you to create points at specific coordinates on the plan. Each point is associated with a floor, and opens the viewing of a file (*text, pdf, img*) when clicked.  |
| *.svg* | Put all *.SVG* files for all your floors and filters. (Example below) |
| others files.. | Put all files needed by your *point.json* (jpg, webp, png, pdf, etc..) |

##### Example
![demoDatas](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/cedbd14e-68c2-4050-83b0-ed7692f7733d)

***

#### config.json
##### Example
```json
{
  "floor1": {
    "nofilter": "datas/floor1.svg",
    "lights": "datas/floor1_lights.svg",
    "electricity": "datas/floor1_electricity.svg"
  },

  "floor2": {
    "nofilter": "datas/floor2.svg",
    "lights": "datas/floor2_lights.svg",
    "electricity": "datas/floor2_electricity.svg"
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
        "name": "Kitchen 1",
        "floor": "floor1",
        "type": "image",
        "data": "/datas/kitchen1.jpg"
      }
    },
    {
      "geometry": {
        "type": "Point",
        "coordinates": [92, -97]
      },
      "properties": {
        "name": "Kitchen 2",
        "floor": "floor1",
        "type": "image",
        "data": "/datas/kitchen2.jpg"
      }
    },
    {
      "geometry": {
        "type": "Point",
        "coordinates": [86, -105]
      },
      "properties": {
        "name": "Kitchen 3",
        "floor": "floor1",
        "type": "html",
        "data": "Be careful with the number of lights (suspension type) <br> so as not to obstruct the opening of the wall cabinet door"
      }
    },
    {
      "geometry": {
        "type": "Point",
        "coordinates": [12, -42]
      },
      "properties": {
        "name": "Room 1",
        "floor": "floor2",
        "type": "image",
        "data": "/datas/idea.webp"
      }
    },
    {
      "geometry": {
        "type": "Point",
        "coordinates": [37, -69]
      },
      "properties": {
        "name": "Room 2",
        "floor": "floor2",
        "type": "html",
        "data": "Checking door opening"
      }
    }
  ]
```
## License
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
