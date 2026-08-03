import React from "react";
import DealCard from "./DealCard";
import { useProducts } from "../../../hooks/products/useProducts";
import { useCategories } from "../../../hooks/categories/useCategories";

const DealList = () => {
 const { data: categoryData } = useCategories();

  const alloyCategory = categoryData?.data?.find(
    (category) => category.name === "Wheel",
  );

  const { data, isLoading, isError } = useProducts({
    category: alloyCategory?._id,
    limit: 3,
  });

  const deals = data?.data || [];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load products.</p>;
  }
  return (
    <div>
    <div className="lg:col-span-5 space-y-4">
        {deals.map((products) => (
          <DealCard
            key={products._id}
            item={{
              id: products._id,
              title: products.name,
              image: products.images?.[0]?.url || "",
              price: products.price,
              discountPrice: products.discountPrice,
              available: products.stock,
              sold: products.totalSold,
            }}
          />
        ))}
      </div>
    </div>
  );
};


export default DealList;
