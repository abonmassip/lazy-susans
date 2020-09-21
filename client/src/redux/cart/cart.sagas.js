import {
  all, call, takeLatest, put, select
} from 'redux-saga/effects';

import UserActionTypes from '../user/user.types';
import CartActionTypes from '../cart/cart.types';
import { clearCart, setCartFromFirebase } from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { selectCurrentUser } from '../user/user.selectors';

import { getUserRef } from '../../firebase/firebase.utils';


export function* clearCartOnSignOut() {
  yield put(clearCart());
}

export function* onSignOutSuccess() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}

export function* getFirebaseCart({ payload: user }) {
  const userRef = yield getUserRef(user.id);
  const userSnapShot = yield userRef.get();
  const userCart = yield userSnapShot.data().cartItems;
  const cartItems = yield select(selectCartItems);
  yield put(setCartFromFirebase(!userCart.length ? cartItems : userCart));
  if(!userCart.length && cartItems.length) {
    yield userRef.update({ cartItems });
  }
}

export function* updateFirebaseCart() {
  const cartItems = yield select(selectCartItems);
  const currentUser = yield select(selectCurrentUser);
  if(!currentUser) return;
  const userRef = yield getUserRef(currentUser.id);
  yield userRef.update({ cartItems });
}

export function* onUserSignIn() {
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, getFirebaseCart);
}

export function* onCartChange() {
  yield takeLatest([
    CartActionTypes.ADD_ITEM,
    CartActionTypes.REMOVE_ITEM,
    CartActionTypes.CLEAR_ITEM_FROM_CART,
  ], updateFirebaseCart)
}

export function* cartSagas() {
  yield (all([
    call(onSignOutSuccess),
    call(onUserSignIn),
    call(onCartChange),
  ]));
}
