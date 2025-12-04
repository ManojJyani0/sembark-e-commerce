import type { Review } from "~/types";

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://readymadeui.com/team-2.webp",
    rating: 4,
    date: "2 months ago",
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    verifiedPurchase: true,
    helpful: 24
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "1 week ago",
    comment: "Excellent product! The quality exceeded my expectations. Very comfortable and durable. Will definitely buy again.",
    verifiedPurchase: true,
    helpful: 42
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 3,
    date: "3 weeks ago",
    comment: "Good product overall but the color is slightly different from the pictures. Still decent for the price.",
    verifiedPurchase: true,
    helpful: 8
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "1 month ago",
    comment: "Perfect for everyday use. Lightweight and spacious enough for my laptop and books. Would recommend!",
    verifiedPurchase: true,
    helpful: 31
  },
  {
    id: 5,
    name: "Robert Brown",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 2,
    date: "2 weeks ago",
    comment: "The zipper broke after just 2 weeks of use. Not as durable as advertised. Disappointed with the quality.",
    verifiedPurchase: true,
    helpful: 15
  },
  {
    id: 6,
    name: "Lisa Rodriguez",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "3 days ago",
    comment: "Absolutely love this backpack! Perfect for college. Fits my 15-inch laptop perfectly and looks stylish.",
    verifiedPurchase: true,
    helpful: 56
  },
  {
    id: 7,
    name: "David Miller",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "4 months ago",
    comment: "Great backpack for hiking trips. Water-resistant material works well. Could use more pockets though.",
    verifiedPurchase: true,
    helpful: 19
  },
  {
    id: 8,
    name: "Jennifer Lee",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    rating: 3,
    date: "1 month ago",
    comment: "It's okay for the price. The straps could be more padded for comfort during long wear.",
    verifiedPurchase: true,
    helpful: 7
  },
  {
    id: 9,
    name: "Thomas Anderson",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2 weeks ago",
    comment: "Best backpack I've owned! Perfect size for work commute. The laptop compartment is well padded.",
    verifiedPurchase: true,
    helpful: 38
  },
  {
    id: 10,
    name: "Amanda Taylor",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "3 months ago",
    comment: "Very durable and well-made. Has held up well through daily use. The color hasn't faded at all.",
    verifiedPurchase: true,
    helpful: 22
  },
  {
    id: 11,
    name: "Kevin Martinez",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
    rating: 1,
    date: "5 days ago",
    comment: "Poor quality. Stitching came undone after just a few uses. Would not recommend.",
    verifiedPurchase: true,
    helpful: 12
  },
  {
    id: 12,
    name: "Nicole Garcia",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "1 week ago",
    comment: "Perfect for travel! Fits under airplane seats easily and has so many compartments.",
    verifiedPurchase: true,
    helpful: 47
  },
  {
    id: 13,
    name: "Daniel White",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "2 months ago",
    comment: "Good value for money. Comfortable to wear and looks professional for office use.",
    verifiedPurchase: true,
    helpful: 18
  },
  {
    id: 14,
    name: "Sophia Davis",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face",
    rating: 3,
    date: "3 weeks ago",
    comment: "Decent backpack but arrived with a small scratch. Customer service was helpful though.",
    verifiedPurchase: true,
    helpful: 9
  },
  {
    id: 15,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "1 month ago",
    comment: "Exceeded expectations! Perfect for photography gear. The separate compartments protect my equipment well.",
    verifiedPurchase: true,
    helpful: 33
  },
  {
    id: 16,
    name: "Olivia Thompson",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "2 weeks ago",
    comment: "Great for school use. Fits textbooks and laptop comfortably. My daughter loves it.",
    verifiedPurchase: true,
    helpful: 25
  },
  {
    id: 17,
    name: "Christopher Hall",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    rating: 2,
    date: "3 months ago",
    comment: "The material feels cheap and the straps are uncomfortable for long periods.",
    verifiedPurchase: true,
    helpful: 14
  },
  {
    id: 18,
    name: "Megan Clark",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "4 days ago",
    comment: "Absolutely perfect! The perfect size, comfortable, and looks great. Will buy another as a gift.",
    verifiedPurchase: true,
    helpful: 51
  },
  {
    id: 19,
    name: "William Lewis",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "1 week ago",
    comment: "Good quality construction. Has held up well through daily commute. Would recommend for professionals.",
    verifiedPurchase: true,
    helpful: 20
  },
  {
    id: 20,
    name: "Jessica Walker",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    rating: 3,
    date: "2 months ago",
    comment: "It's okay for the price but not the most comfortable. The back padding could be better.",
    verifiedPurchase: true,
    helpful: 6
  }
];

export function getRandomElements<T>(array: T[], count: number = 5): T[] {
  if (array.length <= count) return [...array];
  
  // Create a copy of the array
  const shuffled = [...array];
  const result: T[] = [];
  
  // Fisher-Yates shuffle algorithm (partial shuffle)
  for (let i = 0; i < count; i++) {
    // Pick a random index between i and array length - 1
    const randomIndex = i + Math.floor(Math.random() * (shuffled.length - i));
    
    // Swap elements
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    
    // Add to result
    result.push(shuffled[i]);
  }
  
  return result;
}

export function getRandomReviews(count: number = 5): Review[] {
  return getRandomElements<Review>(DEFAULT_REVIEWS, count);
}