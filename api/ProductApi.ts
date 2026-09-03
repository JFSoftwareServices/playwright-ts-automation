import { APIRequestContext, expect } from '@playwright/test';

type Product = {
    _id: string;
    productName: string;
    productPrice: number;
};

type ProductsResponse = {
    data: Product[];
    count: number;
    message: string;
};

export class ProductApi {

    async getProductId(
        api: APIRequestContext,
        productName: string,
        token: string
    ): Promise<string> {

        const response = await api.post(
            '/api/ecom/product/get-all-products',
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                data: {
                    productName: '',
                    minPrice: null,
                    maxPrice: null,
                    productCategory: [],
                    productSubCategory: [],
                    productFor: [],
                },
            }
        );

        expect(response.status()).toBe(200);

        const data: ProductsResponse = await response.json();

        const product = data.data.find(
            product => product.productName === productName
        );

        if (!product) {
            throw new Error(
                `Product "${productName}" was not found`
            );
        }

        return product._id;
    }
}