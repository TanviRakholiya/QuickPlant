"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStatus = exports.apiResponse = void 0;
var apiResponse = /** @class */ (function () {
    function apiResponse(status, message, data, error) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
    return apiResponse;
}());
exports.apiResponse = apiResponse;
exports.userStatus = {
    user: "user",
    admin: "admin",
    upload: "upload"
};
