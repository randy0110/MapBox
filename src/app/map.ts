import * as mapboxgl from 'mapbox-gl';

export interface IGeometry{
    type: string;
    coordinates: number[];
}

export interface IGeoJsom{
  type: string;
  geometry: IGeometry;
  properties?: any;
  key?: number;
}

export class GeoJson  implements IGeoJsom{
  type: 'Feature';
  geometry: IGeometry;
  key?: number;
  constructor(coordinates, public properties){
    this.type = 'Feature';
    this.geometry = {
      type: 'Point',
      coordinates: coordinates
    };
    properties = properties;
  }
}

export class FeatureCollection{
  type:'FeatureCollection'
  constructor(public features: Array<GeoJson>){

  }
}