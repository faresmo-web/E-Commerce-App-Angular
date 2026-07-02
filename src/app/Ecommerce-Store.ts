import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Product } from "./models/product";
import productsData from "./pages/products-grid/products.json";
import { produce} from 'immer'
import { Toaster } from "./services/toaster";
import { CartItem } from "./models/cart";

export type EcommerceState = {
  products: Product[];
  category: string;
  wishlistItems: Product[];
  cartItems: CartItem[];
};

const initialState: EcommerceState = {
    products: productsData as Product[],
    category: 'All',
    wishlistItems: [],
    cartItems: []
};

export const EcommerceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ category, products, wishlistItems, cartItems }) => ({
    filteredProducts: computed(() => {
      if (category() === 'All') {
        return products();
      }
      return products().filter(
        (p) => p.category.toLowerCase() === category().toLowerCase()
      );
    }),
    wishlistCount: computed(() => wishlistItems().length),
    cartCount: computed(() => cartItems().reduce((acc, item) => acc + item.quantity, 0)),
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
    },

    addToCart:(product: Product, quantity = 1) => {
      const existingItemIndex = store.cartItems().findIndex(i => i.product.id === product.id);

      const updatedCartItems = produce(store.cartItems(), (draft) => {
        if(existingItemIndex !== -1){
          draft[existingItemIndex].quantity += quantity;
          return
        }
        draft.push({product, quantity})
      })

      patchState(store, {cartItems: updatedCartItems})
      toaster.success(existingItemIndex !== -1 ? 'Product Added Again' : 'Product Added to the cart!');
    },

    setItemQuantity(params: {productId: number, quantity: number}) {
      const index = store.cartItems().findIndex(c => c.product.id === params.productId);

      const updated = produce(store.cartItems(), (draft) => {
        draft[index].quantity = params.quantity
      })
      patchState(store, {cartItems: updated})
    },

    addAllWishlistToCart: () => {
      const updatedCartItems = produce(store.cartItems(), (draft) => {
        store.wishlistItems().forEach(p => {
          if(!draft.find(c => c.product.id === p.id)) {
            draft.push({product: p, quantity: 1})
          }
        })
      })

      patchState(store, {cartItems: updatedCartItems, wishlistItems: []})
    },


    moveToWishlist: (product: Product) => {
      const updatedCartItems = store.cartItems().filter((p => p.product.id !== product.id));
      const updatedWishlistItems = produce(store.wishlistItems(), (draft) => {
        if(!draft.find(p => p.id === product.id)) {
          draft.push(product);
        }
      })
      patchState(store, {cartItems: updatedCartItems, wishlistItems: updatedWishlistItems})
    },

    removeFromCart: (product: Product) => {
      patchState(store, {
        cartItems: store.cartItems().filter((c) => c.product.id !== product.id),
      })
    }

  })),

 


);
