const exchangeRates = {
  USD: 1,
  EUR: 0.86,
  INR: 87.4,
  GBP: 0.74,
  AED: 3.67,
};

export const convertCurrency = (
  amount,
  fromCurrency,
  toCurrency,
) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInUSD = amount / exchangeRates[fromCurrency];

  return Number(
    (amountInUSD * exchangeRates[toCurrency]).toFixed(2),
  );
};

export const convertProduct = (product, targetCurrency) => {
  const sourceCurrency = product.currency || "USD";

  return {
    ...product,
    price: convertCurrency(
      product.price,
      sourceCurrency,
      targetCurrency,
    ),
    discountPrice: convertCurrency(
      product.discountPrice,
      sourceCurrency,
      targetCurrency,
    ),
    currency: targetCurrency,
  };
};