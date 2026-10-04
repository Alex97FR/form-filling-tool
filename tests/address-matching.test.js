const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Run the browser's real pure helpers without loading its UI or contacting APIs.
const source = fs.readFileSync(path.join(__dirname, '..', 'dashboard.js'), 'utf8');
const context = {};
const helpers = source.slice(source.indexOf('const compactKey ='), source.indexOf('const showRegionCacheStatus'));
const groups = source.slice(source.indexOf('const normalizeTransferGroup ='), source.indexOf('// Identity is scoped'));
vm.runInNewContext(source.match(/^const normalize = .*$/m)[0] + '\n' + source.match(/^const unique = .*$/m)[0]
  + '\n' + helpers + '\n' + groups + '\nglobalThis.logic = { resolveConfiguredAddress, sameCountry, findGroupRow, matchRegion, regionPathKey };', context);
const { resolveConfiguredAddress: resolve, sameCountry, findGroupRow, matchRegion } = context.logic;

// Representative rows copied from the user's 2026-10-04 hierarchy CSV.
const rows = [
  ['加蓬 Gabon', 'Estuaire Province', 'Libreville'],
  ['Gabon 加蓬', 'Libreville', '1-Nzeng ayong'],
  ['Gabon 加蓬', 'Libreville', '5-STFO'],
  ['Gabon 加蓬', 'Libreville', '13- stfo'],
  ['Gabon 加蓬', 'Libreville', '22- tout les pk ( pk5 , 6, 7 8,9,10, 11, 12, 13, 14, 15, 18, 18 et autres)'],
  ['刚果 Congo', 'Kongo-Central', 'Moanda / Muanda'],
  ['刚果 Congo', 'Lukunga', 'Gombe/LaGombe'],
  ['刚果 Congo', 'Tshopo', 'Kisangani(chef-lieu)'],
  ['RDC RDC', 'Kinshasa', "N'seleDelaNsele"],
  ['RDC RDC', 'Kinshasa', 'Masina'],
  ['刚果 Congo', 'Kongo-Central', 'Matadi'],
  ['刚果 Congo', 'Lomami', 'Kabinda'],
  ['刚果 Congo', 'Kasaï-Oriental', 'Kabinda'],
  ['刚果 Congo', 'Lubumbashi-Kapemba', 'Bel-Air I'],
  ['喀麦隆 Cameroun', 'Centre', 'Yaoundé VI'],
  ['喀麦隆 Cameroun', 'Centre', 'Yaoundé III'],
  ['科特迪瓦 Côte d’Ivoire', 'Tonkpi', 'Man'],
  ['科特迪瓦 Côte d’Ivoire', 'Man', 'Man']
];
const expectPath = (fields, expected) => {
  const result = resolve(fields, rows);
  assert.deepEqual(Array.from(result.addressRow || []), expected, JSON.stringify(fields));
};
expectPath({ country: 'Gabon', explicit_city: 'Libreville', explicit_quartier: 'Nzeng Ayong' }, rows[1]);
expectPath({ country: 'Gabon', explicit_city: 'Libreville', explicit_quartier: 'Nzengayong' }, rows[1]);
expectPath({ country: 'Gabon', explicit_city: 'Libreville', explicit_commune: 'Unnamed commune', explicit_quartier: 'Nzeng Ayong' }, rows[1]);
expectPath({ country: '加蓬', explicit_province: 'Estuaire', explicit_city: 'Libreville' }, rows[0]);
expectPath({ country: 'Gabon', explicit_city: 'Libreville', explicit_quartier: 'PK10' }, rows[4]);
expectPath({ country: 'RDC', explicit_city: 'Muanda' }, rows[5]);
expectPath({ country: 'RDC', explicit_city: 'La Gombe' }, rows[6]);
expectPath({ country: 'R.D Congo', explicit_city: 'Kisangani' }, rows[7]);
expectPath({ country: 'RDC', explicit_city: 'Nsele' }, rows[8]);
expectPath({ country: 'RDC', explicit_province: 'Kinshasa', explicit_commune: 'Masina', explicit_quartier: 'Matadi' }, rows[9]);
expectPath({ country: 'RDC', explicit_city: 'Lubumbashi', explicit_commune: 'Kapemba', explicit_quartier: 'Bel Air 1' }, rows[13]);
expectPath({ country: '喀麦隆', explicit_province: 'Centre', explicit_city: 'Yaounde 6' }, rows[14]);
expectPath({ country: 'RDC', explicit_province: 'Lomami', explicit_city: 'Kabinda' }, rows[11]);
assert.equal(resolve({ country: 'RDC', explicit_city: 'Kabinda' }, rows).addressRow, null);
assert.equal(resolve({ country: 'RDC', explicit_city: 'Kabinda' }, [...rows].reverse()).addressRow, null);
assert.equal(resolve({ country: "Cote d'Ivoire", explicit_city: 'Man' }, rows).addressRow, null);
assert.equal(resolve({ country: 'Gabon', explicit_city: 'Libreville', explicit_quartier: 'STFO' }, rows).addressRow, null);
assert.equal(resolve({ country: 'Cameroun', explicit_city: 'Yaounde' }, rows).addressRow, null);
assert.equal(sameCountry('Niger', '尼日利亚 Nigéria'), false);
assert.equal(sameCountry('Guinée', '赤道几内亚 Equatorial Guinea'), false);
assert.equal(sameCountry('加蓬 Gabon', 'Gabon 加蓬'), true);
assert.equal(sameCountry('喀麦隆', 'Cameroun'), true);
assert.equal(sameCountry('喀麦隆', '多哥'), false);
assert.equal(matchRegion('Yaounde 4', ['Yaoundé VI', 'Yaoundé III']), '');
assert.equal(findGroupRow([rows[11], rows[12]], 'Congo', '', 'Kabinda').found, null);
assert.equal(findGroupRow([rows[1]], 'Gabon', 'Libreville', 'Nzeng Ayong').source, 'Y→C');
assert.equal(findGroupRow([['刚果 Congo', 'Lomami', 'Nzengayong'], rows[1]], 'Gabon', 'Libreville', 'Nzengayong').found, rows[1]);
assert.equal(findGroupRow([rows[2], rows[3]], 'Gabon', 'Libreville', '5-STFO').found, rows[2]);
assert.equal(findGroupRow([rows[2], rows[3]], 'Gabon', 'Libreville', 'STFO').found, null);
if (process.argv[2]) {
  const hierarchy = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  let checked = 0;
  for (const row of hierarchy) {
    if (row[0] === '国家') continue;
    const result = resolve({ country: row[0], explicit_province: row[1], explicit_city: row[2] }, hierarchy);
    if (row[2]) assert.ok(result.addressRow, JSON.stringify(row));
    // 重音/大小写不同的重复行属于同一路径，保留配置中的原始显示名。
    assert.equal(context.logic.regionPathKey(result.addressRow || [result.country, result.province, result.city]), context.logic.regionPathKey(row), JSON.stringify(row));
    checked++;
  }
  console.log('Canonical hierarchy rows checked: ' + checked);
}
// Exercise the real write/cache flows; replace only their API and storage boundaries.
vm.runInNewContext(source.match(/^const quoteSheet = .*$/m)[0]
  + '\n' + source.slice(source.indexOf('const LLM_SYSTEM_PROMPT ='), source.indexOf('function parseModelJson'))
  + '\n' + source.slice(source.indexOf('const matchCategoryOption ='), source.indexOf('const PHONE_COUNTRY_CODES ='))
  + '\n' + source.slice(source.indexOf('const regionRowsHash ='), source.indexOf('async function readDropdownOptions'))
  + '\n' + source.slice(source.indexOf('async function analyzeReports'), source.indexOf('async function transferWithSheetsApi'))
  + '\nglobalThis.flows = { analyzeReports, syncRegionConfig };', context);
