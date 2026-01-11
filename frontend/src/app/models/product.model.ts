export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    image: string | string[]; // Backend returns array, but can be string for compatibility
    category: 'Men' | 'Women' | 'Kids';
    subCategory: 'Topwear' | 'Bottomwear' | 'Winterwear';
    sizes?: string[];
    bestseller: boolean;
    date?: number;
    createdAt?: string;
    updatedAt?: string;
}
