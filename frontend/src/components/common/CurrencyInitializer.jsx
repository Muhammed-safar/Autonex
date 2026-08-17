import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDefaultCurrency } from "../../redux/slices/currencySlice.js";
import { getSettings } from "../../api/settings.api.js";

const CurrencyInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeCurrency = async () => {
      const savedCurrency = localStorage.getItem("currency");

      // User already selected a currency, so keep it.
      if (savedCurrency) {
        return;
      }

      try {
        const data = await getSettings();

        const defaultCurrency =
          data?.data?.defaultCurrency || "INR";

        dispatch(setDefaultCurrency(defaultCurrency));
      } catch (error) {
        console.error(
          "Failed to load default currency:",
          error,
        );

        // Safe fallback
        dispatch(setCurrency("INR"));
      }
    };

    initializeCurrency();
  }, [dispatch]);

  return null;
};

export default CurrencyInitializer;