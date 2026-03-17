export interface TrackPoint {
  distance: number; // km from start
  elevation: number; // meters above sea level
  lat?: number;
  lng?: number;
}

// Realistic elevation profile for "Mountain Pass Challenge"
// A 65.1km alpine stage with ~1450m total elevation gain
export const mockTrackData: TrackPoint[] = [
  { distance: 0, elevation: 280 },
  { distance: 1, elevation: 275 },
  { distance: 2, elevation: 265 },
  { distance: 3, elevation: 270 },
  { distance: 4, elevation: 258 },
  { distance: 5, elevation: 252 },
  { distance: 6, elevation: 245 },
  { distance: 7, elevation: 238 },
  { distance: 8, elevation: 228 },
  { distance: 9, elevation: 218 },
  { distance: 10, elevation: 210 },
  { distance: 11, elevation: 205 },
  { distance: 12, elevation: 200 },
  { distance: 13, elevation: 194 },
  { distance: 14, elevation: 188 },
  { distance: 15, elevation: 182 },
  { distance: 16, elevation: 178 },
  { distance: 17, elevation: 174 },
  { distance: 18, elevation: 172 },
  { distance: 19, elevation: 185 },
  { distance: 20, elevation: 212 },
  { distance: 21, elevation: 252 },
  { distance: 22, elevation: 300 },
  { distance: 23, elevation: 358 },
  { distance: 24, elevation: 425 },
  { distance: 25, elevation: 498 },
  { distance: 26, elevation: 578 },
  { distance: 27, elevation: 660 },
  { distance: 28, elevation: 748 },
  { distance: 29, elevation: 838 },
  { distance: 30, elevation: 928 },
  { distance: 31, elevation: 1015 },
  { distance: 32, elevation: 1098 },
  { distance: 33, elevation: 1175 },
  { distance: 34, elevation: 1245 },
  { distance: 35, elevation: 1310 },
  { distance: 36, elevation: 1368 },
  { distance: 37, elevation: 1418 },
  { distance: 38, elevation: 1460 },
  { distance: 39, elevation: 1495 },
  { distance: 40, elevation: 1522 },
  { distance: 41, elevation: 1540 },
  { distance: 42, elevation: 1550 },
  { distance: 43, elevation: 1555 },
  { distance: 44, elevation: 1548 },
  { distance: 45, elevation: 1532 },
  { distance: 46, elevation: 1510 },
  { distance: 47, elevation: 1484 },
  { distance: 48, elevation: 1452 },
  { distance: 49, elevation: 1418 },
  { distance: 50, elevation: 1382 },
  { distance: 51, elevation: 1348 },
  { distance: 52, elevation: 1318 },
  { distance: 53, elevation: 1292 },
  { distance: 54, elevation: 1272 },
  { distance: 55, elevation: 1260 },
  { distance: 56, elevation: 1255 },
  { distance: 57, elevation: 1252 },
  { distance: 58, elevation: 1258 },
  { distance: 59, elevation: 1268 },
  { distance: 60, elevation: 1278 },
  { distance: 61, elevation: 1286 },
  { distance: 62, elevation: 1294 },
  { distance: 63, elevation: 1302 },
  { distance: 64, elevation: 1310 },
  { distance: 65, elevation: 1316 },
  { distance: 65.1, elevation: 1318 },
];

export interface Activity {
  id: string;
  date: string;
  routeName: string;
  distance: number; // km
  duration: string; // hh:mm:ss
  elevation: number; // meters
}

export const mockActivities: Activity[] = [
  {
    id: "1",
    date: "2026-03-15",
    routeName: "Morning Hill Climb",
    distance: 42.3,
    duration: "1:45:22",
    elevation: 820,
  },
  {
    id: "2",
    date: "2026-03-12",
    routeName: "Riverside Loop",
    distance: 28.7,
    duration: "1:10:45",
    elevation: 215,
  },
  {
    id: "3",
    date: "2026-03-10",
    routeName: "Mountain Pass Challenge",
    distance: 65.1,
    duration: "3:02:18",
    elevation: 1450,
  },
  {
    id: "4",
    date: "2026-03-07",
    routeName: "City Park Cruise",
    distance: 18.5,
    duration: "0:44:30",
    elevation: 85,
  },
  {
    id: "5",
    date: "2026-03-03",
    routeName: "Coastal Road Sprint",
    distance: 50.2,
    duration: "2:05:10",
    elevation: 340,
  },
];

export const monthlySummary = {
  totalDistance: 204.8, // km
  totalElevation: 2910, // meters
  avgSpeed: 24.6, // km/h
};
