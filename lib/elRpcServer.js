"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeServer = void 0;
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
var electron_1 = require("electron");
var elRpcTypes_1 = require("./elRpcTypes");
var local = {
    routerMap: null,
    localServer: null,
};
var addWinddowToServer = function (routerMap, win) {
    if (local.routerMap)
        return local.routerMap;
    local.routerMap = {};
    Object.entries(routerMap).forEach(function (_a) {
        var routerName = _a[0], routerObject = _a[1];
        Object.entries(routerObject.handlers).forEach(function (_a) {
            var channel = _a[0], fn = _a[1];
            var channelName = "handlers//".concat(routerName, "//").concat(channel);
            electron_1.ipcMain.handle(channelName, function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
                var payload, newPayload, error_1, errorPayload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fn(event).apply(void 0, args)];
                        case 1:
                            payload = _a.sent();
                            newPayload = {
                                result: payload.result,
                                message: payload.message,
                                data: JSON.stringify(payload.data),
                            };
                            return [2 /*return*/, newPayload];
                        case 2:
                            error_1 = _a.sent();
                            errorPayload = {
                                result: elRpcTypes_1.PayloadResult.Failure,
                                message: error_1.message,
                                data: null,
                            };
                            return [2 /*return*/, errorPayload];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    Object.entries(routerMap).forEach(function (_a) {
        var routerName = _a[0], routerObject = _a[1];
        local.routerMap[routerName] = {};
        Object.entries(routerObject.dispatchers).forEach(function (_a) {
            var channel = _a[0], fn = _a[1];
            var channelName = "dispatchers//".concat(routerName, "//").concat(channel);
            local.routerMap[routerName][channel] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(void 0, void 0, void 0, function () {
                    var result, error_2, errorPayload;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                if (!win)
                                    throw Error('No window');
                                return [4 /*yield*/, fn.apply(void 0, args)];
                            case 1:
                                result = _a.sent();
                                win.webContents.send(channelName, JSON.stringify(result));
                                return [3 /*break*/, 3];
                            case 2:
                                error_2 = _a.sent();
                                errorPayload = {
                                    result: elRpcTypes_1.PayloadResult.Failure,
                                    message: error_2.message,
                                    data: null,
                                };
                                win.webContents.send(channelName, JSON.stringify(errorPayload));
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
        });
    });
    local.localServer = local.routerMap;
};
var getServerApi = function () {
    if (!local.localServer)
        throw Error('Please use addWindow before using get function');
    return local.localServer;
};
var initializeServer = function (routerMap) {
    return {
        addWindow: function (win) { return addWinddowToServer(routerMap, win); },
        get: function () { return getServerApi(); },
    };
};
exports.initializeServer = initializeServer;
