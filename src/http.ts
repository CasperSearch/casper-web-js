import {Axios} from "axios";

type TSearchResult = {
	cost: number;
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

export class HttpClient {
	private http: Axios;
	constructor(url: string) {
		this.http = new Axios({
			baseURL: url
		});
	}
	public search(obj: {[key: string]: any}): Promise<TSearchResult> {
		return new Promise((resolve, reject) => {
			this.http.post("/search", obj).then(({data}) => {
				return resolve(data.search_result as TSearchResult);
			}).catch(error => {
				reject(error);
			});
		});
	}
}