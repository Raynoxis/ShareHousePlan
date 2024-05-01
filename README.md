# ShareHousePlan
**Share the plans of your house** under construction with **everyone** involved in the **construction process**, as well as with your family and friends. 
This application allows you to display an **interactive map** of the various construction **floors**, with **filters** and **points of interest**. These display **text, images and PDFs** at specific points on the floor plan and **you can customize everything** to suit your needs. 
I've also added support for a 3D viewer (SweetHome3D compatible only), so you can see a live 3D plan of your property and even visit it.

ShareHousePlan's interface works equally well on cell phones and PCs, and can be installed locally (PWA) to operate without the Internet.
![pwaInstallExample](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/6224d215-b97b-476b-80db-810bc5d025d2)

***

![Sweet Home 3D](https://www.sweethome3d.com/images/SweetHome3DLogo.png)

I created this application to display a SweetHome3D plan. You can use another application, but you must be able to generate ```.svg``` files.
Moreover, the 3D visualization function is only available from a Sweet Home 3D export (See below).

[Sweet Home 3D](https://www.sweethome3d.com) is a free interior design application
which helps you draw the plan of your house, arrange furniture on it and visit the results in 3D. 

***

<img src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg" width="150">

I'll show you how it works soon on my Youtube channel : https://www.youtube.com/@Raynoxis (*French*)
- Creation in SweetHome3D (with ```.svg``` export)
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
    image: raynoxis/sharehouseplan:latest
    restart: always
    volumes:
      - ./datas:/app/datas
    ports:
      - 8080:8080
```
- Create the file ```docker-compose.yml``` with a folder ```datas``` next to him. See below how to create your datas.

- Run ```docker compose up -d``` to start the container.

***



# SweetHome3D
## 2D plan
- Before all, you have to install a Plug-in on SweetHome3D to enhances the export to ```.svg``` (better compression for Web..)
https://sourceforge.net/p/sweethome3d/plug-ins/43/
***
- First you haves to create some classic floor on SweetHome3D (Floor1, Floor2, etc..) and design your house floor by floor. (You can add a scan of your scaled plan in the background.)

<img src="https://github.com/Raynoxis/ShareHousePlan/assets/34026291/fde5825c-d90f-4d07-a172-6b2e6067bd20" width="500">

*You have to put a square of walls around your plan, same on each floor. This is the size of mine. The ```.svg``` file depends on these walls.
  ***
- After, for all your filters, you have to create somes "Floor of same Elevation" depending Floor1, and depending Floor2 (It was at this stage that I cut all the plan's measurements and pasted them into a dedicated 'Legend' level.).
  ***
- Finally you can show/hide each to have the result : Floor + Filter
  
![SweetHome3D1](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/a37781eb-04af-4db0-9ce9-774f723bb069)
*Example to generate ```floor1_electricity.svg``` : I add layers : 'Floor1' + 'Floor1 Elec'*


![SweetHome3D2](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/d0007e33-bf2b-495e-95c6-c911f7e27fdb)
 *Visible levels are added from left to right. With the active selection on 'Floor1 Elec' i can generate ```floor1_electricity.svg``` (Before i hide 'Floor1 Legend' and 'Floor1 Lights')*
***
 - (OPTIONAL) : Install the Plug-in : '2DSymbols' on SweetHome3D, to have the same symbols as me.


  ## 3D visualization
For the 3D visualization of the house plan, exported from SweetHome3D, I used a fantastic community Plug-in. 
- A DEMO is available here: https://www.sweethome3d.com/blog/2016/05/05/export_to_html5_plug_in.html
- The Plug-in is available here under the name : 'ExportToHTML5' : https://www.sweethome3d.com/plugins.jsp

I've included the Plug-in's HTML code and libraries alongside my code, and added a link that allows my code to launch the Plug-in's page by sending it some datas.

**So if you select a level in 2D, and then display 3D, the corresponding floor will be loaded !**

***
After installing the Plug-in, you can export your 3D plan by selecting **'Tools'** then **'Export to HTML5'**.
Be sure to name the floors first, as this naming will have to be reported in ```floors.json``` for each level.
 ![html5](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/2150cc66-efdc-4dbf-828d-bdbc1a20e551)

***


  
# Configuration
## Datas

***Example datas : https://github.com/Raynoxis/ShareHousePlan/tree/main/docker/DATAS/datas***

In ```/app/datas``` folder, you need to put all the configuration files and the datas.
| Name | Description|
| --- | --- |
| **svg** | (NEEDED) This is the folder to put all ```.svg``` files for all your floors and filters + ```floors.json``` |
| **points** | (NEEDED) This is the folder to put all files needed for all yours points (jpg, webp, png, pdf, etc..) + ```points.json``` |
| **3D** | (OPTIONAL) This is the folder to put the ```.zip``` file of your exported 3D plan from HTML5 Plugin of SweetHome3D. Unzip the first exported ```.zip``` file from SH3D in a directory then put here the ```.zip``` from the directory |
| **svg/**```floors.json``` | (NEEDED) This file allows you to create the floors and their associated filters. Floors and Filters are associated to specific ```.svg``` file. It also associates 2D level names with level names in SweetHome3D (for 3D display) |
| **points/**```points.json``` | (NEEDED) This file allows you to create points at specific coordinates on the plan. Each point is associated with a floor, and opens the viewing of a file (*text, pdf, img*) when clicked. |
| ```config.json``` | (NEEDED) This file allows to configurate all options of 2D plan (Size, center, etc). It also permits to locate the ```.zip``` file for 3D. |

##### Example : In ```/app/datas/```
![datasExample](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/6342d581-07e1-4204-be04-b516af2bb3cf)

##### Example : In ```/app/datas/svg/```
![datasExample2](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/7ddce223-43c8-48d2-a143-07d54552bb0a)

##### Example : In ```/app/datas/points/```
![datasExample3](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/319da861-9e60-4321-bd79-2cb500f9de92)

##### Example : In ```/app/datas/3D/```
![datasExample4](https://github.com/Raynoxis/ShareHousePlan/assets/34026291/ce63e834-d9ba-4b01-8d65-ba0e68e9e3ea)

***

#### config.json
##### Example
```json
{
  "image": {
    "extent": [-180, -337, 284, 180]
  },
  "map": {
    "center": [51, -71],
    "extent": [-180, -337, 284, 180],
    "projection": "EPSG:4326",
    "zoom": 2
  },
  "icon": {
    "anchor": [0, 0],
    "src": "magnifier.png",
    "width": 30,
    "height": 30
  },
  "html5": {
    "file": "/datas/3D/3D.zip"
  }
}

```
***

#### floors.json
##### Example
```json
{
  "floor1": {
    "filters": {
      "nofilter": "datas/svg/floor1.svg",
      "lights": "datas/svg/floor1_lights.svg",
      "electricity": "datas/svg/floor1_electricity.svg"
    },
    "parameters": {
      "level3D": "Floor 1"
    }
  },

  "floor2": {
    "filters": {
      "nofilter": "datas/svg/floor2.svg",
      "lights": "datas/svg/floor2_lights.svg",
      "electricity": "datas/svg/floor2_electricity.svg"
    },
    "parameters": {
      "level3D": "Floor 2"
    }
    
  },
  "floorTest": {
    "filters": {
      "nofilter": "datas/svg/floor1.svg",
      "lights": "datas/svg/floor1_lights.svg",
      "test": "datas/svg/floor1_electricity.svg"
    },
    "parameters": {
      "level3D": ""
    }
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
        "data": "/datas/points/kitchen1.jpg"
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
        "data": "/datas/points/kitchen2.jpg"
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
        "data": "/datas/points/idea.webp"
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
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/) 
