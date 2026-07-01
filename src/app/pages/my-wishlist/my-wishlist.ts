import { Component, inject } from '@angular/core';
import { BackButton } from "../../components/back-button/back-button";
import { EcommerceStore } from '../../Ecommerce-Store';
import { ProductCard } from "../../components/product-card/product-card";
import { MatIcon } from "@angular/material/icon";
import { MatAnchor } from "@angular/material/button";
import { EmptyWishlist } from "./empty-wishlist/empty-wishlist";

@Component({
  selector: 'app-my-wishlist',
  imports: [BackButton, ProductCard, MatIcon, MatAnchor, EmptyWishlist],
  templateUrl: './my-wishlist.html',
  styleUrl: './my-wishlist.scss',
})
export default class MyWishlist {
  store = inject(EcommerceStore)
}
