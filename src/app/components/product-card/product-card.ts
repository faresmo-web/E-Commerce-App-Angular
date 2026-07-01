import { Component, input } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, MatIcon],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  getStars(rating: number): number[] {
    return [1, 2, 3, 4, 5];
  }

  product = input.required<Product>();
  idx = input<number>(999);
}
