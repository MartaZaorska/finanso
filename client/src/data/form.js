import { validateName, validateSurname, validateEmail, validatePassword, validateNumber, validateFutureDate, validatePastDate, validateRangePastDate, validateRangeNumber } from '../utils/validation';
import { CURRENCY, EXPENSES_CATEGORIES, INCOME_CATEGORIES, SORT_OPTIONS, TYPE_OPERATION } from './index';

export const AUTH_DATA = {
  email: {
    initialValue: '',
    placeholder: 'Adres e-mail',
    required: true,
    validation: validateEmail
  },
  password: {
    initialValue: '',
    placeholder: 'Hasło',
    required: true,
    validation: validatePassword
  },
};

export const USER_DATA = {
  name: {
    initialValue: '',
    placeholder: 'Twoje imię',
    required: true,
    validation: validateName
  },
  surname: {
    initialValue: '',
    placeholder: 'Twoje nazwisko',
    required: true,
    validation: validateSurname
  },
  email: {
    initialValue: '',
    placeholder: 'Adres e-mail',
    required: true,
    validation: validateEmail
  },
  password: {
    initialValue: '',
    placeholder: 'Hasło',
    required: true,
    validation: validatePassword
  }
};

export const GROUP_DATA = {
  name: {
    initialValue: '',
    placeholder: 'Nazwa grupy',
    required: true,
    validation: () => null
  },
  currency: {
    initialValue: 'PLN',
    placeholder: 'Wybierz walutę',
    required: true,
    validation: () => null,
    options: CURRENCY
  }
}

export const PLAN_ITEM_DATA = {
  value: {
    initialValue: '',
    placeholder: 'Wartość',
    required: true,
    validation: validateNumber
  },
  name: {
    initialValue: '',
    placeholder: 'Nazwa',
    required: true,
    validation: () => null
  },
  description: {
    initialValue: '',
    placeholder: 'Dodatkowy opis',
    required: false,
    validation: () => null
  },
  targetDate: {
    initialValue: new Date().toISOString().slice(0, 10),
    placeholder: 'Data docelowa',
    required: false,
    validation: validateFutureDate
  }
};

export const EXPENSE_DATA = {
  value: {
    initialValue: '',
    placeholder: 'Wartość',
    required: true,
    validation: validateNumber
  },
  description: {
    initialValue: '',
    placeholder: 'Dodatkowy opis',
    required: false,
    validation: () => null
  },
  date: {
    initialValue: new Date().toISOString().slice(0, 10),
    placeholder: 'Data transakcji',
    required: false,
    validation: validatePastDate
  },
  category: {
    initialValue: 'food',
    placeholder: 'Wybierz kategorię',
    required: true,
    validation: () => null,
    options: EXPENSES_CATEGORIES
  }
}

export const INCOME_DATA = {
  value: {
    initialValue: '',
    placeholder: 'Wartość',
    required: true,
    validation: validateNumber
  },
  description: {
    initialValue: '',
    placeholder: 'Dodatkowy opis',
    required: false,
    validation: () => null
  },
  date: {
    initialValue: new Date().toISOString().slice(0, 10),
    placeholder: 'Data transakcji',
    required: false,
    validation: validatePastDate
  },
  category: {
    initialValue: 'salary',
    placeholder: 'Wybierz kategorię',
    required: true,
    validation: () => null,
    options: INCOME_CATEGORIES
  }
}

export const FILTER_DATA = {
  sortBy: {
    initialValue: 'newest',
    placeholder: 'Sortuj według',
    required: true,
    validation: () => null,
    options: SORT_OPTIONS
  },
  type: {
    initialValue: 'all',
    placeholder: 'Rodzaj operacji',
    required: true,
    validation: () => null,
    options: { 'all': 'Wszystkie', ...TYPE_OPERATION } 
  },
  valueFrom: {
    initialValue: '',
    placeholder: 'Kwota od',
    required: false,
    rangeName: 'value',
    validation: validateRangeNumber
  },
  valueTo: {
    initialValue: '',
    placeholder: 'Kwota do',
    required: false,
    rangeName: 'value',
    validation: validateRangeNumber
  },
  dateFrom: {
    initialValue: '',
    placeholder: 'Data od',
    required: false,
    rangeName: 'date',
    validation: validateRangePastDate
  },
  dateTo: {
    initialValue: '',
    placeholder: 'Data do',
    required: false,
    rangeName: 'date',
    validation: validateRangePastDate
  },
  category: {
    initialValue: 'all',
    placeholder: 'Kategoria',
    required: true,
    validation: () => null,
    options: {
      'all': 'Wszystkie kategorie'
    }
  },
  user: {
    initialValue: 'all',
    placeholder: 'Użytkownik',
    required: true,
    validation: () => null,
    options: {
      'all': 'Wszyscy użytkownicy'
    }
  }
}

export const CHART_FILTER_DATA = {
  type: {
    initialValue: 'line',
    placeholder: 'Typ wykresu',
    required: true,
    validation: () => null,
    options: {
      'line': 'Wykres liniowy',
      'bar': 'Wykres słupkowy'
    }
  },
  user: {
    initialValue: 'all',
    placeholder: 'Użytkownik',
    required: true,
    validation: () => null,
    options: {
      'all': 'Wszyscy użytkownicy'
    }
  },
  monthYear: {
    initialValue: new Date().toISOString().slice(0, 7),
    placeholder: 'Miesiąc',
    required: true,
    max: new Date().toISOString().slice(0, 7),
    validation: () => null,
  }
}