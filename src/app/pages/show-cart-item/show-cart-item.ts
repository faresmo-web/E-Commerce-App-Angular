import { Component, computed, inject, input } from '@angular/core';
import { CartItem } from '../../models/cart';
import { QtySelector } from "../../components/qty-selector/qty-selector";
import { EcommerceStore } from '../../Ecommerce-Store';
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-show-cart-item',
  imports: [QtySelector, MatIconButton, MatIcon],
  templateUrl: './show-cart-item.html',
  styleUrl: './show-cart-item.scss',
})
export class ShowCartItem {
  item = input.required<CartItem>()
  store = inject(EcommerceStore)

  total = computed(() => (this.item().product.price * this.item().quantity).toFixed(2))
}
