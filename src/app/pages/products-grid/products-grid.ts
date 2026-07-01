import { Component, computed, inject, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from "../../components/product-card/product-card";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from "@angular/router";
import { EcommerceStore } from '../../Ecommerce-Store';
import { ToggleWishlistButton } from "../../components/toggle-wishlist-button/toggle-wishlist-button";

@Component({
  selector: 'app-products-grid',
  imports: [CommonModule, ProductCard, MatSidenav, MatSidenavContainer, MatSidenavContent, MatIcon, RouterLink, ToggleWishlistButton],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.scss',
})
export default class ProductsGrid {

  category = input<string>('All');

  store = inject(EcommerceStore);

  filteredProducts = this.store.filteredProducts;

  categories = computed(() => [
    'All',
    ...new Set(this.store.products().map(p => p.category.charAt(0).toUpperCase() + p.category.slice(1)))
  ]);

  constructor() {
    effect(() => {
      this.store.setCategory(this.category());
    });
  }
}
