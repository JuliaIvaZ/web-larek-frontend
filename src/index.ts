import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ApiClient } from './components/base/api';
import { ProductModel } from './types/models';



async function main() {
    console.log('Hello world');

    const apiClient = new ApiClient(CDN_URL, API_URL);
    const productModel = new ProductModel(apiClient);

    try {
        console.log('Загрузка товаров с сервера');
        await productModel.loadProducts();

        const products = productModel.getProducts();
        console.log('Загружены товары: ', products);

        if (products.length > 0) {
            const firstProduct = products[0];
            console.log('Первый товар: ', firstProduct);

            productModel.setCurrentProduct(firstProduct.id);
            console.log('Текущий товар: ', productModel.getProductById(firstProduct.id));
        }
    }
    catch (error) {
        console.log('Произошла ошибка при загрузке товаров: ', error);
    }
};

main();