context.DEFAULT_GEMINI_MODEL = 'local-check';
context.log = () => {};
context.showRegionCacheStatus = () => {};
context.cacheTime = String;
const dropdown = { W: [...new Set(rows.map(row => row[0]))], X: [...new Set(rows.map(row => row[1]))], Y: [...new Set(rows.map(row => row[2]))] };
async function checkWrites(fields, currentPath = [], options = dropdown, fallback = { row: null }) {
  const current = [];
  [current[4], current[5], current[6]] = currentPath;
  const writes = [];
  let calls = 0;
  context.readValues = async (_token, _base, range) => ({ values: range.includes('!AL') ? [['Local test report']] : [current] });
  context.readDropdownColumnOptions = async () => [];
  context.repairMissingRegionDropdowns = async (_token, _base, _sheet, _start, _end, _rows, _tab, value) => value;
  context.callLlmWithRetry = async () => (++calls === 1 ? fields : fallback);
  context.sheetsRequest = async (_token, _url, request) => { writes.push(...JSON.parse(request.body).data); };
  await context.flows.analyzeReports('local', 'local', 'Target', rows, 'local', 'local', 3, 1, null, 'Regions', options);
  return { writes: Object.fromEntries(writes.filter(item => /![WXY]3$/.test(item.range)).map(item => [item.range.split('!')[1], item.values[0][0]])), calls };
}
async function checkFlows() {
  const fields = { country: 'Gabon', explicit_city: 'Libreville', explicit_quartier: 'Nzeng Ayong' };
  assert.deepEqual((await checkWrites(fields, [rows[0][0], rows[0][1], rows[1][2]])).writes, { W3: rows[1][0], X3: rows[1][1] });
  assert.deepEqual((await checkWrites(fields, rows[0])).writes, {}); // Preserve a complete valid existing path.
  assert.deepEqual((await checkWrites(fields, [], { ...dropdown, X: ['Estuaire Province'] })).writes, {});
  const ambiguous = await checkWrites({ country: 'Gabon', explicit_city: 'Libreville', explicit_quartier: 'STFO' });
  assert.equal(ambiguous.writes.Y3, undefined);
  assert.equal(ambiguous.calls, 1); // Ambiguity never triggers an AI tie-break.
  assert.deepEqual((await checkWrites({ country: 'Gabon', explicit_city: 'Libreville', explicit_quartier: 'STFO' }, ['Congo', 'Lomami', 'Kabinda'])).writes, {});
  const invalidChoice = await checkWrites({ country: 'Gabon', explicit_city: 'Unknown place' }, [], dropdown, { row: 999 });
  assert.equal(invalidChoice.writes.Y3, undefined);
  const scopedChoice = await checkWrites({ country: 'Gabon', explicit_province: 'Libreville', explicit_city: 'Unknown place' }, [], dropdown, { row: 0 });
  assert.equal(scopedChoice.writes.Y3, rows[1][2]);

  let stored = { regionConfigCache: { scope: 'test|Regions', rows: [rows[0]], rowCount: 1, syncedAt: Date.now() } };
  let reads = 0;
  context.extensionStorage = { local: {
    get: async () => stored,
    set: async values => { stored = { ...stored, ...values }; }
  } };
  context.readValues = async () => { reads++; return { values: [rows[1]] }; };
  assert.deepEqual(Array.from(await context.flows.syncRegionConfig('local', '/spreadsheets/test', 'Regions')), [rows[0]]);
  assert.equal(reads, 0);
  assert.deepEqual(Array.from(await context.flows.syncRegionConfig('local', '/spreadsheets/test', 'Regions', true)), [rows[1]]);
  assert.equal(reads, 1);
  context.readValues = async () => ({ values: [] });
  assert.deepEqual(Array.from(await context.flows.syncRegionConfig('local', '/spreadsheets/test', 'Regions', true)), [rows[1]]);
  console.log('Address matching, write consistency and cache refresh checks passed.');
}
checkFlows().catch(error => { console.error(error); process.exitCode = 1; });
