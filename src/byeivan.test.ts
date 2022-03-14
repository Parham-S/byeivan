import express from 'express';
import request from 'supertest';

import byeivan from './byeivan';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_FORBIDDEN = 403;
const HTTP_I_AM_A_TEAPOT = 418;
const RUSSIAN_IP = '2.56.138.0';
const NON_RUSSIAN_IP = '193.19.164.19';
const RUSSIAN_V6_IP = '2a02:6b8:c0d:1a97::492c:4bca:0';
const NON_RUSSIAN_V6_IP = '10e1::c69b:c32d:22b7:7c85:083a';

const createServer = (middleware): Express.Application => {
  return express()
    .enable('trust proxy')
    .use(middleware)
    .get('/', (request, response) => {
      response.send('Hello!');
    });
};

describe('byeivan', () => {
  it('should be a function', () => {
    expect(typeof byeivan).toBe('function');
  });

  it('should create an express middleware', () => {
    const middleware = byeivan();

    expect(typeof middleware).toBe('function');
    expect(middleware.length).toBe(3); // req, res, next
  });
});

describe('Integration with express', () => {
  it('should not block non-Russian IP', async () => {
    const server = createServer(byeivan());
    const response = await request(server).get('/').set('X-Client-IP', NON_RUSSIAN_IP).send();

    expect(response.statusCode).toBe(HTTP_STATUS_OK);
    expect(response.text).toEqual('Hello!');
  });

  it('should not block non-Russian IP v6', async () => {
    const server = createServer(byeivan());
    const response = await request(server).get('/').set('X-Client-IP', NON_RUSSIAN_V6_IP).send();

    expect(response.statusCode).toBe(HTTP_STATUS_OK);
    expect(response.text).toEqual('Hello!');
  });

  it('should block Russian IP v6 and respond with default body and status code', async () => {
    const server = createServer(byeivan());
    const response = await request(server).get('/').set('X-Client-IP', RUSSIAN_V6_IP).send();

    expect(response.statusCode).toBe(HTTP_STATUS_FORBIDDEN);
    expect(response.text).toEqual('Гражданин России, иди нахуй!');
  });

  it('should block Russian IP and respond with default body and status code', async () => {
    const server = createServer(byeivan());
    const response = await request(server).get('/').set('X-Client-IP', RUSSIAN_IP).send();

    expect(response.statusCode).toBe(HTTP_STATUS_FORBIDDEN);
    expect(response.text).toEqual('Гражданин России, иди нахуй!');
  });

  it('should block Russian IP and respond with custom body and status code', async () => {
    const errorMessage = 'Bye Bye Ivan!';
    const middleware = byeivan({
      body: errorMessage,
      status: HTTP_I_AM_A_TEAPOT,
    });
    const server = createServer(middleware);
    const response = await request(server).get('/').set('X-Client-IP', RUSSIAN_IP).send();

    expect(response.statusCode).toBe(HTTP_I_AM_A_TEAPOT);
    expect(response.text).toEqual(errorMessage);
  });
});
