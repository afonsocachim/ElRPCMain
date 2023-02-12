import { BrowserWindow } from 'electron';
import { RouterMap, ServerApi } from './elRpcTypes';
export declare const initializeServer: <T extends RouterMap>(routerMap: T) => {
    addWindow: (win: BrowserWindow) => ServerApi<T> | undefined;
    get: () => ServerApi<T>;
};
