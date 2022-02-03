interface FetchParam {
    method: HttpMethod;
    headers?: Headers;
    body?: string;
}

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export function fetchURL(url: string, httpMethod: HttpMethod, headers?: Headers, body?: Record<string, any>) {
    const params: FetchParam = {
        method: httpMethod
    }

    if(headers != null){
        params.headers = headers;
    }

    if (body != null) {
        params.body = JSON.stringify(body);
    }
    return fetch(url, params);
}


export const fetchUtil = (fetch: Promise<Response>, setData: (data:any)=> any, setLoading: (l: boolean)=>any, setError: (e: string)=> any) => {
    setLoading(true);
    fetch.then(async res => {
        setData(await res.json())
    }).catch(e => {
        console.error(e);
        setError(e);
    }).finally(()=>{
        setLoading(false);
    })
}