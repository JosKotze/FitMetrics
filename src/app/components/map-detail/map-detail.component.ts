import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.scss']
})
export class MapDetailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.loadMap();
  }

  loadMap() {
    //var polyline = require('@mapbox/polyline');

    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1Ijoiam9zc2llYm9zc2llIiwiYSI6ImNtM2hyZHd4bzBnOXoyanF4andzeHJxZHQifQ.znOhK78YE1m3dzEVSYk7eQ';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.486052, 37.830348],
      zoom: 14
    });

    map.on('load', () => {
      // Decode the polyline to get coordinates
      const polylineString = 'pylsEkekyBLKRc@Z{@ZqALWJCx@FLCFWLcADoANaBPq@NUTS^MXEZ@b@JpA`ANHH?FErAwBv@{BDUCIGGsDqA_Ae@u@WWOIOK]?q@VuEDmBDs@BiAL{DEc@KIMEy@?wAK}@AGCEKM_BaA}DiAgEMQUS[OoA}@IEOCOBSFqB|@q@`@SVy@rAyAdDaAnCYfAMz@AZ?fCDt@JZLRzBjBFPCJOTm@j@m@t@OJKCGG}A}Aa@Ii@Ce@WVDj@TNJFLAPqA|BoArBcCxIOx@@ZHRPLx@\\FL@LCVIPIb@_B~Fw@zCBPDDdA`@^n@BR@RGp@w@dDKLEBIAWGsAm@KAIFkAfEo@dB_@|@w@vA]h@iAxAu@fAeDhEEPFRjAvAHN@PGf@S`@gB|BUd@U\\wChDMRITGpA\\`ADx@DLXRp@T`@?THFDHRFDV@z@EzBAlDG|DAbCE^Fh@ZbAv@rCnBxElDbBhA~@f@RPp@`@dBjApAz@ZXrA~@dC|A`@\\t@f@\\LlBNt@JzALFADGBOCuIB_@H]HMRQvCyA|CmB\\YP]l@yBHm@?eAHWPMtAGZMHOb@sATg@ROv@GPKLUn@cBTe@HMNIlAOH?FDF\\Hr@PbD?`@H`CBlBDrA@|@FbA?RDfACDEOEi@QwHIeA@gAKwCaAaLOqAYcD?UHa@KQ]_@Ym@CO?UZcABa@OkFK_BIu@Ok@M_@qD_Ic@kA[_CUmEw@gGKeAImAEYGGYOgA_@oAm@gBm@cDuAOIU]G]LoCCKEEa@Cm@BOCeACgBBMBEJBPZhAF\\A^GPaAd@_@LuCzAUVq@b@W^k@dAi@pAKd@?RJLl@Rx@j@f@Rj@b@tFdDVXHN@H'; // truncated for brevity
      const coordinates = polyline.decode(polylineString);

      // Add the polyline as a GeoJSON source
      map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': coordinates
          }
        }
      });

      // Add a layer to display the route
      map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#888',
          'line-width': 8
        }
      });
    });
  }
  


  // loadMap(): void {
  //   const parameters = {
  //     center: new google.maps.LatLng(53, -6),
  //     zoom: 8,
  //     mapTypeId: google.maps.MapTypeId.TERRAIN,
  //     disableDefaultUI: true,
  //   };

  //   const map = new google.maps.Map(document.getElementById("sample") as HTMLElement, parameters);

  //   const tour = new google.maps.Polyline({
  //     path: [
  //       new google.maps.LatLng(-53, -6),
  //       new google.maps.LatLng(-53.6, -6.3),
  //       new google.maps.LatLng(-53.6, -6.8),
  //     ],
  //     strokeColor: "#FF0000",
  //     strokeOpacity: 0.6,
  //     strokeWeight: 2,
  //   });

  //   tour.setMap(map);
  // }
}