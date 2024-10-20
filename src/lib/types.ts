export interface IapiResponse<T> {
    msg?: string;
    error?: string;
    data?: T;
}
