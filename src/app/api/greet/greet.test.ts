import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import handler from './route';

describe('/api/greet API Endpoint', () => {
  it('should return a 200 status and greet the user with the name provided', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { name: 'John' },
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = res._getJSONData();
    expect(json).toEqual({ message: 'Hello, John!' });
  });

  it('should return a 400 status if name is not provided', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const json = res._getJSONData();
    expect(json).toEqual({ message: 'Name is required' });
  });

  it('should return a 405 status for methods other than POST', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const json = res._getJSONData();
    expect(json).toEqual({ message: 'Method not allowed' });
  });
});
