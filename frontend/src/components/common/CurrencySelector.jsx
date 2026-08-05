import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrency } from "../../redux/slices/currencySlice";

const currencies = [
  { code: "USD", symbol: "$", name: "USD" },
  { code: "EUR", symbol: "€", name: "EUR" },
  { code: "INR", symbol: "₹", name: "INR" },
];

const CurrencySelector = () => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state) => state.currency);

  const [open, setOpen] = useState(false);

  const current =
    currencies.find((c) => c.code === currency) || currencies[0];

  const changeCurrency = (selected) => {
    dispatch(setCurrency(selected.code));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:text-gray-900 transition"
      >
        <span>{current.symbol}</span>

        <span>{current.name}</span>

        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
          {currencies.map((item) => (
            <button
              key={item.code}
              onClick={() => changeCurrency(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition ${
                current.code === item.code
                  ? "bg-blue-50 text-[#0066CC]"
                  : "text-gray-700"
              }`}
            >
              <span>{item.symbol}</span>

              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default CurrencySelector;