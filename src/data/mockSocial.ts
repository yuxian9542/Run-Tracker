export interface User {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  territory: number;
  area?: string;
  isFriend?: boolean;
  rankChange?: number;
  territoryChange?: number;
  sharedTerritory?: number;
  lastCrossover?: {
    time: string;
    location: string;
  };
  lastChatted?: string;
}

export interface SocialPost {
  id: string;
  user: User;
  type: 'regular' | 'achievement';
  timestamp: string;
  location?: string;
  territory?: number;
  caption?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  achievementDetails?: {
    title: string;
    description: string;
    icon: string;
    iconBg: string;
  };
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rank: 1,
    territory: 52800,
    area: 'New York, NY',
    rankChange: 0,
    territoryChange: 1850,
  },
  {
    id: '2',
    name: 'Alex Kim',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rank: 2,
    territory: 48500,
    area: 'Brooklyn, NY',
    rankChange: 1,
    territoryChange: 2100,
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rank: 3,
    territory: 45200,
    area: 'Manhattan, NY',
    rankChange: -1,
    territoryChange: 920,
  },
  {
    id: '4',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rank: 4,
    territory: 42800,
    area: 'Queens, NY',
    rankChange: 2,
    territoryChange: 1650,
    isFriend: true,
  },
  {
    id: '5',
    name: 'Olivia Brown',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    rank: 5,
    territory: 39500,
    area: 'Bronx, NY',
    rankChange: 0,
    territoryChange: 780,
  },
  {
    id: '6',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    rank: 6,
    territory: 37200,
    area: 'Staten Island, NY',
    rankChange: 1,
    territoryChange: 1420,
    isFriend: true,
  },
  {
    id: '7',
    name: 'Sophia Martinez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    rank: 7,
    territory: 35600,
    area: 'New York, NY',
    rankChange: -2,
    territoryChange: -340,
  },
];

export const mockFriends: User[] = [
  {
    id: '4',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rank: 4,
    territory: 42800,
    area: 'Queens, NY',
    rankChange: 2,
    territoryChange: 1650,
    isFriend: true,
    sharedTerritory: 3420,
    lastCrossover: {
      time: '2025-10-31T08:30:00',
      location: 'Central Park',
    },
    lastChatted: '2025-10-31T09:15:00',
  },
  {
    id: '6',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    rank: 6,
    territory: 37200,
    area: 'Staten Island, NY',
    rankChange: 1,
    territoryChange: 1420,
    isFriend: true,
    sharedTerritory: 2890,
    lastCrossover: {
      time: '2025-10-30T07:20:00',
      location: 'Brooklyn Bridge',
    },
    lastChatted: '2025-10-30T18:45:00',
  },
];

export const mockPosts: SocialPost[] = [
  {
    id: 'p1',
    user: mockUsers[0],
    type: 'regular',
    timestamp: '2025-10-28T08:30:00',
    location: 'Central Park, NY',
    territory: 2850,
    caption: 'Beautiful morning run through Central Park! 🌅',
    imageUrl: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=400&h=300&fit=crop',
    likes: 42,
    comments: 8,
  },
  {
    id: 'p2',
    user: mockUsers[1],
    type: 'achievement',
    timestamp: '2025-10-28T07:15:00',
    likes: 89,
    comments: 15,
    achievementDetails: {
      title: '10k Territory',
      description: 'Covered 10,000 square feet',
      icon: '🏆',
      iconBg: 'bg-yellow-500',
    },
  },
];

