
import Resource from './resource';
import Agent from './agent';

export default interface Adapter
{
    supports(contentType: string): boolean;

    accepts(): string;

    build(agent: Agent, url: string, accept: string, contentType: string, body: string);
}
