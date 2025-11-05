export interface PredictionData {
  weeks: number;
  label: string;
  weight: string;
  bodyFat: string;
  image: string;
}

export const progressionData: PredictionData[] = [
  {
    weeks: 0,
    label: 'Current',
    weight: '72 kg',
    bodyFat: '22%',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop',
  },
  {
    weeks: 2,
    label: '2 Weeks',
    weight: '71 kg',
    bodyFat: '20%',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
  },
  {
    weeks: 4,
    label: '4 Weeks',
    weight: '70 kg',
    bodyFat: '18%',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=600&fit=crop',
  },
  {
    weeks: 8,
    label: '8 Weeks',
    weight: '68 kg',
    bodyFat: '15%',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop',
  },
  {
    weeks: 12,
    label: '12 Weeks',
    weight: '66 kg',
    bodyFat: '12%',
    image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=600&fit=crop',
  },
];

export const getAIInsight = (weeks: number): string => {
  const insights: Record<number, string> = {
    0: "This is your current baseline at 22% body fat. You're starting from a healthy foundation with good running consistency.",
    2: "At 20% body fat, you'll notice improved energy levels and better running performance.",
    4: "Reaching 18% body fat means visible abs are starting to show.",
    8: "At 15% body fat, clear muscle definition emerges across your entire physique.",
    12: "Achieving 12% body fat puts you in athletic territory reserved for competitive runners.",
  };
  return insights[weeks] || insights[0];
};

