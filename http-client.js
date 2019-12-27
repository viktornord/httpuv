const querystring = require('querystring');
const URL = require('url');
const https = require('https');

const RESPONSE_TYPES = {
  JSON: 'application/json',
  TEXT: 'text/html',
};

function request(url, {
  method = 'GET', query: params, headers = {}, data,
} = {}) {
  const strigifiedParams = querystring.stringify(params);
  return new Promise((resolve, reject) => {
    const {
      path, hostname, port, query,
    } = URL.parse(url);
    const requestInst = https.request({
      hostname,
      port,
      path,
      method,
      headers,
      query: [query, strigifiedParams].filter(val => val).join('&'),
    }, (res) => {
      const responseType = res['content-type'] || RESPONSE_TYPES.JSON;
      let rawResponse = Buffer.from([]);
      res
        .on('data', (newData) => {
          rawResponse = Buffer.concat([rawResponse, newData]);
        })
        .on('error', reject)
        .on('end', () => {
          try {
            resolve(handleResponse({ statusCode: res.statusCode, rawResponse, responseType }));
          } catch (error) {
            reject(error);
          }
        });
    }).on('error', reject);
    if (data) {
      requestInst.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    requestInst.end();
  });
}

function handleResponse({ statusCode, responseType, rawResponse }) {
  const handleResponseByStatus = (responseData) => {
    if (statusCode >= 400) {
      throw responseData;
    }
    return responseData;
  };
  const rawData = rawResponse.toString();
  if (responseType.includes(RESPONSE_TYPES.JSON)) {
    let response;
    try {
      response = rawData && JSON.parse(rawData);
    } catch (e) {
      throw statusCode >= 400 ? rawData : e;
    }
    return handleResponseByStatus(response);
  }
  if (responseType.includes(RESPONSE_TYPES.TEXT)) {
    return handleResponseByStatus(rawData);
  }
  return handleResponseByStatus(rawResponse);
}

const httpClient = {
  get(url, { headers, query } = {}) {
    return request(url, { headers, query });
  },
  post(url, { headers, query, body: data } = {}) {
    return request(url, {
      method: 'POST', headers, query, data,
    });
  },
  put(url, { headers, query, body: data } = {}) {
    return request(url, {
      method: 'PUT', headers, query, data,
    });
  },
  patch(url, { headers, query, body: data } = {}) {
    return request(url, {
      method: 'PATCH', headers, query, data,
    });
  },
  delete(url, { headers, query } = {}) {
    return request(url, { method: 'DELETE', headers, query });
  },
};

module.exports = httpClient;
