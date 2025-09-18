import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const size = searchParams.get('size') || 'w500';

  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    const imageUrl = `https://image.tmdb.org/t/p/${size}${path}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);

    // Return a placeholder SVG on error
    const placeholder = `
      <svg width="500" height="750" viewBox="0 0 500 750" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="750" fill="#111111"/>
        <path d="M200 300L300 375L200 450V300Z" fill="#666666"/>
        <text x="250" y="500" text-anchor="middle" fill="#666666" font-size="18" font-family="Arial">Immagine non disponibile</text>
      </svg>
    `;

    return new NextResponse(placeholder, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    });
  }
}