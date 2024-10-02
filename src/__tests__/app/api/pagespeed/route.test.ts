import { NextRequest } from 'next/server';
import { GET } from '@/app/api/pagespeed/route';

const mockNextRequest = (url: string): NextRequest => {
  return new NextRequest(`http://localhost:3000/api/pagespeed?url=${url}`);
};

describe('GET /api/pagespeed integration test', () => {
  it('should return Lighthouse data for a valid URL', async () => {
    const req = mockNextRequest('https://kyronsmith.com');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json).toBeTruthy();
    expect(json.scores).toHaveProperty('performance');
    expect(json.scores).toHaveProperty('accessibility');
    expect(json.scores).toHaveProperty('seo');
    expect(json.scores).toHaveProperty('bestPractices');
  }, 30000);
});
