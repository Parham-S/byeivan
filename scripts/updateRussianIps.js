const fs = require('fs');
const http = require('http');
const https = require('https');
const { fs: memfs } = require('memfs');
const Papa = require('papaparse');
const path = require('path');
const unzipper = require('unzipper');

const IP_V4_ZIP_FILE_URL = 'https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.CSV.ZIP';
const IP_V6_ZIP_FILE_URL =
  'https://download.ip2location.com/lite/IP2LOCATION-LITE-DB1.IPV6.CSV.ZIP';

// In order to reduce file size, instead of storing both range IPs,
// we store starting ip address and amount of ip addresses in the range
const encodeRange = (start, end) => {
  const startIpHex = BigInt(start).toString(16);
  const ipsCountHex = (BigInt(end) - BigInt(start)).toString(16);

  return `${startIpHex}+${ipsCountHex}`;
};

const createIpRangesFile = (name, ranges) => {
  const code = [
    `const ${name}: string[] = [`,
      ...ranges.map(([start, end]) => `  '${encodeRange(start, end)}',`),
    '];',
    '',
    `export default ${name};`
  ].join('\n');

  return fs.promises.writeFile(`src/${name}.ts`, code);
}

const updateRussianIps = async () => {
  const [ipV4Ranges, ipV6Ranges] = await Promise.all([
    fetchRussianIps(IP_V4_ZIP_FILE_URL),
    fetchRussianIps(IP_V6_ZIP_FILE_URL),
  ]);
  await Promise.all([
    createIpRangesFile('ipV4Ranges', ipV4Ranges),
    createIpRangesFile('ipV6Ranges', ipV6Ranges),
  ]);
};

const fetchRussianIps = async (zipFileUrl) => {
  const zipFilename = path.basename(zipFileUrl);
  const zipTempFilepath = '/' + zipFilename;
  const csvFilename = zipFilename.replace(/\.zip$/i, '');
  const csvFilepath = '/' + csvFilename;
  await download(zipFileUrl, memfs.createWriteStream(zipTempFilepath));
  await unzip(zipTempFilepath, csvFilename, csvFilepath);
  memfs.unlinkSync(zipTempFilepath);
  const csv = memfs.readFileSync(csvFilepath, 'utf-8');
  memfs.unlinkSync(csvFilepath);
  const { data } = Papa.parse(csv);
  const russianData = data.filter(([, , countryCode]) => countryCode === 'RU');
  const ranges = russianData.map(([start, end]) => [start, end]);
  return ranges;
};

const download = (url, outputStream) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
        reject();
        return;
      }

      response.pipe(outputStream);
      response.on('error', reject);
      response.on('end', resolve);
    });
    request.on('error', reject);
  });
};

const unzip = (zipFilepath, fileToExtract, outputFilepath) => {
  return memfs
    .createReadStream(zipFilepath)
    .pipe(unzipper.Parse())
    .on('entry', (entry) => {
      const fileName = entry.path;

      if (fileName === fileToExtract) {
        entry.pipe(memfs.createWriteStream(outputFilepath));
      } else {
        entry.autodrain();
      }
    })
    .promise();
};

updateRussianIps();
