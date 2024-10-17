import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const wordpressUrl = searchParams.get('url');
  const wordpressPass = searchParams.get('wpPass');
  const wordpressUser = searchParams.get('wpUser');
  console.log('WordPress User:', wordpressUser);
  console.log('WordPress Pass:', wordpressPass);
  console.log('WordPress URL:', wordpressUrl);

  if (!wordpressUrl || !wordpressUser || !wordpressPass) {
    return NextResponse.json({ error: 'WordPress URL, User, and Pass are required' }, { status: 400 });
  }

  const auth = Buffer.from(`${wordpressUser}:${wordpressPass}`).toString('base64');

  try {
    const response = await axios.get(`https://${wordpressUrl}/wp-json/wp/v2/plugins`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching data from WordPress API:', error);
    return NextResponse.json({ error: 'Failed to fetch data from WordPress API' }, { status: 500 });
  }
};