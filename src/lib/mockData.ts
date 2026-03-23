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

// Mock track data for elevation profile (Mountain Pass Challenge - 67 points alpine stage)
export const mockTrackData = [
  { distance: 0, elevation: 245 },
  { distance: 1.2, elevation: 258 },
  { distance: 2.5, elevation: 285 },
  { distance: 4.1, elevation: 320 },
  { distance: 5.8, elevation: 365 },
  { distance: 7.3, elevation: 420 },
  { distance: 9.0, elevation: 485 },
  { distance: 10.5, elevation: 550 },
  { distance: 12.2, elevation: 620 },
  { distance: 14.0, elevation: 695 },
  { distance: 15.8, elevation: 775 },
  { distance: 17.5, elevation: 850 },
  { distance: 19.2, elevation: 920 },
  { distance: 21.0, elevation: 985 },
  { distance: 22.8, elevation: 1045 },
  { distance: 24.5, elevation: 1095 },
  { distance: 26.3, elevation: 1135 },
  { distance: 28.0, elevation: 1165 },
  { distance: 29.8, elevation: 1185 },
  { distance: 31.5, elevation: 1195 },
  { distance: 33.2, elevation: 1190 },
  { distance: 35.0, elevation: 1170 },
  { distance: 36.8, elevation: 1140 },
  { distance: 38.5, elevation: 1100 },
  { distance: 40.2, elevation: 1055 },
  { distance: 42.0, elevation: 1005 },
  { distance: 43.8, elevation: 950 },
  { distance: 45.5, elevation: 890 },
  { distance: 47.2, elevation: 825 },
  { distance: 49.0, elevation: 755 },
  { distance: 50.8, elevation: 680 },
  { distance: 52.5, elevation: 600 },
  { distance: 54.2, elevation: 515 },
  { distance: 56.0, elevation: 425 },
  { distance: 57.8, elevation: 330 },
  { distance: 59.5, elevation: 235 },
  { distance: 61.2, elevation: 145 },
  { distance: 63.0, elevation: 65 },
  { distance: 65.1, elevation: 15 },
];
