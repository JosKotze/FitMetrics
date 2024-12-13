export interface Map {
    id: number;
    mapId: string | null;
    activityId: number;
    userId: number;
    polyline: string;
    startLatlng: number[];
    endLatlng: number[];  
  }
  