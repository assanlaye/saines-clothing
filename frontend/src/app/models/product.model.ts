export interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: 'Men' | 'Women' | 'Kids';
    subCategory: 'Topwear' | 'Bottomwear' | 'Winterwear';
    bestseller: boolean;
    createdAt?: string;
    updatedAt?: string;
}
