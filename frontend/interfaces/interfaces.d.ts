export interface Recipe {
    id: number;
    title: string;
    ingredients: string[];
    instructions: string;
    total_time: number;
    yields: string;
    image: string;
    nutrition: number[];
    rating: number;
    diet: string;
}
