const COUNTRY_TRANSLATIONS = {
  Russia: 'Россия',
  Belarus: 'Беларусь',
  Kazakhstan: 'Казахстан',
  Ukraine: 'Украина',
  Georgia: 'Грузия',
  Armenia: 'Армения',
  Azerbaijan: 'Азербайджан',
  Uzbekistan: 'Узбекистан',
  Kyrgyzstan: 'Киргизия',
  Tajikistan: 'Таджикистан',
  Turkmenistan: 'Туркменистан',
  Moldova: 'Молдова',
  Poland: 'Польша',
  Germany: 'Германия',
  France: 'Франция',
  Italy: 'Италия',
  Spain: 'Испания',
  Portugal: 'Португалия',
  Turkey: 'Турция',
  Greece: 'Греция',
  Cyprus: 'Кипр',
  Finland: 'Финляндия',
  Sweden: 'Швеция',
  Norway: 'Норвегия',
  Denmark: 'Дания',
  Netherlands: 'Нидерланды',
  Belgium: 'Бельгия',
  Switzerland: 'Швейцария',
  Austria: 'Австрия',
  Czechia: 'Чехия',
  'Czech Republic': 'Чехия',
  Slovakia: 'Словакия',
  Hungary: 'Венгрия',
  Romania: 'Румыния',
  Bulgaria: 'Болгария',
  Serbia: 'Сербия',
  Croatia: 'Хорватия',
  Montenegro: 'Черногория',
  Slovenia: 'Словения',
  Estonia: 'Эстония',
  Latvia: 'Латвия',
  Lithuania: 'Литва',
  Ireland: 'Ирландия',
  'United Kingdom': 'Великобритания',
  Iceland: 'Исландия',
  'United States of America': 'Соединённые Штаты Америки',
  Canada: 'Канада',
  Mexico: 'Мексика',
  Brazil: 'Бразилия',
  Argentina: 'Аргентина',
  Chile: 'Чили',
  Peru: 'Перу',
  Colombia: 'Колумбия',
  Venezuela: 'Венесуэла',
  China: 'Китай',
  Japan: 'Япония',
  'South Korea': 'Южная Корея',
  'North Korea': 'Северная Корея',
  India: 'Индия',
  Pakistan: 'Пакистан',
  Thailand: 'Таиланд',
  Vietnam: 'Вьетнам',
  Indonesia: 'Индонезия',
  Malaysia: 'Малайзия',
  Singapore: 'Сингапур',
  'United Arab Emirates': 'Объединённые Арабские Эмираты',
  Israel: 'Израиль',
  Egypt: 'Египет',
  Morocco: 'Марокко',
  Tunisia: 'Тунис',
  'South Africa': 'Южная Африка',
  Australia: 'Австралия',
  'New Zealand': 'Новая Зеландия',
};

export const localizeCountryName = (country) => COUNTRY_TRANSLATIONS[country] ?? country;

const normalizeComparableValue = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ');

export const isCountryOnlyQuery = (query, weather) => {
  const normalizedQuery = normalizeComparableValue(query);
  const normalizedCountry = normalizeComparableValue(weather.country);
  const normalizedCity = normalizeComparableValue(weather.city);

  return Boolean(normalizedQuery)
    && normalizedQuery === normalizedCountry
    && normalizedQuery !== normalizedCity;
};
