import { Car } from "./types";


type BackendCar = {
  id: string;
  name: string;
  model: string;
  location: string;
  price: string;         
  listingDate: string;
  image: string;         
  status: string;        
};


export const BASE_URL = 'http://localhost:8080';



function normalizeImageUrl(u: string): string {
  if (!u) return '';
  try {
    const url = new URL(u, BASE_URL); 
    return url.toString();
  } catch {
    return u;
  }
}


function mapToUiCar(b: BackendCar): Car {
  return {
    id: Number(b.id),
    model: b.model,               
    location: b.location,         
    listingDate: b.listingDate,   
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
  const r = await fetch(`${BASE_URL}/api/rent/${id}`, { method: 'PUT' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const text = await r.text();
  return { message: text };
}
