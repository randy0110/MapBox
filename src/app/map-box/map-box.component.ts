import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
import {GeoJson, FeatureCollection} from '../map';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/light-v10';
  lat = 11.01072186;
  lng = -74.79188962;

  message: string;

  source: any;
  markers: Array<GeoJson>;

  constructor(private mapservice: MapService) {
    

   }

  ngOnInit(): void {
    this.markers = this.mapservice.getMarkers();
    this.initializeMap()
  }

  private initializeMap(){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center:[this.lng, this.lat]
        }) 
      });
    }
    this.buildMap();
  }

  buildMap(){
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [this.lng, this.lat],
      zoom: 13
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('click',(event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat];
      const newMarker = new GeoJson(coordinates, {description: 'pruebas', icon: 'bicycle'});
      this.mapservice.createMarker(newMarker);
      this.markers = this.mapservice.getMarkers();
      
      this.source.setData({
        'type': 'FeatureCollection',
        'features': this.markers
        });

    })

    this.map.on('load',(event) => {
      this.map.addSource('places', {
        'type': 'geojson',
        'data': {
        'type': 'FeatureCollection',
        'features': []
        }
      
      });

      this.source = this.map.getSource('places');

      this.source.setData({
        'type': 'FeatureCollection',
        'features': this.markers
        });
      
      // Add a layer showing the places.
      this.map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
        'icon-image': '{icon}-15',
        'text-field': '{icon}',
        'text-offset': [0,1.5]
        },
        'paint':{
          'text-color': '#f23566'
        }
      });
    });

  }

  flyto(data: GeoJson){
    this.map.flyTo({
      center: [data.geometry.coordinates[0],data.geometry.coordinates[1]] ,
      curve: 1,
      essential: true,
      zoom: 13
    })
  }

  removeMarker(data: GeoJson){
    this.mapservice.removeMarker(data.key);
      this.markers = this.mapservice.getMarkers();
      console.log(data.key);
      console.log(this.markers);
      this.source.setData({
        'type': 'FeatureCollection',
        'features': this.markers
        });
  }

  ShowLayer(layer: string, $event){
    
    var visibility = this.map.getLayoutProperty(layer, 'visibility');
 
    // toggle layer visibility by changing the layout object's visibility property
    if (visibility === 'none') {
      $event.currentTarget.className = 'active';
      this.map.setLayoutProperty(layer, 'visibility', 'visible');
    } else {
      this.map.setLayoutProperty(layer, 'visibility', 'none');
      $event.currentTarget.className = '';      
    }
  }
  

}
