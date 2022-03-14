import isRussianIp from './isRussianIp';

const RUSSIAN_IP = '2.56.138.0';
const NON_RUSSIAN_IP = '193.19.164.19';
const RUSSIAN_V6_IP = '2a02:6b8:c0d:1a97::492c:4bca:0';
const NON_RUSSIAN_V6_IP = '10e1::c69b:c32d:22b7:7c85:083a';

describe('isRussianIp', () => {
  it('should return true for Russian IP', () => {
    expect(isRussianIp(RUSSIAN_IP)).toBe(true);
  });

  it('should return true for Russian IP v6', () => {
    expect(isRussianIp(RUSSIAN_V6_IP)).toBe(true);
  });

  it('should return false for Russian IP', () => {
    expect(isRussianIp(NON_RUSSIAN_IP)).toBe(false);
  });

  it('should return false for Russian IP v6', () => {
    expect(isRussianIp(NON_RUSSIAN_V6_IP)).toBe(false);
  });
});
