import { Handler } from 'express';
import requestIp from 'request-ip';

import isRussianIp from './isRussianIp';

const HTTP_STATUS_FORBIDDEN = 403;
const DEFAULT_BODY = 'Гражданин России, иди нахуй!';
const DEFAULT_STATUS = HTTP_STATUS_FORBIDDEN;

interface Props {
  body?: any;
  status?: number;
}

type Byeivan = (props?: Props) => Handler;

const byeivan: Byeivan = ({ body = DEFAULT_BODY, status = DEFAULT_STATUS } = {}) => {
  return async (request, response, next) => {
    const ip = requestIp.getClientIp(request);

    if (typeof ip === 'string' && isRussianIp(ip)) {
      response.status(status).send(body);
      return;
    }

    next();
  };
};

export default byeivan;
