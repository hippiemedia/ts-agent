
export default interface Response {
    url: string,
    status: any,
    contentType: string,
    getHeader: Function,
    body: any,
};
