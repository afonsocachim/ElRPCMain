/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

export enum PayloadResult {
  Success,
  Failure,
}

export type PayloadSuccess = {
  result: PayloadResult.Success;
  message: string;
  data?: any;
};
export type PayloadFailure = {
  result: PayloadResult.Failure;
  message: string;
  data: null;
};

export type Payload = PayloadFailure | PayloadSuccess;

type IpcMainInvokeEvent = any;

type IpcRendererEvent = any;
export type EventFunction = (event: IpcRendererEvent, args: unknown[]) => void;
export type ElectronHandler = {
  ipcRenderer: {
    invoke(channel: string, args: unknown[]): Promise<any>;
    on(channel: string, fn: EventFunction): void;
  };
};

export type EventHandler = (
  event: IpcMainInvokeEvent
) => (...args: any[]) => Promise<Payload>;

type EventHandlerMap = {
  [x: string]: EventHandler;
};

type NoEventHandlerMap<T extends EventHandlerMap> = {
  [K in keyof T]: ReturnType<T[K]>;
};

export type Dispatcher = (...args: any[]) => Promise<Payload>;

type DispatcherMap = {
  [x: string]: Dispatcher;
};

type EventDispatcherMap<T extends DispatcherMap> = {
  [K in keyof T]: (
    n: (event: IpcRendererEvent, args: Awaited<ReturnType<T[K]>>) => void
  ) => void;
};

type ElRouter = {
  handlers: EventHandlerMap;
  dispatchers: DispatcherMap;
};

export type RouterMap = { [x: string]: ElRouter };
export type ServerApi<T extends RouterMap> = {
  [K in keyof T]: T[K]['dispatchers'];
};

export type ClientApi<T extends RouterMap> = {
  [K in keyof T]: {
    handlers: NoEventHandlerMap<T[K]['handlers']>;
    dispatchers: EventDispatcherMap<T[K]['dispatchers']>;
  };
};
