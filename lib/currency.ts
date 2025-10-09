export const getCurrencySymbol = (currencyCode?: string): string => {
  const currency = currencyCode || process.env.NEXT_PUBLIC_CURRENCY || 'USD';
  
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'INR': '₹',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'CHF',
    'CNY': '¥',
    'SEK': 'kr',
    'NZD': 'NZ$',
    'MXN': '$',
    'SGD': 'S$',
    'HKD': 'HK$',
    'NOK': 'kr',
    'TRY': '₺',
    'RUB': '₽',
    'BRL': 'R$',
    'KRW': '₩',
    'PLN': 'zł'
  };

  return currencySymbols[currency.toUpperCase()] || currency;
};

export const formatCurrency = (amount: number, currencyCode?: string): string => {
  const currency = currencyCode || process.env.NEXT_PUBLIC_CURRENCY || 'USD';
  const symbol = getCurrencySymbol(currency);
  
  return `${symbol}${amount.toFixed(2)}`;
};