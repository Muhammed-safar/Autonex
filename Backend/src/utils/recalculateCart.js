export const recalculateCart = (cart) => {
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.priceAtAdded * item.quantity,
    0
  );

  cart.totalQuantity = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return cart;
};