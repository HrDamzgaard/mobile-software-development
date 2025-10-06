// frontend/lib/api.ts
// frontend/types.ts

import { Car } from "./types";


type BackendCar = {
  id: string;
  name: string;
  model: string;
  location: string;
  price: string;         // backend string döndürüyor
  listingDate: string;
  image: string;         // ör: http://192.168.1.22:8080/images/car1.png
  status: string;        // "Available" | "Rented"
};


export const BASE_URL = 'http://localhost:8080';


/** Görsel URL’lerini normalize et */
function normalizeImageUrl(u: string): string {
  if (!u) return '';
  try {
    const url = new URL(u, BASE_URL); // relative gelirse tamamlar
    return url.toString();
  } catch {
    return u;
  }
}

/** Backend -> UI tipi adaptörü */
function mapToUiCar(b: BackendCar): Car {
  return {
    id: Number(b.id),
    model: b.model,               // başlıkta sadece model
    location: b.location,         // Location: ...
    listingDate: b.listingDate,   // Listing Date: ...
    imageUrl: normalizeImageUrl(b.image),
    price: Number(b.price),
    currency: 'DKK',
    per: 'day',
    status: b.status,
  };
}

async function fetchCarsRaw(): Promise<BackendCar[]> {
  const r = await fetch(`${BASE_URL}/api/cars`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function fetchCar(id: number): Promise<Car> {
  const list = await fetchCarsRaw();
  const found = list.find(c => c.id === String(id));
  if (!found) throw new Error('Car not found');
  return mapToUiCar(found);
}

export async function rentCar(id: number): Promise<{ message: string }> {
  // Spring Boot PUT ve düz metin döndürüyor
  const r = await fetch(`${BASE_URL}/api/rent/${id}`, { method: 'PUT' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const text = await r.text();
  return { message: text };
}
