module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeDetection: true,
  },
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar'],
  ns: ['common', 'auth', 'dashboard', 'employee', 'attendance', 'leave', 'payroll'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
};
