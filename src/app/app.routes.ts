import { Routes } from '@angular/router';

export const routes: Routes = [


    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/Products'
    },
    {
        path: 'Products',
        loadComponent: () => import('./pages/products-grid/products-grid'),
    },
    {
        path: 'Wishlist',
        loadComponent: () => import('./pages/my-wishlist/my-wishlist')
    }
];
