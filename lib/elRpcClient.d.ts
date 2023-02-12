import { ClientApi, RouterMap } from './elRpcTypes';
export declare const createClientObject: <T extends RouterMap>(routerMap: T) => ClientApi<T>;
export declare const enableContextBridge: <T extends RouterMap>(routerMap: T) => ClientApi<T>;
