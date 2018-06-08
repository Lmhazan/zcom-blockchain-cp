
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const zcbc = require('../index');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

chai.use(chaiAsPromised);
chai.should();

const outputPath = path.join(__dirname, 'output');
const testTokenFile = path.join(__dirname, '.test-token');

function deleteFilesInDir(delPath) {
    return fs.readdirAsync(delPath)
        .then(files => {
            let processes = [];
            for (const f of files) {
                processes.push(fs.unlinkAsync(path.join(outputPath, f)));
            }

            return Promise.all[processes];
        });
}

describe('programming-interface', () => {
    const authToken = 'dc6Ys52Am4cs67NsANEDymkAexMdwsNjjm6aTFuCxgsxSTPRUUkAbdXuTzNYvXe8';
    const apiRoot = 'https://cp.blockchain.z.com/api/v1';

    before(() => {
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }

        zcbc.setSecretFile(testTokenFile);
        zcbc.setOutputPath(outputPath);
    });

    describe('register-new-cns', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 0, message: 'Dummy successful response' };
        let mockReq;
        beforeEach(() => {
            mockReq = nock(apiRoot)
                .post('/cns', { address: dummyAddress, authToken: authToken })
                .reply(200, dummyRes);
        });

        afterEach(() => {
            return deleteFilesInDir(outputPath);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should return a fullfilled promise', () => {
            const res = zcbc.registerCNS(dummyAddress);
            return res.should.be.fulfilled;
        });

        it('should call the api', () => {
            return zcbc.registerCNS(dummyAddress).then(() => mockReq.done());
        });

        it('should create the output file if save file is true', () => {
            return zcbc.registerCNS(dummyAddress, true)
                .then(() => {
                    let cnsFilePath = path.join(outputPath, 'zcom-cns.js');
                    fs.existsSync(cnsFilePath).should.equal(true);
                });
        });
    });

    describe('register-new-cns-fail', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 1, message: 'Dummy failed response' };

        beforeEach(() => {
            nock(apiRoot)
                .post('/cns', { address: dummyAddress, authToken: authToken })
                .reply(200, dummyRes);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should return a rejected promise', () => {
            return zcbc.registerCNS(dummyAddress)
                .catch(res => {
                    return res.should.be.rejected;
                });
        });
    });

    describe('add-new-contract', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 0, message: 'Dummy successful response' };
        const dummyAbi = fs.readFileSync(path.join(__dirname, 'dummy-abi'), 'utf8');
        const dummyGasLim = 9000;
        let mockReq;

        beforeEach(() => {
            mockReq = nock(apiRoot)
                .post('/contracts', { address: dummyAddress, abi: dummyAbi, gasLimit: dummyGasLim, authToken: authToken })
                .reply(200, dummyRes);
        });

        afterEach(() => {
            return deleteFilesInDir(outputPath);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should return a fullfilled promise', () => {
            const res = zcbc.addContract(dummyAddress, dummyAbi, dummyGasLim);
            return res.should.be.fulfilled;
        });

        it('should call the api', () => {
            const res = zcbc.addContract(dummyAddress, dummyAbi, dummyGasLim);
            return res.then(() => mockReq.done());
        });

        it('should create the output file if save file is true', () => {
            return zcbc.addContract(dummyAddress, dummyAbi, dummyGasLim, true, 'AddContract')
                .then(() => {
                    let contractFile = path.join(outputPath, 'zcom-addcontract.js');
                    fs.existsSync(contractFile).should.equal(true);
                });
        });

        it('should not create the file when there is no file name provided', () => {
            return zcbc.addContract(dummyAddress, dummyAbi, dummyGasLim, true)
                .then(() => {
                    let contractFile = path.join(outputPath, 'zcom-addcontract.js');
                    fs.existsSync(contractFile).should.equal(false);
                });
        });
    });

    describe('add-new-contract-fail', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 1, message: 'Dummy failed response' };
        const dummyAbi = fs.readFileSync(path.join(__dirname, 'dummy-abi'), 'utf8');
        const dummyGasLim = 9000;

        beforeEach(() => {
            nock(apiRoot)
                .post('/contracts', { address: dummyAddress, abi: dummyAbi, gasLimit: dummyGasLim, authToken: authToken })
                .reply(200, dummyRes);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should return a rejected promise', () => {
            return zcbc.addContract(dummyAddress, dummyAbi, dummyGasLim)
                .catch(res => {
                    return res.should.be.rejected;
                });
        });
    });

    describe('update-a-contract', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 0, message: 'Dummy successful response' };
        const dummyAbi = fs.readFileSync(path.join(__dirname, 'dummy-abi'), 'utf8');
        const dummyGasLim = 9000;
        let mockReq;

        beforeEach(() => {
            mockReq = nock(apiRoot)
                .put(`/contracts/${dummyAddress}`, { abi: dummyAbi, gasLimit: dummyGasLim, authToken: authToken })
                .reply(200, dummyRes);
        });

        afterEach(() => {
            return deleteFilesInDir(outputPath);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should return a fullfilled promise', () => {
            const res = zcbc.updateContract(dummyAddress, dummyAbi, dummyGasLim);
            return res.should.be.fulfilled;
        });

        it('should call the api', () => {
            const res = zcbc.updateContract(dummyAddress, dummyAbi, dummyGasLim);
            return res.then(() => mockReq.done());
        });

        it('should create the output file if save file is true', () => {
            return zcbc.updateContract(dummyAddress, dummyAbi, dummyGasLim, true, 'UpdateContract')
                .then(() => {
                    let contractFile = path.join(outputPath, 'zcom-updatecontract.js');
                    fs.existsSync(contractFile).should.equal(true);
                });
        });

        it('should not create the file when there is no file name provided', () => {
            return zcbc.updateContract(dummyAddress, dummyAbi, dummyGasLim, true)
                .then(() => {
                    let contractFile = path.join(outputPath, 'zcom-updatecontract.js');
                    fs.existsSync(contractFile).should.equal(false);
                });
        });
    });

    describe('update-a-contract-fail', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 1, message: 'Dummy failed response' };
        const dummyAbi = fs.readFileSync(path.join(__dirname, 'dummy-abi'), 'utf8');
        const dummyGasLim = 9000;

        beforeEach(() => {
            nock(apiRoot)
                .put(`/contracts/${dummyAddress}`, { abi: dummyAbi, gasLimit: dummyGasLim, authToken: authToken })
                .reply(200, dummyRes);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should return a rejected promise', () => {
            return zcbc.updateContract(dummyAddress, dummyAbi, dummyGasLim)
                .catch(res => {
                    return res.should.be.rejected;
                });
        });
    });

    describe('provide-ether', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 0, message: 'Dummy successful response' };
        const dummyAmount = 168;
        let mockReq;

        beforeEach(() => {
            mockReq = nock(apiRoot)
                .post('/provide-ether', { address: dummyAddress, ether: dummyAmount, authToken: authToken })
                .reply(200, dummyRes);
        });

        after(() => {
            nock.cleanAll();
        });

        it('it should return a fullfilled promise', () => {
            const res = zcbc.provideEther(dummyAddress, dummyAmount);
            return res.should.be.fulfilled;
        });

        it('should call the api', () => {
            return zcbc.provideEther(dummyAddress, dummyAmount).then(() => mockReq.done());
        });
    });

    describe('provide-ether-failed', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 1, message: 'Dummy failed response' };
        const dummyAmount = 168;

        beforeEach(() => {
            nock(apiRoot)
                .post('/provide-ether', { address: dummyAddress, ether: dummyAmount, authToken: authToken })
                .reply(200, dummyRes);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should return a rejected promise', () => {
            return zcbc.provideEther(dummyAddress, dummyAmount)
                .catch(res => {
                    return res.should.be.rejected;
                });
        });
    });
});
