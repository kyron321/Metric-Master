import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const wordpressUrl = searchParams.get('url');
  console.log('WordPress URL:', wordpressUrl);

  if (!wordpressUrl) {
    return NextResponse.json({ error: 'WordPress URL is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://${wordpressUrl}/wp-json/wp/v2/`);
    console.log('WordPress API response:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching data from WordPress API:', error);
    return NextResponse.json({ error: 'Failed to fetch data from WordPress API' }, { status: 500 });
  }
};