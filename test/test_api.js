const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const zcbc = require('../index');
const path = require('path');
const ZcomAPI = require('../lib/zcom-api');
const fs = require('fs');

chai.use(chaiAsPromised);
chai.should();

describe('api-interface', () => {
    const authToken = 'dc6Ys52Am4cs67NsANEDymkAexMdwsNjjm6aTFuCxgsxSTPRUUkAbdXuTzNYvXe8';
    const testTokenFile = path.join(__dirname, '.test-token');
    const apiRoot = 'https://cp.blockchain.z.com/api/v1';
    const apiClient = new ZcomAPI(apiRoot);

    before(() => {
        zcbc.setSecretFile(testTokenFile);
    });

    describe('confirm-token', () => {
        const dummyRes = { status: 0, message: 'Dummy successful response' };
        beforeEach(() => {
            nock(apiRoot)
                .post('/check-token', { authToken: authToken })
                .reply(200, dummyRes);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should call the api and return a fullfilled promise', () => {
            const res = apiClient.confirmToken(authToken);
            return res.should.be.fulfilled;
        });

        it('should call the api and return the response', () => {
            const res = apiClient.confirmToken(authToken);
            return res.should.become(dummyRes);
        });

        it('should not call the api and reject when there is invalid token', () => {
            const res = apiClient.confirmToken('DummyToken');
            return res.should.be.rejected;
        });
    });

    describe('register-new-cns', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 0, message: 'Dummy successful response' };
        beforeEach(() => {
            nock(apiRoot)
                .post('/cns', { address: dummyAddress, authToken: authToken })
                .reply(200, dummyRes);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should call the api and return a fullfilled promise', () => {
            const res = apiClient.registerCNSAddress(dummyAddress, authToken);
            return res.should.be.fulfilled;
        });

        it('should call the api and return the response', () => {
            const res = apiClient.registerCNSAddress(dummyAddress, authToken);
            return res.should.become(dummyRes);
        });

        it('should not call the api and reject when there is invalid token', () => {
            const res = apiClient.registerCNSAddress(dummyAddress, 'DummyToken');
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid address', () => {
            const res = apiClient.registerCNSAddress('dummyAdress', authToken);
            return res.should.be.rejected;
        });
    });

    describe('add-new-contract', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 0, message: 'Dummy successful response' };
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

        it('should call the api and return a fullfilled promise', () => {
            const res = apiClient.addContract(dummyAddress, dummyAbi, dummyGasLim, authToken);
            return res.should.be.fulfilled;
        });

        it('should call the api and return the response', () => {
            const res = apiClient.addContract(dummyAddress, dummyAbi, dummyGasLim, authToken);
            return res.should.become(dummyRes);
        });

        it('should not call the api and reject when there is invalid token', () => {
            const res = apiClient.addContract(dummyAddress, dummyAbi, dummyGasLim, 'DummyToken');
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid address', () => {
            const res = apiClient.addContract('dummyAdress', dummyAbi, dummyGasLim, authToken);
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid abi', () => {
            const res = apiClient.addContract(dummyAddress, [], dummyGasLim, authToken);
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid gasLimit', () => {
            const res = apiClient.addContract(dummyAddress, dummyAbi, 0, authToken);
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is gasLimit larger max limit', () => {
            const res = apiClient.addContract(dummyAddress, dummyAbi, 4000001, authToken);
            return res.should.be.rejected;
        });
    });

    describe('update-a-contract', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 0, message: 'Dummy successful response' };
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

        it('should call the api and return a fullfilled promise', () => {
            const res = apiClient.updateContract(dummyAddress, dummyAbi, dummyGasLim, authToken);
            return res.should.be.fulfilled;
        });

        it('should call the api and return the response', () => {
            const res = apiClient.updateContract(dummyAddress, dummyAbi, dummyGasLim, authToken);
            return res.should.become(dummyRes);
        });

        it('should not call the api and reject when there is invalid token', () => {
            const res = apiClient.updateContract(dummyAddress, dummyAbi, dummyGasLim, 'DummyToken');
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid address', () => {
            const res = apiClient.updateContract('dummyAdress', dummyAbi, dummyGasLim, authToken);
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid abi', () => {
            const res = apiClient.updateContract(dummyAddress, [], dummyGasLim, authToken);
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid gasLimit', () => {
            const res = apiClient.updateContract(dummyAddress, dummyAbi, 0, authToken);
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is gasLimit larger max limit', () => {
            const res = apiClient.updateContract(dummyAddress, dummyAbi, 4000001, authToken);
            return res.should.be.rejected;
        });
    });

    describe('provide-ether', () => {
        const dummyAddress = '0x123f681646d4a755815f9cb19e1acc8565a0c2ac';
        const dummyRes = { status: 0, message: 'Dummy successful response' };
        const dummyAmount = 168;

        beforeEach(() => {
            nock(apiRoot)
                .post('/provide-ether', { address: dummyAddress, ether: dummyAmount, authToken: authToken })
                .reply(200, dummyRes);
        });

        after(() => {
            nock.cleanAll();
        });

        it('should call the api and return a fullfilled promise', () => {
            const res = apiClient.provideEther(dummyAddress, dummyAmount, authToken);
            return res.should.be.fulfilled;
        });

        it('should call the api and return the response', () => {
            const res = apiClient.provideEther(dummyAddress, dummyAmount, authToken);
            return res.should.become(dummyRes);
        });

        it('should not call the api and reject when there is invalid token', () => {
            const res = apiClient.provideEther(dummyAddress, dummyAmount, 'DummyToken');
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid address', () => {
            const res = apiClient.provideEther('dummyAdress', dummyAmount, authToken);
            return res.should.be.rejected;
        });

        it('should not call the api and reject when there is invalid amount', () => {
            const res = apiClient.provideEther(dummyAddress, 0, authToken);
            return res.should.be.rejected;
        });
    });
});
