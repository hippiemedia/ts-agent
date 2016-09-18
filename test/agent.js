
import assert from 'assert';

import {Agent} from '../lib/agent';

describe('agent', function() {
    it('uses adapters and an http client', function() {
        new Agent([], function() {});
    });
});
