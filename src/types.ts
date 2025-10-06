export type Car = {
  id: number;
  model: string;        // sadece model başlıkta görünecek
  location: string;     // Location: ...
  listingDate: string;  // Listing Date: ...
  imageUrl: string;
  price: number;
  currency: string;
  per: string;
  status: string; // "Available" | "Rented"
};
