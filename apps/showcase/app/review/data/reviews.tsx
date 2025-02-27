export type Review = {
  id: string; // Đổi từ number sang string
  image: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  userLogin?: string; // Nếu có
  productId?: number; // Nếu có
};

// Các hàm khác như sortReviews, formatDate giữ nguyên
export function sortReviews(reviews: Review[], sortBy: "date" | "rating"): Review[] {
  return reviews.sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.rating - a.rating;
  });
}

export function formatSimpleDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

  
  // Sample reviews data
  export let reviews: Review[] = [
    {
      id: "1",
      image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20241128/75e5b9e1-f7b2-4579-b641-933f183102ab.jpg",
      name: "Bengfort Shelli",
      rating: 5,
      text: "Absolutely beautiful. Got it framed and hung for everyone to see. I love it !!!",
      date: "2025-02-20 09:23:00",
      userLogin: "bengfort.shelli"
    },
    {
      id: "2",
      image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20241127/0d6aa033-a7a2-4c3e-a7cd-5d1775fa65fc.jpg",
      name: "Rios Nidya D",
      rating: 5,
      text: "This item was purchased as a Christmas gift for my daughter -in-law, son and family! Their names start with the letter 'A'. Loved...",
      date: "2025-02-19 15:30:00",
      userLogin: "rios.nidya"
    },
    {
      id: "3",
      image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20241123/839a4215-23ea-4d48-8772-f9a46a3503cc.jpg",
      name: "Athorn Carolynn",
      rating: 4,
      text: "Absolutely lovely...exactly as I ordered.would definitely recommend",
      date: "2025-02-18 11:45:00",
      userLogin: "athorn.carolynn"
    },
    {
      id: "4",
      image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20241122/e4ae1b23-3564-4f62-b55a-eb21080ab978.jpg",
      name: "Curnutte Kelly",
      rating: 5,
      text: "Paps will love this gift on Christmas Day.",
      date: "2025-02-17 14:20:00",
      userLogin: "curnutte.kelly"
    },
    {
      id: "5",
      image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20240930/9678e95b-3b7f-470c-8e39-2f5ac556214a.jpg",
      name: "John Smith",
      rating: 5,
      text: "Perfect gift for the family!",
      date: "2025-02-16 16:15:00",
      userLogin: "john.smith"
    }
  ]
  
  // Function to add a new review
  export const addReview = (newReview: Omit<Review, 'id'>) => {
    const review = {
      id: String(Math.max(...reviews.map(r => Number(r.id))) + 1),
      ...newReview
    }
    reviews.unshift(review)
    return review
  }
  
  // Function to format date
  export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  // Function to get current UTC datetime
  export const getCurrentUTCDateTime = () => {
    const now = new Date()
    const utcYear = now.getUTCFullYear()
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0')
    const utcDay = String(now.getUTCDate()).padStart(2, '0')
    const utcHours = String(now.getUTCHours()).padStart(2, '0')
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0')
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0')
    
    return `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}`
  }
  
