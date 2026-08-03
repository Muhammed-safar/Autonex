import { createContext, useContext, useState } from "react";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState([]);

  const addToCompare = (product) => {
    setCompareProducts((prev) => {
      // already exists
      if (prev.some((p) => p.id === product.id)) return prev;

      // empty slot
      if (prev.length < 2) {
        return [...prev, product];
      }

      // replace first product
      return [prev[1], product];
    });
  };

  const removeFromCompare = (id) => {
    setCompareProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);