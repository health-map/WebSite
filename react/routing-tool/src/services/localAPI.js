/**
 * @file localAPI.js
 * @description local api calls
 *
 */

import URLSearchParams from 'url-search-params';


/**
 *
 */
export async function loadCities({ companyAccess, accessToken }) {
  const url = new URL(window.location.origin);
  if (companyAccess !== 3) {
    url.pathname = '/routing/cities';
  } else {
    url.pathname = '/operator/filters/cities';
  }
  let response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
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
  const { payload: { data: { cities } } } = await response.json();
  return cities;
}

/**
 *
 */
export async function loadCompanies({ q, city }, { accessToken }) {
  const url = new URL(window.location.origin);
  url.pathname = '/operator/filters/companies';
  const searchParams = new URLSearchParams();
  searchParams.append('q', q);
  searchParams.append('status', 'active');
  if (city) {
    searchParams.append('geo_type', 'city');
    searchParams.append('geo_id', city);
  }
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
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
  const { payload: { data: { filters: companies } } } = await response.json();
  return companies.companies;
}

/**
 *
 */
export async function loadCouriersByQuery(
  { q, limit = 6, routeId, cityId, companyId },
  { accessToken }
) {
  const url = new URL(window.location.origin);
  url.pathname = `/operator/routes/${routeId}/couriers/search`;
  const query = {
    limit,
    name: q,
    cityId,
    companyId
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
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
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
  const contentType = response.headers.get('Content-Type');
  const mimeType = contentType.split(';')[0].trim();
  if (mimeType !== 'application/json') {
    throw new Error('invalid_content_type');
  }
  const { payload: { data: { couriers } } } = await response.json();
  return couriers;
}
