"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Casper = void 0;
const axios_1 = require("axios");
const defaultSearchRequest = {
    query: {
        input: "",
        strict: false,
    },
    phrase: {
        field: "",
        terms: null,
        boost: 0,
        fuzzyness: 0,
    },
    match_phrase: {
        input: "",
        field: "",
        boost: 0,
        fuzzyness: 0,
    },
    pagination: {
        offset: 0,
        limit: 10,
    },
    facets: [],
    filter: {},
    sort_by: [],
};
class Casper {
    constructor(url) {
        this.abort = new AbortController();
        this.http = new axios_1.Axios({
            baseURL: url,
            headers: {
                'Content-Type': 'application/json'
            },
            maxBodyLength: Infinity,
        });
        this.http.interceptors.request.use((config) => {
            config.headers["request-startTime"] = new Date().getTime();
            return config;
        });
        this.http.interceptors.response.use((response) => {
            const currentTime = new Date().getTime();
            const startTime = response.config.headers["request-startTime"];
            response.headers["request-duration"] = (currentTime - startTime).toFixed(2) + 'ms';
            return response;
        });
    }
    search(index, obj) {
        return new Promise((resolve, reject) => {
            this.abort.abort();
            this.abort = new AbortController();
            this.http.post("/search", JSON.stringify({
                index,
                search_request: Object.assign(Object.assign({}, defaultSearchRequest), obj)
            }), {
                signal: this.abort.signal,
            }).then(({ data, headers }) => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed === null || parsed === void 0 ? void 0 : parsed.search_result) {
                        const res = parsed.search_result;
                        res.fetch = headers["request-duration"];
                        resolve(res);
                    }
                    else {
                        reject(parsed);
                    }
                }
                catch (e) {
                    reject(e);
                }
            }).catch(error => {
                if (error.code === "ERR_CANCELED") {
                    return;
                }
                reject(error);
            });
        });
    }
}
exports.Casper = Casper;
