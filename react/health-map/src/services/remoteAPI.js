/**
 * @file remoteAPI.js
 * @description remote api calls
 *
 */

import URLSearchParams from 'url-search-params';

export async function loadDiseases(
  {
    q
  },
  { apiUrl, apiToken }
) {
  console.log(q);
  console.log(apiUrl);
  console.log(apiToken);

  var promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Enfermedades del sistema Digestivo',
          cie10: 'A09',
          type: 'disease'
        },
        {
          id: 2,
          name: 'Enfermedades del sistema Nervioso',
          cie10: 'X',
          type: 'agrupacion'
        },
        {
          id: 3,
          name: 'Enfermedades del sistema Respiratorio',
          cie10: 'XX',
          type: 'agrupacion'
        },
        {
          id: 4,
          name: 'Enfermedades del Ojo',
          cie10: 'XXI',
          type: 'agrupacion'
        },
        {
          id: 5,
          name: 'Enfermedades de la vista',
          cie10: 'J199',
          type: 'disease'
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
}


export async function loadGeozonesGroups(
  {
    q
  },
  { apiUrl, apiToken }
) {
  console.log(q);
  console.log(apiUrl);
  console.log(apiToken);

  var promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Zona con alto nivel de contaminacion',
          descripcion: 'Zonas con alto nivel de contaminacion dado por el smog del trafico vehicular. Monitorear: J45, A09',
          geozones: [1,2,3,4,5]
        },
        {
          id: 2,
          name: 'Zona de Riesgo por botaderos de Basura',
          descripcion: 'Zonas con muchos botaderos de basura cerca de zonas urbanas',
          geozones: [1,2,3]
        },
        {
          id: 3,
          name: 'Zona de Altura',
          descripcion: 'Zonas mas altas que el resto de la ciudad',
          geozones: [1,2]
        },
        {
          id: 4,
          name: 'Zona de Riesgo de Gripe en Invierno',
          descripcion: '',
          geozones: [1,2,3,4,5,8,9]
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
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
