// Look at ArcGISDynamicMapServiceLayer

import { Component, OnInit, ViewChild, ElementRef, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { loadModules } from 'esri-loader';
import { bindCallback } from 'rxjs';
//import { Polygon } from 'esri/geometry';
import { $ } from 'protractor';
//import esri = __esri;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  constructor() { }

  ngOnInit() {
    loadModules([
      "esri/tasks/Locator",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Search",
      "esri/widgets/Compass",
      "esri/widgets/Locate",
      "esri/core/watchUtils",
      "esri/request",
      "esri/Graphic",
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/Color"

    ])
      .then(([Locator, EsriMap, EsriMapView, FeatureLayer, Search, Compass, Locate, watchUtils, esriRequest, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color]) => {
        const resultsInfoMessage = "More information about the selected region will be displayed here.";
        const searchLimit = 1000;

        let resultsInfo = document.getElementById("resultsInfo") as HTMLTableElement;
        let resultsTable = document.getElementById("resultsTable") as HTMLTableElement;

        resultsInfo.innerHTML = resultsInfoMessage;

        // Create a locator task using the world geocoding service
        const locatorTask = new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        // Create the base map
        var map = new EsriMap({
          // basemap: 'dark-gray-vector'
          basemap: 'gray-vector'
        });

        // Create the map view that the map will start on
        const view = new EsriMapView({
          container: this.mapViewEl.nativeElement,
          center: [-106.3468, 56.1304],
          zoom: 3,
          map: map
        });

        var requestURL = 'https://represent.opennorth.ca/candidates/house-of-commons/?limit=10000';

        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();

        request.onload = function () {
          var federalCandidates = request.response;

          for (var candidate of federalCandidates.objects) {
            // var requestURL = 'https://represent.opennorth.ca' + candidate.related.boundary_url + 'shape';

            // var request2 = new XMLHttpRequest();
            // request2.open('GET', requestURL);
            // request2.responseType = 'json';
            // request2.send();

            // request2.onload = function () {
            //   console.log(request2.response)
            // }
            // console.log(candidate.related.boundary_url);
          }
        }

        var pointGraphic = null;
        var pointColor = null;

        // Set up an on-click event handler on the map to extract information based on coordinates
        view.on("click", function (event) {
          view.hitTest(event).then(function (response) {
            let coordinates = view.toMap({ x: event.x, y: event.y });
            let latitude = coordinates.latitude.toFixed(3);
            let longitude = coordinates.longitude.toFixed(3);

            let requestURL = 'https://represent.opennorth.ca/representatives/?point=' + latitude + '%2C' + longitude + '?limit=' + searchLimit;

            var options = {
              query: {
                f: 'json'
              },
              responseType: 'json'
            };

            return esriRequest(requestURL, options).then(function (response) {
              console.log(requestURL);

              if (pointGraphic != null) {
                view.graphics.remove(pointGraphic);
              }

              if (response.data.objects.length <= 0) {
                //resultsInfo.innerHTML = resultsInfoMessage;

                // Red color here symbolizes that the clicked spot does not have any valid representatives
                pointColor = [202, 0, 0];
              } else {
                pointColor = [0, 202, 0];

                resultsInfo.innerHTML = "";
                resultsTable.innerHTML = "";

                resultsTable.classList.add("resultsTable");

                let resultsHeader = resultsTable.createTHead();

                let headerRow = resultsHeader.insertRow(-1);
                let headerCell = headerRow.insertCell(-1);
                headerCell.colSpan = 8;
                headerCell.innerHTML = "<h3>Representatives</h3>";
                headerCell.setAttribute("style", "text-align:center; border:1px solid black");

                let resultsBody = resultsTable.createTBody();

                let counter = 0;
                let resultsRow = resultsBody.insertRow(-1);

                for (var candidate of response.data.objects) {
                  if (candidate.elected_office) {
                    if (counter++ >= 4) {
                      resultsRow = resultsBody.insertRow(-1);
                      counter = 1
                    }

                    let resultsCell = resultsRow.insertCell(-1);
                    resultsCell.setAttribute("style", "border:1px solid black;");

                    let resultsName = document.createElement("h4");
                    resultsName.append(document.createTextNode(candidate.name));
                    resultsCell.append(resultsName);

                    let resultsLink = document.createElement("a");

                    let resultsPicture = document.createElement("img");
                    resultsPicture.setAttribute("width", "200px");

                    // Check to see if data has a provided URL
                    if (candidate.photo_url != "") {
                      // Check to see if the URL is actually valid by checking img height
                      let img = new Image();
                      img.src = candidate.photo_url;
                      if (img.height != 0) {
                        resultsPicture.setAttribute("src", candidate.photo_url);
                      } else {
                        resultsPicture.setAttribute("src", "/assets/image/image_not_found.png");
                      }
                    } else {
                      resultsPicture.setAttribute("src", "/assets/image/image_not_found.png");
                    }

                    // Add a link on the image to their provided website if applicable
                    // Also apply border to let users know the picture has a link
                    if (candidate.personal_url != "") {
                      resultsLink.setAttribute("href", candidate.personal_url);
                      resultsLink.setAttribute("target", "_blank");
                      resultsPicture.setAttribute("style", "border:2px ridge blue");
                    }

                    resultsLink.append(resultsPicture);
                    resultsCell.append(resultsLink);

                    resultsCell = resultsRow.insertCell(-1);

                    // Append Party text node if the extracted data is not blank
                    if (candidate.party_name != "") {
                      resultsCell.append(document.createTextNode("Party: " + candidate.party_name));
                      resultsCell.append(document.createElement("br"));
                    }

                    resultsCell.append(document.createTextNode("District: " + candidate.district_name));
                    resultsCell.append(document.createElement("br"));
                    resultsCell.append(document.createTextNode("Elected Office: " + candidate.elected_office));

                    if (candidate.offices[0] && candidate.offices[0].tel) {
                      resultsCell.append(document.createElement("br"));
                      resultsCell.append(document.createTextNode(candidate.offices[0].tel));
                    }

                    resultsCell.append(document.createElement("br"));
                    let emailLink = document.createElement("a");
                    emailLink.setAttribute("href", "mailto:" + candidate.email);
                    resultsCell.append(emailLink);
                    emailLink.append(document.createTextNode(candidate.email));
                  }
                }
              }

              pointGraphic = new Graphic({
                geometry: {
                  type: "point",
                  longitude: longitude,
                  latitude: latitude
                },
                symbol: {
                  type: "simple-marker",
                  color: pointColor,
                  outline: {
                    color: [255, 255, 255],
                    width: 2
                  }
                }
              });

              view.graphics.add(pointGraphic);
            });

            // if (response.results.length) {
            //   const graphic = response.results.filter(function (result) {
            //     return result.graphic.layer === federalLayer;
            //   });

            //   let regionName = graphic.attributes.name;
            // }


          });
        });

        // view.when(function () {
        //   // This function will execute once the promise is resolved
        //   console.log("Map loaded.");
        // })
        //   .catch();

        // // Listen to layerview create event for the layers
        // view.on("layerview-create", function (event) {
        //   console.log("Layer created.");
        // });

        // view.popup.watch("selectedFeature", function (feature) {
        //   if (feature) {
        //     console.log(Object.entries(feature));
        //   }
        // });

        // Compass widget
        var compass = new Compass({ view: view });

        // Locate widget
        var locateWidget = new Locate({ view: view });

        view.ui.add(compass, "top-left");
        view.ui.add(locateWidget, "top-left");

        // var federalLayerLabels = {
        //   symbol: {
        //     type: "text",
        //     color: "#FFFFFF",
        //     haloColor: "#000000",
        //     haloSize: "2px",
        //     font: {
        //       size: "36px",
        //       family: "Noto Sans",
        //       style: "italic",
        //       weight: "normal"
        //     }
        //   },
        //   //labelPlacement: "above-center",
        //   labelExpressionInfo: {
        //     expression: "return $feature[\"ed_namee\"];"
        //   }
        // };

        var generalBoundaries = new FeatureLayer({
          url: "https://webservices.maps.canada.ca/arcgis/rest/services/ELECTIONS/federal_electoral_districts_boundaries_2015_en/MapServer/0",
          // labelingInfo: [federalLayerLabels],
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          // popupTemplate: {
          //   title: "<b>{name}</b>",
          //   outFields: ["*"],
          //   // content: queryDivisionInformation
          // }
        });

        map.add(generalBoundaries);

        // generalBoundaries.on("mouse-over", function(response) {
        //   let graphics = response.results;

        //   graphics.forEach(function (graphic) {
        //     console.log("Graphics: ", graphic);

        //     map.graphics.add(new Graphic(graphic.geometry, new SimpleFillSymbol(

        //       SimpleFillSymbol.STYLE_SOLID,
        //       new SimpleLineSymbol(
        //         SimpleLineSymbol.STYLE_SOLID,
        //         new Color([255, 0, 0]), 3
        //       ),
        //       new Color([125, 125, 125, 0.35])
        //     )))
        //   });
        // });

        function colorPoliticalRegion(value, color) {
          return {
            value: value,
            symbol: {
              type: "simple-fill",
              color: color,
              outline: {
                color: "black",
                width: 3
              }
            }
          };
        }
        var politicalColorRenderer = {
          type: "unique-value",
          field: "winParty",
          defaultSymbol: {
            type: "simple-fill",
            color: "gray"
          },
          uniqueValueInfos: [
            colorPoliticalRegion("Conservative Party of Canada", "blue"),
            colorPoliticalRegion("Liberal Party of Canada", "red"),
            colorPoliticalRegion("New Democratic Party", "orange"),
            colorPoliticalRegion("Green Party of Canada", "green"),
            colorPoliticalRegion("Bloc Québécois", "turquoise")
          ]
        };

        var federalLayer = new FeatureLayer({
          url: "https://services5.arcgis.com/yhL5dRej97QO0Sj3/arcgis/rest/services/Federal_Election_Results_2019/FeatureServer/0",
          // labelingInfo: [federalLayerLabels],
          renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"]
          // popupTemplate: {
          //   title: "<b>{name}</b>",
          //   outFields: ["*"],
          //   content: queryDivisionInformation
          // }
        });

        map.add(federalLayer);

        var provincialBC = new FeatureLayer({
          url: "https://services.arcgis.com/zmLUiqh7X11gGV2d/ArcGIS/rest/services/BC2017/FeatureServer/0",
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{ED_NAME}</b>",
            outFields: ["*"],
            // content: queryDivisionInformation
          },
          visible: false,
          title: "BC"
        });

        var provincialON = new FeatureLayer({
          url: "https://services5.arcgis.com/yhL5dRej97QO0Sj3/arcgis/rest/services/Ontario2018Time/FeatureServer/0",
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{ENGLISH_NA}</b>",
            outFields: ["*"],
            // content: queryDivisionInformation
          },
          visible: false,
          title: "ON"
        });

        var provincialNB = new FeatureLayer({
          url: "https://services5.arcgis.com/yhL5dRej97QO0Sj3/arcgis/rest/services/ElectionResults2018/FeatureServer/0",
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{ElectionResults2018_PED_Name_E}</b>",
            outFields: ["*"],
            // content: queryDivisionInformation
          },
          visible: false,
          title: "NB"
        });

        var provincialSK = new FeatureLayer({
          url: "https://services.arcgis.com/zmLUiqh7X11gGV2d/arcgis/rest/services/Saskatchewan_2016/FeatureServer/0",
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{ElectoralDistrictName}</b>",
            outFields: ["*"],
            // content: queryDivisionInformation
          },
          visible: false,
          title: "SK"
        });

        let provincialLayers = [provincialBC, provincialON, provincialNB, provincialSK];

        provincialLayers.forEach(layer => {
          map.add(layer);
        });

        var pollingStationsLabels = {
          symbol: {
            type: "text",
            color: "#6666A0",
            haloColor: "#000000",
            haloSize: "1px",
            font: {
              size: "20px",
              family: "Noto Sans",
              style: "normal",
              weight: "bold"
            }
          },
          labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "$feature.site_name"
          }
        };

        var pollingStations = new FeatureLayer({
          url: "https://services.arcgis.com/txWDfZ2LIgzmw5Ts/arcgis/rest/services/Federal_Polling_Stations/FeatureServer/0",
          // renderer: pollingStationsRenderer,
          labelingInfo: [pollingStationsLabels],
          visible: false
        });

        map.add(pollingStations);

        // Search widget
        var search = new Search({
          view: view,
          allPlaceholder: "Polling Division or Station",
          sources: [
            {
              layer: federalLayer,
              searchFields: ["name"],
              displayField: "name",
              exactMatch: false,
              outFields: ["name", "provcode"],
              resultGraphicEnabled: true,
              name: "Polling Divisons",
              placeholder: "Example: Thornhill"
            },
            {
              layer: pollingStations,
              searchFields: ["site_name"],
              displayField: "site_name",
              outFields: ["*"],
              name: "Polling Stations",
              placeholder: "Example: Sunrise of Thornhill"
            }
          ]
        });

        view.ui.add(search, "top-right");

        // var pollingStationsRenderer = {
        //   type: "simple",
        //   symbol: {
        //     type: "picture-marker",
        //     url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRRjHnt5ly0y4GQBASsI0cYKvNuU5sjJfESphFPeSYkLcLtTnSAg",
        //     width: "18px",
        //     height: "18px"
        //   }
        // }

        ///////////////////////////////////
        // FILTER OPTION EVENT LISTENERS //
        ///////////////////////////////////

        function clearResults() {
          resultsTable.innerHTML = "";
          view.popup.close();
        }

        function checkProvincial(province) {
          provincialLayers.forEach(layer => {
            if (((<HTMLInputElement>document.getElementById("provincial")).checked) && province == layer.title) {
              layer.visible = true;
              view.goTo(layer.fullExtent);
            } else {
              layer.visible = false;
            }

          });
        }

        var provinces = document.getElementById("provincialSelection");
        provinces.addEventListener("change", function () {
          checkProvincial((<HTMLInputElement>this).value);
        });

        // Retrieve all region type radio buttons
        var regionType = document.getElementsByName("regionType");
        regionType.forEach(element => {
          element.addEventListener("click", function () {
            if ((<HTMLInputElement>element).value == "provincial") {
              provincialLayers.forEach(layer => {
                layer.visible = false;
              });
            }

            checkProvincial((<HTMLInputElement>provinces).value);

            federalLayer.visible = (<HTMLInputElement>element).value == "federal";

            if (federalLayer.visible == true) {
              // Not working?
              view.goTo(federalLayer.fullExtent);
            }
            clearResults();
          });
        });

        // Create a variable referencing the checkbox node
        var pollingLayerToggle = document.getElementById("pollingLayer") as HTMLInputElement;
        pollingLayerToggle.checked = false;

        // Listen to the change event for the checkbox
        pollingLayerToggle.addEventListener("change", function () {
          // When the checkbox is checked (true), set the layer's visibility to true
          pollingStations.visible = pollingLayerToggle.checked;
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
}
