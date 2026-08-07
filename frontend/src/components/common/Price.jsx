import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

const Price = ({ amount = 0, currency = "USD", className = "" }) => (
  <span className={className}>
    {formatCurrency(amount, currency)}
  </span>
); 

export default Price;