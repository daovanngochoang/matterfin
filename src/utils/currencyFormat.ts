
export const formatCurrency = (value: number) => {
  // Format the value into currency without fractions
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, // Set maximum fraction digits to 0
  }).format(value);
};

