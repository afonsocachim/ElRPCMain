# elRPC

- ElRPC implements remote procedure calls (RPC) for electron desktop applications using Inter Process Communication (IPC). It is written in Typescript and provides typesafety and autocompletion, so you can quickly and easily connect your frontend to your backend. 
- It is lightweight, with simple APIs and no external dependencies, so you can be sure that your applications will run smoothly. It's the perfect way to get your electron apps running quickly, and easily

# Getting Started

## Folder Structure

Recommend the use of https://github.com/electron-react-boilerplate/electron-react-boilerplate
The folder structure is as follows
![imagem](https://user-images.githubusercontent.com/96303137/218318197-a139ee4b-433d-4657-a28c-819cb9f322f8.png)


## Main process
Inside your main process folder create a file called api.ts where you will create your routerMap
A routerMap is composed of routers, and each router has handlers and dispatchers
*Handlers* are called by the renderer process and are executed on the main process that then responds
*Dispatchers* are sent by the main process to the renderer process

```Typescript
import { ClientApi, PayloadResult } from 'elRPC';

export const routerMap = {
  demoRouter: {
    handlers: {
      handleThis: () => async () => {
        return {
          message: 'Hello there General Kenobi',
          result: PayloadResult.Succcess,
          data: null,
        };
      },
    },
    dispatchers: {
      dispatchThis: async () => {
        return { message: 'Failed to dispatch', result: PayloadResult.Failure, data: null };
      },
    },
  },
};

export type ElClientAPI = ClientApi<typeof routerMap>;
```

Inside your main.ts add the following
```Typescript
const elServer = initializeServer(routerMap);
```

And after creating the mainWindow, add it to the server
```Typescript
const createWindow = async () => {
  // ...
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  elServer.addWindow(mainWindow);
  // ...
}
```

On your preload.ts inside your main process folder add the following

```
import { routerMap } from './api';
import { enableContextBridge } from 'elRPC';

enableContextBridge(routerMap);
```
## Renderer Process
On your renderer process folder add a preload.d.ts file with the following

```Typescript
import type { ElClientAPI } from '../main/api';

declare global {
  interface Window {
    api: ElClientAPI;
  }
}

export {};
```

## Demo
### Handlers
#### Main
Simply create the handler inside the router
#### Renderer
Access it on the renderer process in the following way
```Typescript
function Hello() {
  const helloThere = async () => {
    const payload = await window.api.demoRouter.handlers.handleThis();
    console.log(payload.message);
  };

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <button onClick={helloThere} type="button">
        Hello There
      </button>
    </div>
  );
}
```
### Dispatchers
#### Main
```Typescript
elServer.get().demoRouter.dispatchThis();
```
#### Renderer
```Typescript
window.api.demoRouter.dispatchers.dispatchThis((_, payload) => {
  console.log('Received', payload);
});
```
