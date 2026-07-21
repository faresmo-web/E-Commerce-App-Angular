import { Routes } from '@angular/router';

export const routes: Routes = [


    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/products/All'
    },
    {
        path: 'products/:category',
        loadComponent: () => import('./pages/products-grid/products-grid'),
    },
    {
        path: 'product/:productId',
        loadComponent: () => import('./pages/view-product-detail/view-product-detail'),
    },
    {
        path: 'Wishlist',
        loadComponent: () => import('./pages/my-wishlist/my-wishlist')
    },
    {
        path: 'Checkout',
        loadComponent: () => import('./pages/checkout/checkout')
    },
    {
        path: 'OrderSuccess',
        loadComponent: () => import('./pages/order-success/order-success')
    },
    {
        path: 'Cart',
        loadComponent: () => import('./pages/view-cart/view-cart')
    },


];
