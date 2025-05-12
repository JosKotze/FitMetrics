import { Component, type OnInit, inject } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Store } from "@ngrx/store"
import mapboxgl from "mapbox-gl"
import * as polyline from "@mapbox/polyline"
import { ActivityService } from "../../services/activity/activity.service"
import type { ActivityDetails } from "../../api/FitMetricsApi"

interface Split {
  kilometer: number
  pace: string
  heartRate: number | string
  elevation: string
}

@Component({
  selector: "app-map-detail",
  templateUrl: "./map-detail.component.html",
  styleUrls: ["./map-detail.component.scss"],
})
export class MapDetailComponent implements OnInit {
  activityService = inject(ActivityService)
  route = inject(ActivatedRoute)
  store = inject(Store)

  activityId = ""
  userId = ""
  activityDetails: ActivityDetails | undefined

  // Chart data
  paceChartData: any
  paceChartOptions: any
  elevationChartData: any
  elevationChartOptions: any
  hasElevationData = false
  elevationPoints: number[] = []
  distancePoints: number[] = []

  // Splits data
  splits: Split[] = []

  ngOnInit(): void {
    this.activityId = this.route.snapshot.paramMap.get("activityId")!
    this.userId = this.route.snapshot.paramMap.get("userId")!

    this.fetchActivityDetails()
    this.initCharts()
    this.loadMap()


    //console.log("TEST ", this.activityDetails[0].distance)
  }

  fetchActivityDetails(): void {
    this.activityService.getActivityDetailsById(+this.userId, +this.activityId).subscribe({
      next: (activity: ActivityDetails | ActivityDetails[]) => {
        if (Array.isArray(activity)) {
          this.activityDetails = activity[0];
        } else {
          this.activityDetails = activity;
        }
        this.generateMockSplits();
        this.updateChartData();
        console.log("Activity details:", this.activityDetails);
      },
      error: (err) => {
        console.error("Error fetching activity details:", err);
      },
    });
  }

  loadMap(): void {
    const token = localStorage.getItem('accesstoken');
    if (token) {
      // Fetch the map using the access token
      this.activityService.getActivityMap(token, +this.userId, +this.activityId).subscribe({
        next: (mapData) => {
          if (mapData.polyline) {
            this.renderMap(mapData.polyline);
          } else {
            console.warn("Polyline data is missing.");
          }
        },
        error: (err) => {
          console.error("Failed to fetch activity map with access token:", err);
        },
      });
    } else {
      // Handle the case where the access token is null
      console.warn("Access token is null. Attempting to load map from database...");
      this.activityService.getActivityMap(null, +this.userId, +this.activityId).subscribe({
        next: (mapData) => {
          if (mapData.polyline) {
            this.renderMap(mapData.polyline);
          } else {
            console.warn("Polyline data is missing from database.");
          }
        },
        error: (err) => {
          console.error("Failed to fetch activity map from database:", err);
        },
      });
    }
  }

