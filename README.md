# byeivan

[Express](https://github.com/expressjs/express) middleware to reject requests from all Russian IPs.

[![Version](https://img.shields.io/npm/v/byeivan)](https://www.npmjs.com/package/byeivan)
![License](https://img.shields.io/npm/l/byeivan)
![Node version](https://img.shields.io/node/v/byeivan)
![Dependencies](https://img.shields.io/librariesio/release/npm/byeivan)

Table of contents:

- [Installation](#installation)
- [Usage](#usage)
- [FAQ](#faq)

## Installation

```Shell
npm install --save byeivan
```

## Usage

### Basic

```ts
import express from 'express';
import byeivan from 'byeivan';

const app = express();

app.use(byeivan());
```

### Customize response body and/or status code

```ts
import express from 'express';
import byeivan from 'byeivan';

const HTTP_I_AM_A_TEAPOT = 418;

const app = express();

app.use(byeivan({
  body: 'bye bye Ivan! Гражданин России, иди нахуй!',
  status: HTTP_I_AM_A_TEAPOT,
}));
```

## FAQ

### Using behind a reverse proxy

In order to retrieve a client IP address we use [request-ip](https://www.npmjs.com/package/request-ip) library. Please check its documentation and make sure that your reverse proxy passes at least one of required headers containing client's IP address
