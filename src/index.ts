import {Axios} from "axios";

type TSearchResult = {
	fetch: string;
	count: number;
	data: any[];
	elapsed: string;
	error: {
		[key: string]: string;
	};
	facets: {
		[key: string]: any;
	};
	hits: number;
	max_score: number;
}

type TSearchRequest = {
	query?: {
		input?: string;
		strict?: boolean;
	};
	phrase?: {
		field?: string;
		terms?: any | null;
		boost?: number;
		fuzzyness?: number;
	};
	match_phrase?: {
		input?: string;
		field?: string;
		boost?: number;
		fuzzyness?: number;
	};
	pagination?: {
		offset?: number;
		limit?: number;
	};
	facets?: Array<{
		name?: string;
		field?: string;
		size?: number;
		type?: string;
		ranges?: Array<{
			identifier?: string;
			start?: number;
			end?: number;
		}>;
	}>;
	filter?: {
		[key: string]: any;
	};
	sort_by?: Array<{
		field?: string;
		order?: string;
	}>;
};

const defaultSearchRequest: TSearchRequest = {
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

export class Casper {
	private http: Axios;
	private abort: AbortController = new AbortController();
	constructor(url: string) {
		this.http = new Axios({
			baseURL: url,
			headers: {
				'Content-Type': 'application/json'
			},
			maxBodyLength: Infinity,
		});
		this.http.interceptors.request.use((config) => {
			config.headers["request-startTime"] = new Date().getTime();
			return config;
		})
		
		this.http.interceptors.response.use((response) => {
			const currentTime = new Date().getTime();
			const startTime = response.config.headers["request-startTime"];
			response.headers["request-duration"] = (currentTime - startTime).toFixed(2) + 'ms';
			return response;
		});
	}
	public search(index:string, obj: TSearchRequest): Promise<TSearchResult> {
		return new Promise((resolve, reject) => {
			this.abort.abort();
			this.abort = new AbortController();
			this.http.post("/search",JSON.stringify({
				index,
				search_request: {...defaultSearchRequest,...obj}
			}),{
				signal: this.abort.signal,
			}).then(({data, headers}) => {
				try {
					const parsed = JSON.parse(data);
					if (parsed?.search_result) {
						const res = parsed.search_result as TSearchResult;
						res.fetch = headers["request-duration"];
						resolve(res);
					} else {
						reject(parsed);
					}
				} catch (e) {
					reject(e);
				}
			}).catch(error => {
				if (error.code === "ERR_CANCELED"){
					return;
				}
				reject(error);
			});
		});
	}
}
