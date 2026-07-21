import { computed, inject } from "@angular/core";
import { patchState, signalMethod, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Product } from "./models/product";
import productsData from "./pages/products-grid/products.json";
import { produce} from 'immer'
import { Toaster } from "./services/toaster";
import { CartItem } from "./models/cart";
import { MatDialog } from "@angular/material/dialog";
import { SignInDialog } from "./components/sign-in-dialog/sign-in-dialog";
import { SignInParams, SignUpParams, User } from "./models/user";
import { Router } from "@angular/router";
import { Order } from "./models/order";
import { withStorageSync } from "@angular-architects/ngrx-toolkit";


export type EcommerceState = {
  products: Product[];
  category: string;
  wishlistItems: Product[];
  cartItems: CartItem[];
  user: User | undefined;
  selectedProductId: number | undefined
  loading: boolean;
};

const initialState: EcommerceState = {
    products: productsData as Product[],
    category: 'All',
    wishlistItems: [],
    cartItems: [],
    user: undefined,
    loading: false,
    selectedProductId: undefined,
};

export const EcommerceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withStorageSync({key: 'modern-store', select: ({wishlistItems, cartItems, user}) => ({ wishlistItems, cartItems, user })}),
  withComputed(({ category, products, wishlistItems, cartItems, selectedProductId }) => ({
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
    selectedProduct: computed(() => products().find(p => p.id === selectedProductId()))
  })),

  withMethods((store, toaster = inject(Toaster), matDialog = inject(MatDialog), router = inject(Router)) => ({
    setCategory(category: string) {
      patchState(store, { category });
    },

    setProductId: signalMethod<number>((productId: number) => {
      patchState(store, { selectedProductId: productId })
    }),

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
    },

    proceedToCheckout: () => {
      if(!store.user()) {
         matDialog.open(SignInDialog, {
          disableClose: true,
          data:{
            checkout: true
          }
        })
        return
      }
      router.navigate(['/Checkout'])
       
    },

    signIn:({email, password, checkout, dialogId}: SignInParams) => {
      patchState(store, {
        user: {
          id: '1',
          email,
          name: 'Fares',
          imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        } 
      })

      matDialog.getDialogById(dialogId)?.close();

      if(checkout) {
        router.navigate(['/Checkout'])
      }
    },

    signUp:({email, password, name, checkout, dialogId}: SignUpParams) => {
      patchState(store, {
        user: {
          id: '1',
          email,
          name: 'Fares',
          imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        } 
      })

      matDialog.getDialogById(dialogId)?.close();

      if(checkout) {
        router.navigate(['/Checkout'])
      }
    },


    signOut: () => {
      patchState(store, { user: undefined })
    },

    placeOrder: async() => {
      patchState(store, {loading: true});

      const user = store.user()
      

      if(!user) {
        toaster.error('You must be logged in to place an order');
        patchState(store, {loading: false});
        return;
      }



      const order: Order ={
        id: crypto.randomUUID(),
        userId: user.id,
        total: Math.round(store
          .cartItems()
          .reduce((acc, item) => acc + item.quantity * item.product.price, 0)),
        items: store.cartItems(),
        paymentStatus: "success"
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      patchState(store, {loading: false, cartItems: [], })  

      router.navigate(['/OrderSuccess'])
    }

  })),

 


);
