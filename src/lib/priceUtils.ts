export const getPrice = (basePrice: number, country: string) => {
  switch (country) {
    case "EU":
      return { symbol: "€", value: Math.round(basePrice * 0.012) };
    case "US":
      return { symbol: "$", value: Math.round(basePrice * 0.013) };
    case "ME":
      return { symbol: "د.إ", value: Math.round(basePrice * 0.048) };
    case "IN":
    default:
      return { symbol: "₹", value: basePrice };
  }
};

export const formatPrice = (basePrice: number, country: any) => {
  const { symbol, value } = getPrice(basePrice, country);
  return `${symbol}${value}`;
};
