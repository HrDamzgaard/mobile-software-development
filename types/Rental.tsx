export type Rental = {
    id: string;
    carId: string;
    userId: string;
    rentalDate: string;
    returnDate: string;
    // Snapshot of car details at the time of rental
    imageUrl: string;
    name: string;
    model: string;
    totalcost: number;
    days: number;

};
