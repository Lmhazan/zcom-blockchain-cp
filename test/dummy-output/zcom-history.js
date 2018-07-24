const HISTORY_ADDRESS = "0xdummy99999999999999999999999999999999";
const HISTORY_ABI = [{"constant":true,"inputs":[],"name":"organizations","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nonces","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"histories","outputs":[{"name":"isCreated","type":"bool"},{"name":"allowGroupId","type":"bytes32"},{"name":"userDataObjectId","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gmoCns","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_gmoCns","type":"address"},{"name":"_organizations","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"getAddressGroupInstance","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getDataObjectInstance","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_objectId","type":"bytes32"},{"name":"_dataHash","type":"bytes32"}],"name":"createHistory","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_objectId","type":"bytes32"},{"name":"_dataHash","type":"bytes32"},{"name":"_nonce","type":"uint256"},{"name":"_sign","type":"bytes"}],"name":"createHistoryWithSign","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"remove","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_nonce","type":"uint256"},{"name":"_sign","type":"bytes"}],"name":"removeWithSign","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_organizationKey","type":"bytes32"}],"name":"addAllowGroup","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_organizationKey","type":"bytes32"},{"name":"_nonce","type":"uint256"},{"name":"_sign","type":"bytes"}],"name":"addAllowGroupWithSign","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_organizationKey","type":"bytes32"}],"name":"removeAllowGroup","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_organizationKey","type":"bytes32"},{"name":"_nonce","type":"uint256"},{"name":"_sign","type":"bytes"}],"name":"removeAllowGroupWithSign","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_patient","type":"address"},{"name":"_objectId","type":"bytes32"},{"name":"_dataHash","type":"bytes32"}],"name":"addRecord","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_patient","type":"address"},{"name":"_objectId","type":"bytes32"},{"name":"_dataHash","type":"bytes32"},{"name":"_nonce","type":"uint256"},{"name":"_sign","type":"bytes"}],"name":"addRecordWithSign","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_organizationKey","type":"bytes32"},{"name":"_patient","type":"address"}],"name":"isAllowGroup","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_patient","type":"address"}],"name":"getPatientDataObjectId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_patient","type":"address"},{"name":"_index","type":"uint256"}],"name":"getRecordObjectId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_patient","type":"address"}],"name":"getRecordLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_functionName","type":"bytes32"}],"name":"calcEnvHash","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_sign","type":"bytes"}],"name":"recoverAddress","outputs":[{"name":"recoverdAddr","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];