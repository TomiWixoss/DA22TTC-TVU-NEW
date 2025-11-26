import type { Metadata } from 'next';

const siteConfig = {
  name: 'TomiSakaeTech',
  description: 'Trang Web với các tiện ích thần kỳ!',
  url: 'https://www.tomisakae.tech', // Thay bằng domain thật
  ogImage: '/og-image.png',
  twitter: '@tomisakae', // Thay bằng Twitter handle thật
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['TomiSakaeTech', 'tiện ích', 'công nghệ', 'web app'],
  authors: [{ name: 'TomiSakae' }],
  creator: 'TomiSakae',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

// Helper để tạo metadata cho từng page
export function createMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description: description || siteConfig.description,
    openGraph: {
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: image ? [image] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
