/* eslint-disable import/prefer-default-export */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import { BrowserWindow, ipcMain } from 'electron';
import {
  Payload,
  PayloadFailure,
  PayloadResult,
  RouterMap,
  ServerApi,
} from './elRpcTypes';

type LocalG = {
  routerMap: any;
  localServer: ServerApi<any> | null;
};

const local: LocalG = {
  routerMap: null,
  localServer: null,
};

const addWinddowToServer = <T extends RouterMap>(
  routerMap: T,
  win: BrowserWindow
) => {
  if (local.routerMap) return local.routerMap as ServerApi<T>;
  local.routerMap = {};

  Object.entries(routerMap).forEach(([routerName, routerObject]) => {
    Object.entries(routerObject.handlers).forEach(([channel, fn]) => {
      const channelName = `handlers//${routerName}//${channel}`;
      ipcMain.handle(channelName, async (event, args) => {
        try {
          const payload: Payload = await fn(event)(...args);
          const newPayload: {
            result: PayloadResult;
            message: string;
            data: any;
          } = {
            result: payload.result,
            message: payload.message,
            data: JSON.stringify(payload.data),
          };
          return newPayload as typeof payload;
        } catch (error) {
          const errorPayload: PayloadFailure = {
            result: PayloadResult.Failure,
            message: (error as Error).message,
            data: null,
          };
          return errorPayload;
        }
      });
    });
  });

  Object.entries(routerMap).forEach(([routerName, routerObject]) => {
    local.routerMap[routerName] = {};
    Object.entries(routerObject.dispatchers).forEach(([channel, fn]) => {
      const channelName = `dispatchers//${routerName}//${channel}`;
      local.routerMap[routerName][channel] = async (...args: any[]) => {
        try {
          if (!win) throw Error('No window');
          const result = await fn(...args);
          win.webContents.send(channelName, JSON.stringify(result));
        } catch (error) {
          const errorPayload: PayloadFailure = {
            result: PayloadResult.Failure,
            message: (error as Error).message,
            data: null,
          };
          win.webContents.send(channelName, JSON.stringify(errorPayload));
        }
      };
    });
  });
  local.localServer = local.routerMap as ServerApi<T>;
};

const getServerApi = <T extends RouterMap>() => {
  if (!local.localServer)
    throw Error('Please use addWindow before using get function');

  return local.localServer as ServerApi<T>;
};

export const initializeServer = <T extends RouterMap>(routerMap: T) => {
  return {
    addWindow: (win: BrowserWindow) => addWinddowToServer(routerMap, win),
    get: () => getServerApi<T>(),
  };
};
