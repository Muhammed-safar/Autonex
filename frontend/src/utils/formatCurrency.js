const currencyLocaleMap = {
  USD: "en-US",
  EUR: "de-DE",
  INR: "en-IN",
 
};

export const formatCurrency = (
  amount = 0,
  currency = "USD",
) => {
  return new Intl.NumberFormat(
    currencyLocaleMap[currency] || "en-US",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(Number(amount));
};