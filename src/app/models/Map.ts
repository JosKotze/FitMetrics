export class Map {
    constructor(
        public id: number, 
        public mapId: string | null,
        public activityId: number, 
        public userId: number,
        public polyline: string | null, 
        public startLatlng: number[] | null, 
        public endLatlng: number[] | null
    ) {}
}