  renderMap(polylineString: string): void {
    const coordinates = polyline.decode(polylineString)
    const coordinatesCount = coordinates.length
    let middleCoordinates = coordinates[Math.floor(coordinatesCount / 2)]
    middleCoordinates = [middleCoordinates[1], middleCoordinates[0]]
    ;(mapboxgl as typeof mapboxgl).accessToken =
      "pk.eyJ1Ijoiam9zc2llYm9zc2llIiwiYSI6ImNtNG14Ymh1dzAyZHAyanM5M2x2YzNmdHoifQ.OascneOX94_7lG8qCBSsOQ"

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v12", // Better for terrain visualization
      center: middleCoordinates,
      zoom: 10,
    })

    map.on("load", () => {
      // Add terrain source
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 20,
      })

      // Set terrain
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1 })

      const swappedCoordinates = coordinates.map((coord) => [coord[1], coord[0]])

      // Create bounds to fit the route
      const bounds = new mapboxgl.LngLatBounds()
      swappedCoordinates.forEach((coord) => bounds.extend(coord as [number, number]))

      // Add start marker
      if (swappedCoordinates.length > 0) {
        new mapboxgl.Marker({ color: "#4CAF50" }).setLngLat(swappedCoordinates[0] as [number, number]).addTo(map)
      }

      // Add finish marker
      if (swappedCoordinates.length > 1) {
        new mapboxgl.Marker({ color: "#F44336" })
          .setLngLat(swappedCoordinates[swappedCoordinates.length - 1] as [number, number])
          .addTo(map)
      }

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: swappedCoordinates,
          },
        },
      })

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#673ab7",
          "line-width": 5,
        },
      })

      // Fit map to the route bounds with padding
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      })

      // Wait for the terrain to load before querying elevations
      map.once("idle", () => {
        this.updateElevationProfile(map, coordinates)
      })
    })
  }

  updateElevationProfile(map: mapboxgl.Map, coordinates: number[][]): void {
    // Sample points along the route (reduce number of points for performance)
    const totalPoints = coordinates.length
    const sampleRate = Math.max(1, Math.floor(totalPoints / 100))
    const sampledCoordinates = coordinates.filter((_, i) => i % sampleRate === 0)

    // Make sure we include the last point
    if (totalPoints > 0 && sampledCoordinates[sampledCoordinates.length - 1] !== coordinates[totalPoints - 1]) {
      sampledCoordinates.push(coordinates[totalPoints - 1])
    }

    // Calculate total distance
    let totalDistance = 0
    this.distancePoints = [0] // Start with 0

    // Get elevations and calculate distances
    this.elevationPoints = []

    for (let i = 0; i < sampledCoordinates.length; i++) {
      const coord = sampledCoordinates[i]

      // Query elevation for this point
      const elevation = map.queryTerrainElevation([coord[1], coord[0]] as [number, number])

      if (elevation !== null) {
        if (elevation !== undefined) {
          this.elevationPoints.push(elevation)
        }

        // Calculate distance from previous point (except for first point)
        if (i > 0) {
          const prevCoord = sampledCoordinates[i - 1]
          const distance = this.calculateDistance(prevCoord[0], prevCoord[1], coord[0], coord[1])
          totalDistance += distance
          this.distancePoints.push(totalDistance)
        }
      }
    }

    // Update the chart with the elevation data
    if (this.elevationPoints.length > 0) {
      this.updateElevationChart()
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula to calculate distance between two points
    const R = 6371 // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  updateElevationChart(): void {
    // Format distance labels (in km)
    const labels = this.distancePoints.map((d) => `${d.toFixed(1)}km`)

    // Update chart data
    this.elevationChartData = {
      labels: labels,
      datasets: [
        {
          label: "Elevation (m)",
          data: this.elevationPoints,
          fill: true,
          backgroundColor: "rgba(103, 58, 183, 0.2)",
          borderColor: "#673ab7",
          tension: 0.4,
        },
      ],
    }

    // Calculate min/max for better visualization
    const minElevation = Math.min(...this.elevationPoints)
    const maxElevation = Math.max(...this.elevationPoints)
    const buffer = Math.max(10, (maxElevation - minElevation) * 0.1) // At least 10m buffer or 10%

    this.elevationChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `Elevation: ${context.raw.toFixed(0)}m`,
            title: (items: any) => `Distance: ${items[0].label}`,
          },
        },
      },
      scales: {
        y: {
          min: Math.max(0, minElevation - buffer),
          max: maxElevation + buffer,
          title: {
            display: true,
            text: "Elevation (m)",
            color: "#94a3b8",
          },
          ticks: {
            color: "#94a3b8",
          },
        },
        x: {
          title: {
            display: true,
            text: "Distance (km)",
            color: "#94a3b8",
          },
          ticks: {
            color: "#94a3b8",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
      },
    }

    // Set flag to show elevation data
    this.hasElevationData = true
  }

  initCharts(): void {
    // Initialize pace chart
    this.paceChartData = {
      labels: ["1km", "2km", "3km", "4km", "5km", "6km", "7km", "8km", "9km", "10km"],
      datasets: [
        {
          label: "Pace (min/km)",
          data: [4.8, 4.9, 5.1, 4.7, 4.8, 5.0, 4.9, 4.8, 4.7, 4.6],
          fill: false,
          borderColor: "#673ab7",
          tension: 0.4,
        },
      ],
    }

    this.paceChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `Pace: ${context.raw.toFixed(2)} min/km`,
          },
        },
      },
      scales: {
        y: {
          reverse: true,
          title: {
            display: true,
            text: "min/km",
            color: "#94a3b8",
          },
          ticks: {
            color: "#94a3b8",
          },
        },
        x: {
          title: {
            display: true,
            text: "Distance (km)",
            color: "#94a3b8",
          },
          ticks: {
            color: "#94a3b8",
          },
        },
      },
    }

    // Initialize elevation chart (placeholder)
    this.elevationChartData = {
      labels: ["0km", "2km", "4km", "6km", "8km", "10km"],
      datasets: [
        {
          label: "Elevation (m)",
          data: [100, 120, 140, 130, 150, 125],
          fill: true,
          backgroundColor: "rgba(103, 58, 183, 0.2)",
          borderColor: "#673ab7",
          tension: 0.4,
        },
      ],
    }

    this.elevationChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    }

    // Set to false initially - will be updated when we have real data
    this.hasElevationData = false
  }

  updateChartData(): void {
    // This would be updated with real data from your activity
    // For now, we're using the mock data initialized above
  }

  generateMockSplits(): void {
    // Refactor this to get real splits from the activity details
    this.splits = Array.from({ length: 10 }, (_, i) => ({
      kilometer: i + 1,
      pace: `${4 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}`,
      heartRate: Math.floor(140 + Math.random() * 40),
      elevation: `+${Math.floor(Math.random() * 20)}m`,
    }))
  }

  formatDistance(distance?: number): string {
    if (!distance) return "0 km"
    // Convert meters to kilometers
    const km = distance / 1000
    return `${km.toFixed(1)} km`
  }

  formatDuration(seconds?: number): string {
    if (!seconds) return "00:00"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  formatPace(seconds?: number, distance?: number): string {
    if (!seconds || !distance || distance === 0) return "0:00"

    // Convert meters to kilometers
    const km = distance / 1000
    // Calculate pace in seconds per kilometer
    const paceSeconds = seconds / km

    // Convert to minutes:seconds format
    const paceMinutes = Math.floor(paceSeconds / 60)
    const paceRemainingSeconds = Math.floor(paceSeconds % 60)

    return `${paceMinutes}:${paceRemainingSeconds.toString().padStart(2, "0")}`
  }

  formatElevation(elevation?: number): string {
    if (!elevation) return "0m"
    return `${Math.round(elevation)}m`
  }

  getActivityTypeIcon(type?: string): string {
    switch (type?.toLowerCase()) {
      case "run":
      case "running":
        return "pi-directions-run"
      case "ride":
      case "cycling":
        return "pi-bicycle"
      case "swim":
      case "swimming":
        return "pi-water"
      case "walk":
      case "walking":
        return "pi-walking"
      default:
        return "pi-flag"
    }
  }
}
