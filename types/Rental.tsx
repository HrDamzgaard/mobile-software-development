export type Rental = {
    id: string;
    carId: string;
    userId: string;
    rentalDate: string;
    returnDate: string;
    totalPrice: number;
    
    // Snapshot of car details at the time of rental
    image: string;
    name: string;
    model: string;
};
