// ########## LAYER 1 ##########
import Layer from 'ol/layer/Layer.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {composeCssTransform} from 'ol/transform.js';
import ImageLayer from 'ol/layer/Image';
import ImageSource from 'ol/source/Image';
import {createLoader as createStatic} from 'ol/source/static';
import {load} from 'ol/Image.js';

// ########## LAYER 2 ##########
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Icon, Style} from 'ol/style.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Vector as VectorLayer} from 'ol/layer.js';

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";


// Fonction pour charger un fichier JSON
function loadJSON(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur de chargement du fichier JSON depuis ${url}`);
      }
      return response.json();
    });
}

// Charger plusieurs fichiers JSON simultanément
Promise.all([
  loadJSON('datas/svg/floors.json'),
  loadJSON('datas/config.json'),
  loadJSON('datas/points/points.json')
])
.then(data => {
  // Les données sont disponibles ici dans l'ordre dans lequel elles ont été chargées
    const floors = data[0];
    const config = data[1];
    const points = data[2];

    // Charger les valeurs de la sous-catégorie "image"
    const imageExtent = config.image.extent;

    // Charger les valeurs de la sous-catégorie "map"
    const mapCenter = config.map.center;
    const mapExtent = config.map.extent;
    const mapProjection = config.map.projection;
    const mapZoom = config.map.zoom;

    // Charger les valeurs de la sous-catégorie "icon"
    const iconAnchor = config.icon.anchor;
    const iconSrc = config.icon.src;
    const iconWidth = config.icon.width;
    const iconHeight = config.icon.height;

    // Charger les valeurs de la sous-catégorie "3d"
    const file3d = config.html5.file;

    function getAllSelectableLevels() {
        let allSelectableLevels = [];
        for (const floor in floors) {
            const parameters = floors[floor].parameters;
            if (parameters && parameters.level3D.trim() !== "") {
                allSelectableLevels.push(parameters.level3D);
            }
        }
        return allSelectableLevels;
    }
    const getSelectableLevels = getAllSelectableLevels();

    // Global variables
    let selectedFloor = ""; // Variable pour enregistrer l'étage sélectionné

    const backgroundLayer = new ImageLayer({
    });

    // Créer l'objet IconStyle
    const iconStyle = new Style({
      image: new Icon({
        anchor: iconAnchor,
        src: iconSrc,
        width: iconWidth,
        height: iconHeight,
      }),
    });

    // Créer la map
    const map = new Map({
      target: document.getElementById('map'),
      view: new View({
        center: mapCenter,
        extent: mapExtent,
        projection: mapProjection,
        zoom: mapZoom,
      }),
    });
    map.addLayer(backgroundLayer);


//############################################################################################## ACTIONS #################################################################################################   
    // Fonction pour charger et afficher un SVG en fonction du filtre sélectionné et du niveau sélectionné
    function loadFilteredSVG(floor, filter) {
        const svgFile = floors[floor].filters[filter];
        loadSVG(svgFile);
    }

    // Fonction pour charger la valeur de level3D en fonction de l'étage sélectionné
    function loadLevel3D(selectedFloor) {
        const parameters = floors[selectedFloor].parameters;
        if (parameters && parameters.level3D.trim() !== "") {
            btn3D.style.display = 'block';
            return parameters.level3D;
        } else {
            btn3D.style.display = 'none';
        }
    }

    // Fonction pour charger les options de filtre pour un étage spécifique
    function loadFloorFilters(floor) {
        const dropdown = document.getElementById('filter-dropdown');
        const filters = Object.keys(floors[floor].filters);

        // Effacer les options existantes
        dropdown.innerHTML = '';

        // Ajouter les nouvelles options
        filters.forEach(filter => {
            const option = document.createElement('option');
            option.value = filter;
            option.textContent = filter.charAt(0).toUpperCase() + filter.slice(1); // Mettre en majuscule la première lettre
            dropdown.appendChild(option);
        });
    }

   // Fonction pour déterminer si l'utilisateur est sur un téléphone mobile
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }


// ############################################################################################## BUTTONS ##########
    // Fonction pour gérer le clic sur les boutons d'étage
    function handleFloorButtonClick(event) {
        // Retirer la classe "active" de tous les boutons d'étage
        const floorButtons = document.querySelectorAll('.floor-button');
        floorButtons.forEach(button => {
            button.classList.remove('active');
        });
        // Ajouter la classe "active" au bouton cliqué
        event.target.classList.add('active');

        // Récupérer le filtre actuel
        const currentFilter = document.getElementById('filter-dropdown').value;

        // Charger les filters pour l'étage sélectionné
        selectedFloor = event.target.textContent;
        loadFloorFilters(selectedFloor);
        loadPointsOfInterest(selectedFloor);

        // Charger le SVG filtré par le filtre actuel s'il existe pour le nouvel étage, sinon charger le premier filtre disponible
        const availableFilters = Object.keys(floors[selectedFloor].filters);
        const newFilter = availableFilters.includes(currentFilter) ? currentFilter : availableFilters[0];
        document.getElementById('filter-dropdown').value = newFilter;
        loadFilteredSVG(selectedFloor, newFilter);

        // Charger la valeur de level3D et l'afficher
        loadLevel3D(selectedFloor);
    }


    // Appelez la fonction pour créer les boutons lors du chargement de la page
    function createFloorButtons() {
        const container = document.querySelector('.left-controls');
        let isFirst = true;
        for (const floor in floors) {
            const button = document.createElement('button');
            button.textContent = floor;
            button.classList.add('floor-button');
            if (isFirst) {
                button.classList.add('active'); // Activer le premier bouton par défaut
                isFirst = false;
            }
            button.addEventListener('click', handleFloorButtonClick);
            container.appendChild(button);
        }
    }

    // Appelez la fonction pour créer les boutons lors du chargement de la page
    createFloorButtons();
// ############################################################################################## BUTTONS ##########


// ############################################################################################## LISTE ##########
// Fonction pour créer la liste déroulante des étages
    function createFloorDropdown() {
        const container = document.querySelector('.left-controls');
        const dropdown = document.createElement('select');
        dropdown.id = 'floor-dropdown';
        dropdown.classList.add('filter-style'); // Ajout de la classe filter-style
        
        // Ajouter un événement de changement pour la liste déroulante
        dropdown.addEventListener('change', handleFloorDropdownChange);
        
        // Ajouter les options de la liste déroulante
        for (const floor in floors) {
            const option = document.createElement('option');
            option.value = floor;
            option.textContent = floor;
            dropdown.appendChild(option);
        }

        container.appendChild(dropdown);

        // Appel de la fonction pour gérer le changement d'étage initial
        handleFloorDropdownChange({ target: dropdown }); // Appel de la fonction avec un objet simulant l'événement pour charger les éléments initiaux
    }

// Fonction pour gérer le changement d'étage depuis la liste déroulante
    function handleFloorDropdownChange(event) {
        const currentFilter = document.getElementById('filter-dropdown').value;
        
        selectedFloor = event.target.value;
        loadFloorFilters(selectedFloor);
        loadPointsOfInterest(selectedFloor);

        // Charger le SVG filtré par le filtre actuel s'il existe pour le nouvel étage, sinon charger le premier filtre disponible
        const availableFilters = Object.keys(floors[selectedFloor].filters);
        const newFilter = availableFilters.includes(currentFilter) ? currentFilter : availableFilters[0];
        document.getElementById('filter-dropdown').value = newFilter;
        loadFilteredSVG(selectedFloor, newFilter);

        // Charger la valeur de level3D et l'afficher
        loadLevel3D(selectedFloor);
    }
// ############################################################################################## LISTE ##########


// ############################################################################################## COUCHE ##########
    // Fonction pour créer la liste déroulante des filters
    function createFilterDropdown(selectedFloor) {
        const dropdown = document.getElementById('filter-dropdown');
        dropdown.innerHTML = ''; // Effacer les options existantes

        const filters = Object.keys(floors[selectedFloor].filters);

        // Ajouter les options de la liste déroulante
        filters.forEach(filter => {
            const option = document.createElement('option');
            option.value = filter;
            option.textContent = filter.charAt(0).toUpperCase() + filter.slice(1); // Mettre en majuscule la première lettre
            dropdown.appendChild(option);
        });
    }

    // Fonction pour créer dynamiquement la liste des options pour le menu déroulant en fonction du niveau sélectionné
    function createFilterOptions(selectedFloor) {
        const dropdown = document.getElementById('filter-dropdown');
        dropdown.innerHTML = ''; // Effacer les options existantes

        const filters = Object.keys(floors[selectedFloor].filters);

        // Ajouter les options
        filters.forEach(filter => {
            const option = document.createElement('option');
            option.value = filter;
            option.textContent = filter.charAt(0).toUpperCase() + filter.slice(1); // Mettre en majuscule la première lettre
            dropdown.appendChild(option);
        });
    }

    function handleFilterDropdownChange() {
            // Ajouter un événement de sélection pour chaque option du menu déroulant
            document.getElementById('filter-dropdown').addEventListener('change', function() {
            const filter = this.value;
            const floor = selectedFloor;
            loadFilteredSVG(floor, filter);
        });
    }
    handleFilterDropdownChange();

    function handle3DButtonClick(event) {
        const url = `3D/viewHome.html?homeUrl=${encodeURIComponent(file3d)}&getLevel=${encodeURIComponent(loadLevel3D(selectedFloor))}&getSelectableLevels=${encodeURIComponent(JSON.stringify(getSelectableLevels))}`;
        Fancybox.show([
            {
                src: url,
                type: 'iframe' // Peut être 'iframe', 'image', etc.
            }
        ]);
    }
    const btn3D = document.getElementById('btn3D');
    btn3D.addEventListener('click', handle3DButtonClick);
// ############################################################################################## COUCHE ##########


// ############################################################################################## INIT ##########
    // Vérifier si l'utilisateur est sur un téléphone mobile et le nombre d'étages est supérieur à 2
    if (isMobileDevice() && Object.keys(floors).length > 2) {
        // Supprimer les boutons d'étages existants s'ils existent
        const floorButtons = document.querySelectorAll('.floor-button');
        floorButtons.forEach(button => {
            button.remove();
        });

        // Créer la liste déroulante des étages
        createFloorDropdown();
    }

    // INIT : Appelez la fonction pour créer les options du menu déroulant lors du chargement de la page
    selectedFloor = Object.keys(floors)[0];
    createFilterOptions(selectedFloor);
    loadPointsOfInterest(selectedFloor);
    const defaultFilter = Object.keys(floors[selectedFloor].filters)[0];
    loadFilteredSVG(selectedFloor, defaultFilter);
    loadLevel3D(selectedFloor);
// ############################################################################################## INIT ##########


//############################################################################################## OPENLAYER ##############################################################################################
// ############################################################################################## LAYER 1 ##########
    // Fonction pour charger un SVG à partir d'une URL
    function loadSVG(url) {
        // Créer une nouvelle source d'image avec l'URL fournie
        const imageSource = new ImageSource({
            loader: createStatic({
                url: url,
                imageExtent: imageExtent,
                load: load,
            }),
        });
        // Mettre à jour la source de la couche de fond avec la nouvelle source d'image
        backgroundLayer.setSource(imageSource);
        backgroundLayer.setZIndex(1);
    }


// ############################################################################################## LAYER 2 ##########
    // Fonction pour créer une entité (feature) à partir des données d'un point
    function createIconFeature(geometryCoordinates, properties) {
        const pointGeometry = new Point(geometryCoordinates);

        // Créer l'entité (feature)
        const iconFeature = new Feature({
            geometry: pointGeometry,
            name: properties.name,
            type: properties.type,
            data: properties.data
        });

        // Ajout du style
        iconFeature.setStyle(iconStyle);

        return iconFeature;
    }

    // Créer une fonction pour charger les points d'intérêt correspondant à un étage spécifique
    function loadPointsOfInterest(floor) {
        // Créer une source vectorielle
        const vectorSource = new VectorSource();

        // Filtrer les points d'intérêt correspondant à l'étage sélectionné
        const filteredPoints = points.filter(point => point.properties.floor === floor);

        // Ajouter les points d'intérêt filtrés à la source vectorielle
        filteredPoints.forEach(pointData => {
            const iconFeature = createIconFeature(pointData.geometry.coordinates, pointData.properties);
            vectorSource.addFeature(iconFeature);
        });

        // Supprimer toutes les couches vectorielles existantes de la carte
        map.getLayers().forEach(layer => {
            if (layer instanceof VectorLayer) {
                map.removeLayer(layer);
            }
        });

        // Créer une couche vectorielle avec la source vectorielle
        const vectorLayer = new VectorLayer({
            source: vectorSource
        });
        vectorLayer.setZIndex(9999);

        // Ajouter la couche vectorielle à la carte
        map.addLayer(vectorLayer);
    }

    // Appeler la fonction loadPointsOfInterest pour charger les points d'intérêt initiaux lors du chargement de la page
    loadPointsOfInterest(selectedFloor);
//############################################################################################## OPENLAYER ##############################################################################################


//############################################################################################## MAP EVENTS ##############################################################################################
    // Ajout de l'événement de clic pour récupérer les coordonnées et les afficher
    map.on('click', function(event) {
        const coordinates = event.coordinate;
        document.getElementById('y').value = parseInt(coordinates[1]);
        document.getElementById('x').value = parseInt(coordinates[0]);
    });

    // change mouse cursor when over marker
    map.on('pointermove', function (e) {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? 'pointer' : '';
    });

    // Ajouter un événement de clic pour les points d'intérêt
    map.on('singleclick', function(event) {
        map.forEachFeatureAtPixel(event.pixel, function(feature) {
            Fancybox.show([
                {
                    src: feature.get('data'),
                    type: feature.get('type')
                }
            ]);
        });
    });
//############################################################################################## MAP EVENTS ##############################################################################################

})
.catch(error => {
  console.error('Erreur lors du chargement des fichiers JSON :', error);
});