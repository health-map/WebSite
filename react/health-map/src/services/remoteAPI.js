/**
 * @file remoteAPI.js
 * @description remote api calls
 *
 */

import URLSearchParams from 'url-search-params';

export async function loadCities({ apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/cities';

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
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
  let { data: { cities } } = await response.json();

  return cities;
}

export async function loadInstitutions({ cityId }, { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/institutions';
  const searchParams = new URLSearchParams();
  searchParams.append('cityId', cityId);
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
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
  let { data: { institutions } } = await response.json();

  institutions.push({
    id: 9999,
    name: 'TODAS'
  });

  return institutions;
}

export async function loadDepartments( { institutionId },
  { apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/departments';
  const searchParams = new URLSearchParams();
  searchParams.append('institutionId', institutionId);
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
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
  let { data: { departments } } = await response.json();

  departments.push({
    id: 9999,
    name: 'TODOS'
  });

  return departments;
}

export async function loadAges({ apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/age';

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
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
  const { data: { ranges } } = await response.json();

  let ages = ranges.map((r) => {
    return {
      id: r.id,
      name: r.description.concat(': ', r.start_age, ' - ', r.end_age, ' ', r.period_type),
      description: r.description,
      r_name: r.name
    };
  });

  ages.push({
    id: 9999,
    name: 'TODOS'
  });

  return ages;
}

export async function loadGenders() {
  const gendersOptions = [
    {
      id: 1,
      name: 'M' 
    },
    {
      id: 2,
      name: 'F' 
    },
    {
      id: 3,
      name: 'TODOS'
    }
  ];
  return gendersOptions;
}

export async function loadDiseases(
  {
    q
  },
  { apiUrl, apiToken }
) {

  const url = new URL(apiUrl);
  const searchParams = new URLSearchParams();
  url.pathname = '/diseases';
  searchParams.append('q', q);
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
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
  const { data } = await response.json();

  return data;
}


export async function loadGeozonesGroups(
  {
    q
  },
  { apiUrl, apiToken }
) {

  const url = new URL(apiUrl);
  const searchParams = new URLSearchParams();
  url.pathname = '/geogroups';
  searchParams.append('q', q);
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
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
  const { data: { geogroups } } = await response.json();

  return geogroups;
}

export async function createGeozoneGroup(
  {
    name, description, geofences
  },
  { apiUrl, apiToken }
) {

  const url = new URL(apiUrl);
  url.pathname = '/geogroups';
  let response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        geogroup: {
          name,
          description,
          geofences
        }
      })
    });
  } catch (error) {
    console.log(error);
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
export async function loadIncidences(
  {
    institution,
    gender,
    startDate,
    endDate,
    season,
    city,
    disease,
    geogroup,
    age,
    department
  },
  { apiUrl, apiToken }
) {
  console.log(season);
  console.log(age, gender);
  const url = new URL(apiUrl);
  const searchParams = new URLSearchParams();
  url.pathname = '/incidences';
  if (city && city.id) {
    searchParams.append('city', city.id);
  }
  if (institution && institution.id && institution.name !== 'TODAS') {
    searchParams.append('institution', institution.id);
  }
  if (department && department.id && department.name !== 'TODOS') {
    searchParams.append('department', department.id);
  }
  if (geogroup && geogroup.id) {
    searchParams.append('geoGroup', geogroup.id);
  }
  if (disease && disease.id) {
    if (disease.type === 'aggregation') {
      searchParams.append('categoryGroup', disease.id);
    } else {
      searchParams.append('cie10', disease.id);
    }
  }
  if (gender && gender.name !== 'TODOS') {
    searchParams.append('gender', gender.name);
  }
  if (age && age.id && age.name !== 'TODOS') {
    console.log('age');
    //searchParams.append('ageRange', age.id);
  }
  if (startDate && endDate) {
    searchParams.append('startDate', startDate);
    //searchParams.append('endDate', endDate);
  }
  url.search = searchParams.toString();
  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.log(err);
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
  const { data: { incidences } } = await response.json();

  return {
    incidences: incidences,
    geojson: {
      type: 'FeatureCollection',
      features: incidences.map((incidence) => {
        return {
          type: 'Feature',
          properties: {
            metrics: {
              absolute: Number(incidence.absolute),
              relativeToPopulation: Number(incidence.relative_to_population),
              every1000Inhabitants: Number(incidence.every_1000_inhabitants),
              relativeToPatients: Number(incidence.relative_to_patients)
            },
            geofence_name: incidence.geofence_name,
            id: incidence.id,
            isVisible: true
          },
          geometry: incidence.polygon
        };
      })
    }
  };
}
