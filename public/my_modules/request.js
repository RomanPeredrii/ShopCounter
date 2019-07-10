var log = console.log;

/* class for request*/

class Request {
    constructor(
        _method = 'POST',
        _headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }) {

        this.method = _method;
        this.headers = _headers;
    };

    _throwError(error) {
        throw error;
    };

    makeRequest(url, body) {
        if (!url) return this._throwError('!!!!!!!!!001');// must be processed
        return fetch(url, {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(body)
        }).then((resp) => resp.json());
    };
};

export default Request;