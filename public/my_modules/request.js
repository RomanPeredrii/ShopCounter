var log = console.log;

/* class for request*/

class Request {
    constructor(_url, _method, _headers) {
        this.url = _url
            ? _url
            : this._throwError('!!!!!!!!!001');// must be processed

        this.method = _method
            ? _method
            : 'POST'

        this.headers = _headers
            ? _headers
            : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
    };
    _throwError(error) {
        throw error;
    };

    makeRequest(body) {
        //log(this.url, this.method, this.headers, body)
        return fetch('/api/login', {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(body)
        }).then((resp) => resp.json());


    };

}

export default Request;