import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import productsData from './products.json';
import { ProductCard } from "../../components/product-card/product-card";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-grid',
  imports: [CommonModule, ProductCard, MatSidenav, MatSidenavContainer, MatSidenavContent, MatIcon, RouterLink],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.scss',
})
export default class ProductsGrid {

  category = input<string>('All')

  products = signal<Product[]>(productsData);

  

  filteredProducts = computed(() => {

    if(this.category() === 'All') return this.products();
    return this.products().filter(p => p.category === this.category())
  });

  categories = signal<string[]>(['All', ...new Set(this.products().map(p => p.category.charAt(0).toUpperCase() + p.category.slice(1)))])

  // addToCart(product: Product) {
  //   console.log('Added to cart:', product.name);
  // }

  // addToWishlist(product: Product) {
  //   console.log('Added to wishlist:', product.name);
  // }
}
