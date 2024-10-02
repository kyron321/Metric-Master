// app/api/pagespeed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.PAGESPEED_API_KEY;

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key is not set' }, { status: 500 });
    }

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&category=performance&category=accessibility&category=seo&category=best-practices`
    );

    // Log the entire lighthouseResult for debugging
    console.log('Lighthouse Result:', response.data.lighthouseResult);

    // Extract the required Lighthouse scores
    const lighthouseResult = response.data.lighthouseResult;
    const scores = {
      performance: lighthouseResult?.categories?.performance?.score * 100 || 'N/A',
      accessibility: lighthouseResult?.categories?.accessibility?.score * 100 || 'N/A',
      seo: lighthouseResult?.categories?.seo?.score * 100 || 'N/A',
      bestPractices: lighthouseResult?.categories?.['best-practices']?.score * 100 || 'N/A',
    };

    return NextResponse.json({ url, scores });
  } catch (error) {
    console.error('Error fetching PageSpeed Insights data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
};