/**
 * @file remoteAPI.js
 * @description remote api calls
 *
 */

import URLSearchParams from 'url-search-params';
import { StatusesMapping } from './../constants';

/**
 *
 */
export async function splitRoute(
  {
    userId,
    routeId,
    deliveries,
    routes
  },
  { apiUrl, apiToken }
) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/split';
  let response;
  try {
    response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        routeId,
        routes,
        deliveries,
        reorderRoute: true,
        recalculatePrice: true
      })
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
  const { data: { jobs } } = await response.json();
  return jobs;
}

/**
 *
 */
export async function addDeliveriesToRoute(
  { author, routeId, deliveryId, reorderRoute, recalculatePrice, userId },
  { apiUrl, apiToken }
) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/add';
  let response;
  try {
    response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        author,
        routeId,
        deliveryId,
        reorderRoute,
        recalculatePrice,
        userId
      })
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
  const { data: { jobs } } = await response.json();
  return jobs;
}


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
export async function getSuggestionsForRoute(
  { routeId, timeArea, hoursAfter, hoursBefore },
  { apiUrl, apiToken }
) {
  const url = new URL(apiUrl);
  url.pathname = `/v1/routes/${routeId}/deliveries/suggestion`;
  const query = {
    time_area: timeArea,
    hours_after: hoursAfter,
    hours_before: hoursBefore
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
  const { data: { deliveries } } = await response.json();
  return deliveries;
}

/**
 *
 */
export async function removeDeliveryFromRoute(
  {
    author,
    routeId,
    deliveryId,
    reorderRoute,
    unassignShipper,
    recalculatePrice,
    userId
  },
  { apiUrl, apiToken }
) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/remove';
  let response;
  try {
    response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        author,
        routeId,
        deliveryId,
        reorderRoute,
        unassignShipper,
        recalculatePrice,
        userId
      })
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
  const { data: { jobs } } = await response.json();
  return jobs;
}

/**
 *
 */
export async function getJobsIdByUser({ userId }, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/jobs';
  const query = {
    userId
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
  const { data: { jobs } } = await response.json();
  return jobs;
}

/**
 *
 */
export async function cancelBackgroundJob({ jobId }, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/job/delete';
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId
      })
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
  const { message } = await response.json();
  return message;
}

/**
 *
 */
export async function createRoutes({ userId, routes }, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/create';
  let response;
  let responseBody;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        routes
      })
    });
  } catch (error) {
    throw new Error('load_failure');
  }
  if (response.status === 401) {
    window.location.replace('/logout');
  }
  if (response.status >= 400 && response.status < 500) {
    responseBody = await response.json();
    if (responseBody.error_data && 
      responseBody.error_data.deliveries && 
      responseBody.error_data.deliveries.length) {
      throw { // tasks with inconsistent status
        tasks: responseBody.error_data.deliveries,
        error: new Error('tasks_error')
      };
    }
    throw new Error('client_error');
  }
  if (response.status >= 500 && response.status < 600) {
    throw new Error('server_error');
  }
  const { data: { jobs } } = await response.json();
  return jobs;
}

/**
 *
 */
export async function reorderRouteRequest(
  { routeId, steps },
  { apiUrl, apiToken, userId }
) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes';
  let response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        routes: [{
          id: routeId,
          type: 'route',
          steps
        }],
        userId
      })
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
  const { message } = await response.json();
  return message;
}

/**
 *
 */
export async function createReturnDelivery(
  { routeId, receiver, products },
  { apiUrl, apiToken }
) {
  const url = new URL(apiUrl);
  url.pathname = `/v1/routes/return/${routeId}`;
  let response;
  try {
    response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receiver,
        products,
        insideARoute: true
      })
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
  const { message } = await response.json();
  return message;
}

/**
 *
 */
export async function sortRoute(
  { routeId, criteria, author },
  { apiUrl, apiToken }
) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/reorder';
  let response;
  try {
    response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        routeId,
        criteria,
        author,
        recalculatePrice: true
      })
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
  const { data: { jobs } } = await response.json();
  return jobs;
}

/**
 *
 */
export async function moveDeliveryToAnotherRoute({ 
  movements,
  userId
}, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/move';
  let response;
  try {
    response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        movements,
        userId
      })
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
  const { data: [{ jobs }] } = await response.json();
  return jobs;
}

/**
 *
 */
export async function mergeRoutes({ routeIds }, { apiUrl, apiToken, userId }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/merge';
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        routeIds: routeIds,
        userId
      })
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
  const { data: { jobs } } = await response.json();
  return jobs;
}

/**
 *
 */
export async function fixTimes({ routes }, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/reschedule';
  let response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        useEtas: 'true',
        routes
      })
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
  const { routes: routesResponse } = await response.json();
  return routesResponse;
}

/**
 *
 */
export async function clusterizeRoutes(
  {
    from,
    to,
    maxCapacities,
    maxDeliveriesPerRoute,
    cityId,
    userId,
    tags,
    companies,
    deliveries,
    routesGroups,
    useStrictTimeWindows
  },
  { apiUrl, apiToken }
) {
  const payload = {
    userId,
    city_id: cityId,
    from: (from * 1000),
    to: (to * 1000),
    max: Number(maxDeliveriesPerRoute),
    limit: 10000
  };
  if (maxCapacities) {
    payload.maxCapacities = maxCapacities;
  }
  if (tags && tags.length) {
    payload.tags = tags.map((tag) => {
      return tag.id;
    });
  }
  if (companies && companies.length) {
    payload.companies = companies.map((company) => {
      return company.id;
    });
  }
  if (deliveries && (deliveries.length || deliveries.size)) {
    payload.deliveries = deliveries.map((delivery) => {
      return delivery.id;
    });
  }
  if (routesGroups && routesGroups.length) {
    payload.routesGroups = routesGroups;
  }
  if (useStrictTimeWindows) {
    payload.useStrictTimeWindows = useStrictTimeWindows;
  }
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/clusterize';
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
  const { data: { jobs } } = await response.json();
  return jobs;
}

/**
 *
 */
export async function breakRoutes({ routeIds }, { apiUrl, apiToken, userId }) {
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/destroy';
  let response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        routes: routeIds,
        userId
      })
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
  const { data: { jobs } } = await response.json();
  return jobs;
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
export async function loadRoutes(
  {
    from,
    to,
    cities,
    companies,
    deliveries,
    statuses,
    tags
  },
  { apiUrl, apiToken }
) {
  const admittedStatuses = statuses.map((status) => {
    return StatusesMapping[status.id];
  }).filter((status) => status);
  const url = new URL(apiUrl);
  url.pathname = '/v1/routes/';
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
  if (routes.length &&
    routes[0].id === 'Single' &&
    routes[0].schedule.length &&
    admittedStatuses.length) {
    routes[0].schedule = routes[0].schedule.filter((step) => {
      return admittedStatuses.includes(step.data.status);
    });
  }
  return routes;
}

/**
 *
 */
export async function loadRouteInfo(routeId, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = `/v1/routes/${routeId}`;
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
  const { payload: { route } } = await response.json();
  return route;
}

/**
 *
 */
export async function assignRouteToCourier(
  { routeId, courierId, author },
  { apiUrl, apiToken }
) {
  const url = new URL(apiUrl);
  url.pathname = `/v1/routes/${routeId}/assign`;
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        courierId,
        author
      })
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
}
