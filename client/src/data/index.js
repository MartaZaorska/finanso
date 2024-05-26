export const CURRENCY = {
  'PLN': 'Polski złoty (PLN)',
  'USD': 'Dolar amerykański (USD)',
  'EUR': 'Euro (EUR)',
  'GBP': 'Brytyjski funt (GBP)',
  'CHF': 'Frank szwajcarski (CHF)'
}

export const SORT_OPTIONS = {
  'newest': 'Od najnowszych',
  'oldest': 'Od najstarszych'
}
  
export const TYPE_OPERATION = {
  'income': 'Przychody',
  'expenses': 'Wydatki'
};

export const EXPENSES_CATEGORIES = {
  'food': 'Jedzenie',
  'housing': 'Mieszkanie',
  'bills': 'Opłaty i rachunki',
  'health': 'Zdrowie',
  'hygiene_chemicals': 'Higiena i chemia',
  'clothing_shoes': 'Ubrania i obuwie',
  'entertainment': 'Rozrywka',
  'transport': 'Transport',
  'travel': 'Podróże',
  'other_expenses': 'Inne wydatki'
};


export const INCOME_CATEGORIES = {
  'salary': 'Wynagrodzenie',
  'scholarship': 'Stypendium',
  'interest': 'Odsetki',
  'pension': 'Emerytura',
  'benefit': 'Zasiłek',
  'other_incomes': 'Inne dochody' 
}

export const BAR_CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Wykres przychodów i wydatków',
    },
  }
}