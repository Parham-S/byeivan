import { stringify as stringifyIp } from 'ip-bigint';
import { BlockList } from 'net';

import decodeIpsRange from './decodeIpsRange';
import ipV4Ranges from './ipV4Ranges';
import ipV6Ranges from './ipV6Ranges';

const blockList = new BlockList();

ipV4Ranges.forEach((encodedRange) => {
  const [startIpInteger, endIpInteger] = decodeIpsRange(encodedRange);
  const startIp = stringifyIp({ number: startIpInteger, version: 4 });
  const endIp = stringifyIp({ number: endIpInteger, version: 4 });
  blockList.addRange(startIp, endIp, 'ipv4');
});

ipV6Ranges.forEach((encodedRange) => {
  const [startIpInteger, endIpInteger] = decodeIpsRange(encodedRange);
  const startIp = stringifyIp({ number: startIpInteger, version: 6 });
  const endIp = stringifyIp({ number: endIpInteger, version: 6 });
  blockList.addRange(startIp, endIp, 'ipv6');
});

export default blockList;
