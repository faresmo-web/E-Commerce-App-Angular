import { Component, inject, input } from '@angular/core';
import { EcommerceStore } from '../../Ecommerce-Store';

@Component({
  selector: 'app-view-product-detail',
  imports: [],
  templateUrl: './view-product-detail.html',
  styleUrl: './view-product-detail.scss',
})
export default class ViewProductDetail {
  productId = input.required<number>();

  store = inject(EcommerceStore)

  constructor() {
    this.store.setProductId(this.productId);
  }

}
