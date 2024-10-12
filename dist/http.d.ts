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
};
export declare class HttpClient {
    private http;
    constructor(url: string);
    search(obj: {
        [key: string]: any;
    }): Promise<TSearchResult>;
}
export {};
