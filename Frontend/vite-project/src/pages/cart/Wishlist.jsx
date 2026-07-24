import React from "react";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import {useWishlist} from "../../context/WishlistContext"


const Wishlist = ({ onReturnToShop }) => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  // Empty State
  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center animate-in fade-in duration-200">
        <div className="p-5 bg-gray-50 rounded-full mb-4">
          <Heart className="w-16 h-16 text-gray-700 stroke-[1.5]" />
        </div>

        <p className="text-gray-700 text-sm md:text-base font-medium mb-6">
          The wishlist table is empty.
        </p>

        <button
          onClick={onReturnToShop}
          className="bg-[#0067B2] hover:bg-[#00528e] text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors shadow-xs cursor-pointer"
        >
          Return to shop
        </button>
      </div>
    );
  }

  // Populated State
  return (
    <div className="md:max-w-4xl lg:max-w-5xl mx-auto my-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            You have {wishlistItems.length} item
            {wishlistItems.length > 1 ? "s" : ""} saved.
          </p>
        </div>

        <button
          onClick={clearWishlist}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Wishlist Items List */}
      <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs max-h-[500px] overflow-y-auto hide-scrollbar">
        {wishlistItems.map((item) => {
          const numPrice = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
          
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-gray-50/50 transition-colors"
            >
              {/* Product Details */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {item.category || "General"}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">
                    {item.title || item.name}
                  </h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm font-semibold text-[#0067B2]">
                      ${numPrice.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                        item.inStock !== false
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {item.inStock !== false ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <button
                  type="button"
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-[#0067B2] hover:bg-[#00528e] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return to Shop Banner */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onReturnToShop}
          className="flex items-center space-x-2 text-xs font-semibold text-gray-600 hover:text-[#0067B2] transition-colors cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Wishlist;