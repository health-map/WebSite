/**
 * @file remoteAPI.js
 * @description remote api calls
 *
 */

import URLSearchParams from 'url-search-params';


/**
 *
 */
export async function searchDeliveries({ q, draw }, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/deliveries/search';
  const query = {
    q,
    draw
  };
  const searchParams = new URLSearchParams();
  Object.keys(query)
    .filter(key => query[key])
    .forEach(key => searchParams.append(key, query[key]));
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw new Error('load_failure');
  }
  if (response.status === 401) {
    window.location.replace('/logout');
  }
  if (response.status >= 400 && response.status < 500) {
    throw new Error('client_error');
  }
  if (response.status >= 500 && response.status < 600) {
    throw new Error('server_error');
  }
  const { data } = await response.json();
  return data;
}

/**
 *
 */
export async function loadTags({ q, companies }, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/tags';
  const searchParams = new URLSearchParams();
  searchParams.append('q', q);
  if (companies && companies.length) {
    searchParams.append('companyId', companies.join(','));
  }
  searchParams.append('status', 'active');
  searchParams.append('type', 'routing');
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw new Error('load_failure');
  }
  if (response.status === 401) {
    window.location.replace('/logout');
  }
  if (response.status >= 400 && response.status < 500) {
    throw new Error('client_error');
  }
  if (response.status >= 500 && response.status < 600) {
    throw new Error('server_error');
  }
  let { data: { tags } } = await response.json();
  tags = tags.map((tag) => {
    tag.displayName = `${tag.name} - ${tag.companyName}`;
    return tag;
  });
  return tags;
}

/**
 *
 */
export async function loadDeliveries({ q, companies }, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/deliveries/search';
  const searchParams = new URLSearchParams();
  if (q.length === 0) {
    return;
  }
  searchParams.append('q', encodeURIComponent(q).replace(/%2C/g,','));
  if (companies && companies.length) {
    searchParams.append('company', companies.join(','));
  }
  searchParams.append('type', 'routing');
  searchParams.append('page', '1');
  searchParams.append('length', '200');
  searchParams.append('fields', 'id');
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw new Error('load_failure');
  }
  if (response.status === 401) {
    window.location.replace('/logout');
  }
  if (response.status >= 400 && response.status < 500) {
    throw new Error('client_error');
  }
  if (response.status >= 500 && response.status < 600) {
    throw new Error('server_error');
  }
  const { data: { deliveries } } = await response.json();
  return deliveries;
}

/**
 *
 */
export async function loadIncidences(
  {
    from,
    to,
    cities,
    companies,
    deliveries,
    tags
  },
  { apiUrl, apiToken }
) {

  const url = new URL(apiUrl);
  url.pathname = '/v1/incidences/';
  const searchParams = new URLSearchParams();
  searchParams.append('from', from);
  searchParams.append('to', to);
  if (cities && cities.length) {
    cities.map((city) => {
      searchParams.append('cities[]', city);
    });
  }
  if (companies && companies.length) {
    companies.map((company) => {
      searchParams.append('companies[]', company.id);
    });
  }
  if (deliveries && deliveries.length) {
    deliveries.map((delivery) => {
      searchParams.append('deliveries[]', delivery.id);
    });
  }
  if (tags && tags.length) {
    tags.map((tag) => {
      searchParams.append('tags[]', tag.id);
    });
  }
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    throw new Error('load_failure');
  }
  if (response.status === 401) {
    window.location.replace('/logout');
  }
  if (response.status >= 400 && response.status < 500) {
    throw new Error('client_error');
  }
  if (response.status >= 500 && response.status < 600) {
    throw new Error('server_error');
  }
  const { payload: { routes } } = await response.json();

  return routes;
}
