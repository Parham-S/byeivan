import decodeIpsRange from './decodeIpsRange';

describe('decodeIpsRange', () => {
  it('should decode range', () => {
    const startIpHexString = '7F000001'; // 127.0.0.1
    const ipsCountHexString = '20000'; // 131072
    const [startIp, endIp] = decodeIpsRange(`${startIpHexString}+${ipsCountHexString}`);

    expect(startIp).toBe(BigInt(`0x${startIpHexString}`));
    expect(endIp).toBe(BigInt(0x7f020001)); // 127.2.0.1
  });
});
