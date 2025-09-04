import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['tr', 'en'] as const;
export const defaultLocale = 'tr' as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as typeof locales[number])) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
