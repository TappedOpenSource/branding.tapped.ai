import '@/styles/index.css';
import { Analytics } from '@vercel/analytics/react';
import { app } from '@/utils/firebase';
import Head from 'next/head';
import React from 'react';

console.log(app.name);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <meta name="description" content="we want to sign you to our label. apply for free" />
        <meta property="og:site_name" content="tapped.ai" />
        <meta property="og:description" content="we want to sign you to our label. apply for free" />
        <meta property="og:title" content="Tapped Ai : world's first Ai label" />
        <meta property="og:image" content="https://tapped.ai/og.png" />
        <meta property="og:url" content="https://tapped.ai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tapped Ai : world's first Ai label" />
        <meta name="twitter:description" content="we want to sign you to our label. apply for free" />
        <meta property="twitter:image" content="https://tapped.ai/og.png" />
      </Head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </>
  );
}

