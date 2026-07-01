import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Product } from "./models/product";
import productsData from "./pages/products-grid/products.json";
import { produce} from 'immer'
import { Toaster } from "./services/toaster";

export type EcommerceState = {
  products: Product[];
  category: string;
  wishlistItems: Product[];
};

const initialState: EcommerceState = {
    products: productsData as Product[],
    category: 'All',
    wishlistItems: []
};

export const EcommerceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ category, products, wishlistItems }) => ({
    filteredProducts: computed(() => {
      if (category() === 'All') {
        return products();
      }
      return products().filter(
        (p) => p.category.toLowerCase() === category().toLowerCase()
      );
    }),
    wishlistCount: computed(() => wishlistItems().length)
  })),

  withMethods((store, toaster = inject(Toaster)) => ({
    setCategory(category: string) {
      patchState(store, { category });
    },

     addToWishlist: (product: Product) => {
       const updatedWishlistItems = produce(store.wishlistItems(), (draft) => {
            if (!draft.find(p => p.id === product.id)){
                draft.push(product);
            }
       })

       patchState(store, {wishlistItems: updatedWishlistItems})
       toaster.success('Product added to wishlist');
    },

    removeFromWishlist: (product: Product) => {
        patchState(store, {
            wishlistItems: store.wishlistItems().filter((p) => p.id !== product.id)
        })
        toaster.success('Product removed from wishlist');
    },

    clearWishlist: () => {
      patchState(store, {wishlistItems: []})
    }
  })),

 


);
