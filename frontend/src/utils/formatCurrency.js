const currencyLocaleMap = {
  USD: "en-US",
  EUR: "de-DE",
  INR: "en-IN",
  
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat(currencyLocaleMap[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};