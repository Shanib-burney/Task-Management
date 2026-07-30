import request from 'supertest';
import { describe, expect, it } from '@jest/globals';

process.env.NODE_ENV = 'local';

const { app } = require('../src/index');

describe('GraphQL UI', () => {
  it('serves the Apollo landing page in local mode', async () => {
    const response = await request(app)
      .get('/graphql')
      .set('Accept', 'text/html');

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
    expect(response.text).toContain('Apollo Server');
  });

  it('does not serve an HTML landing page outside local mode', async () => {
    process.env.NODE_ENV = 'development';

    const response = await request(app)
      .get('/graphql')
      .set('Accept', 'text/html');

    expect(response.status).not.toBe(200);
    expect(response.type).not.toMatch(/html/);
  });
});
