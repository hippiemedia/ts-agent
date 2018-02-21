
import Builder from './resource/builder';

interface Adapter
{
    supports(contentType: string): boolean;

    accepts(): string;

    build(builder: Builder, text: string);

    fromObject(builder: Builder, content);
}

export default Adapter;
