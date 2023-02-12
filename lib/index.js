"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableContextBridge = exports.initializeServer = void 0;
__exportStar(require("./elRpcTypes"), exports);
var elRpcServer_1 = require("./elRpcServer");
Object.defineProperty(exports, "initializeServer", { enumerable: true, get: function () { return elRpcServer_1.initializeServer; } });
var elRpcClient_1 = require("./elRpcClient");
Object.defineProperty(exports, "enableContextBridge", { enumerable: true, get: function () { return elRpcClient_1.enableContextBridge; } });
