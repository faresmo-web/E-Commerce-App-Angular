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
        path: 'Wishlist',
        loadComponent: () => import('./pages/my-wishlist/my-wishlist')
    }
];
