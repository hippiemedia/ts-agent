
import Resource from './resource';
import Agent from './agent';
import Response from './client/response';

export default interface Adapter
{
    supports(contentType: string): boolean;

    accepts(): string;

    build(agent: Agent, response: Response, accept: string): Resource;
}
