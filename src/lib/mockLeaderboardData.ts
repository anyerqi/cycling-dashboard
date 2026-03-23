export interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  totalDistance: number; // km
  totalElevation: number; // meters
  totalActivities: number;
  avgSpeed: number; // km/h
}

export const mockLeaderboardData: LeaderboardUser[] = [
  {
    rank: 1,
    username: "AlexRider",
    avatar: "🚴",
    totalDistance: 1250.5,
    totalElevation: 18500,
    totalActivities: 142,
    avgSpeed: 28.3,
  },
  {
    rank: 2,
    username: "CyclingPro",
    avatar: "🏆",
    totalDistance: 1180.2,
    totalElevation: 16200,
    totalActivities: 138,
    avgSpeed: 27.8,
  },
  {
    rank: 3,
    username: "MountainKing",
    avatar: "⛰️",
    totalDistance: 1050.8,
    totalElevation: 22000,
    totalActivities: 115,
    avgSpeed: 25.5,
  },
  {
    rank: 4,
    username: "SpeedDemon",
    avatar: "⚡",
    totalDistance: 980.3,
    totalElevation: 12000,
    totalActivities: 156,
    avgSpeed: 30.2,
  },
  {
    rank: 5,
    username: "EnduranceElite",
    avatar: "💪",
    totalDistance: 920.7,
    totalElevation: 14500,
    totalActivities: 98,
    avgSpeed: 26.1,
  },
  {
    rank: 6,
    username: "ClimbingQueen",
    avatar: "👑",
    totalDistance: 850.4,
    totalElevation: 19800,
    totalActivities: 87,
    avgSpeed: 24.8,
  },
  {
    rank: 7,
    username: "WeekendWarrior",
    avatar: "🔥",
    totalDistance: 780.1,
    totalElevation: 10500,
    totalActivities: 72,
    avgSpeed: 25.9,
  },
  {
    rank: 8,
    username: "SprintMaster",
    avatar: "🎯",
    totalDistance: 720.6,
    totalElevation: 8900,
    totalActivities: 125,
    avgSpeed: 29.5,
  },
  {
    rank: 9,
    username: "TourDeForce",
    avatar: "🌟",
    totalDistance: 680.2,
    totalElevation: 11200,
    totalActivities: 65,
    avgSpeed: 24.2,
  },
  {
    rank: 10,
    username: "PelotonPro",
    avatar: "🚴‍♀️",
    totalDistance: 650.8,
    totalElevation: 9800,
    totalActivities: 82,
    avgSpeed: 26.7,
  },
];
