'use client';

import React from 'react';

interface StructuredDataProps {
  type: 'SportsEvent' | 'NewsArticle' | 'SportsOrganization';
  data: Record<string, any>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
