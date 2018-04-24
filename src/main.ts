import factory from './factory';

const agent = factory();

window['agent'] = agent;

export default factory;