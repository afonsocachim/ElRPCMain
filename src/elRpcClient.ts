import { contextBridge, ipcRenderer } from 'electron';
import { ClientApi, RouterMap } from './elRpcTypes';

export const createClientObject = <T extends RouterMap>(routerMap: T) => {
  const localRouterMap: ClientApi<RouterMap> = {};
  Object.entries(routerMap).forEach(([routerName, routerObject]) => {
    localRouterMap[routerName] = { dispatchers: {}, handlers: {} };
    Object.entries(routerObject.handlers).forEach(([channelName]) => {
      const fullChannelName = `handlers//${routerName}//${channelName.toString()}`;
      localRouterMap[routerName].handlers[channelName] = async (
        ...args: any[]
      ) => {
        const payload = await ipcRenderer.invoke(fullChannelName as any, args);
        payload.data = JSON.parse(payload.data);
        return payload;
      };
    });
    Object.entries(routerObject.dispatchers).forEach(([channelName]) => {
      const fullChannelName = `dispatchers//${routerName}//${channelName.toString()}`;
      localRouterMap[routerName].dispatchers[channelName] = async (fn: any) => {
        ipcRenderer.on(
          fullChannelName as any,
          (event: any, stringified: unknown) => {
            return fn(event, JSON.parse(stringified as string));
          }
        );
      };
    });
  });

  return localRouterMap as ClientApi<T>;
};

export const enableContextBridge = <T extends RouterMap>(routerMap: T) => {
  const clientAPI = createClientObject<T>(routerMap);
  contextBridge.exposeInMainWorld('api', clientAPI);
  return clientAPI;
};
