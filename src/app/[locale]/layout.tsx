'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import "../globals.css";

// Import messages directly
import trMessages from '../../messages/tr.json';
import enMessages from '../../messages/en.json';

const messages = {
  tr: trMessages,
  en: enMessages
};

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || 'tr';
  const [currentMessages, setCurrentMessages] = useState(messages[locale as keyof typeof messages] || messages.tr);

  useEffect(() => {
    setCurrentMessages(messages[locale as keyof typeof messages] || messages.tr);
  }, [locale]);

  return (
    <NextIntlClientProvider messages={currentMessages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
