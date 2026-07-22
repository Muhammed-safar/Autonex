import React from "react";
import DealCard from "./DealCard";

const DealList = () => {
  const deals = [
    {
      id: 1,
      discount: "-20%",
      title: "Yokohama Geolandar X-CV All Season 255_45R20 105W XL",
      price: "$252.96",
      originalPrice: "$314.56",
      available: 27,
      sold: 10,
      image:
        "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 2,
      discount: "-30%",
      title: "Touren TR60-3260 16x7 5X112_5X120 42Et 72.62Cb Matt",
      price: "$131.87",
      originalPrice: "$187.16",
      available: 8,
      sold: 4,
      image:
        "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 3,
      discount: "-18%",
      title: "Touren TR9-3190 18x8 5X112_5X120 40Et 74.1Cb",
      price: "$153.36",
      originalPrice: "$186.25",
      available: 14,
      sold: 20,
      image:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300",
    },
  ];

  return (
    <div>
      <div className="lg:col-span-5 space-y-4">
        {deals.map((item) =>(
          <DealCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DealList;
