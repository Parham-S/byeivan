const decodeIpsRange = (encodedRange: string): [bigint, bigint] => {
  const [startIpHex, ipsCountHex] = encodedRange.split('+');
  const startIp = BigInt('0x' + startIpHex);
  const ipsCount = BigInt('0x' + ipsCountHex);
  const endIp = startIp + ipsCount;

  return [startIp, endIp];
};

export default decodeIpsRange;
