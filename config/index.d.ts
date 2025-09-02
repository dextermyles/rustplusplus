export namespace general {
    let language: string;
    let pollingIntervalMs: string | number;
    let showCallStackError: string | boolean;
    let reconnectIntervalMs: string | number;
    let rustAppId: number;
}
export namespace discord {
    let username: string;
    let clientId: string;
    let token: string;
    let needAdminPrivileges: string | boolean;
}
export namespace groq {
    let token_1: string;
    export { token_1 as token };
}
export namespace ruststats {
    let apiKey: string;
    let baseUrl: string;
}
export namespace steam {
    let apiKey_1: string;
    export { apiKey_1 as apiKey };
}
