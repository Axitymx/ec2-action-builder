import { expect } from 'chai';
import { ActionConfig } from '../../src/config/config';
import { Ec2Pricing } from '../../src/ec2/pricing';
import { runExternalIntegrationTests } from '../setup';
//import { faker } from '@faker-js/faker';

const describeIfIntegration = runExternalIntegrationTests ? describe : describe.skip;

describeIfIntegration('EC2 pricing tests', () => {
    const config = new ActionConfig()
    const ec2Pricing = new Ec2Pricing(config);

    it('get ec2 on-demand price', async () => {
        const c5Large = await ec2Pricing.getPriceForInstanceTypeUSD("c5.large")
        expect(c5Large).to.be.greaterThan(0)

        const t3Large = await ec2Pricing.getPriceForInstanceTypeUSD("t3.large")
        expect(await ec2Pricing.getPriceForInstanceTypeUSD("t3.large")).to.be.greaterThan(0)
        expect(t3Large).to.be.greaterThan(0)
        expect(c5Large).to.be.greaterThan(t3Large)

    });


});
