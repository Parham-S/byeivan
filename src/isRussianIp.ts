import { type IPVersion, isIPv4 } from 'net';

import blockList from './blockList';

const isRussianIp = (ip: string): boolean => {
  const type: IPVersion = isIPv4(ip) ? 'ipv4' : 'ipv6';
  return blockList.check(ip, type);
};

export default isRussianIp;
