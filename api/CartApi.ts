import { APIRequestContext, expect } from '@playwright/test';

type CartItem = {
    _id: string;
};

type CartResponse = {
    products?: CartItem[];
    count?: number;
    message: string;
};

export class CartApi {

    async removeProductFromCart(
        api: APIRequestContext,
        userId: string,
        productId: string,
        token: string
    ): Promise<void> {

        // Get the user's current cart
        const cartResponse = await api.get(
            `/api/ecom/user/get-cart-products/${userId}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        expect(cartResponse.ok()).toBe(true);

        const cart: CartResponse =
            await cartResponse.json();

        // Check whether the product is in the cart
        const productExists = (cart.products ?? []).some(
            product => product._id === productId
        );

        // Product is not in the cart, so cleanup is complete
        if (!productExists) {
            return;
        }

        // Remove the product from the cart
        const deleteResponse = await api.delete(
            `/api/ecom/user/remove-from-cart/${userId}/${productId}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        expect(deleteResponse.ok()).toBe(true);
    }
}