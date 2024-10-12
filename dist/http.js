"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = require("axios");
class HttpClient {
    constructor(url) {
        this.http = new axios_1.Axios({
            baseURL: url
        });
    }
    search(obj) {
        return new Promise((resolve, reject) => {
            this.http.post("/search", obj).then(({ data }) => {
                return resolve(data.search_result);
            }).catch(error => {
                reject(error);
            });
        });
    }
}
exports.HttpClient = HttpClient;
