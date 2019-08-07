/**
 * @file remoteAPI.js
 * @description remote api calls
 *
 */

//import URLSearchParams from 'url-search-params';


export async function loadCities({ apiUrl, apiToken }) {
  console.log(apiUrl);
  console.log(apiToken);

  var promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Guayaquil'
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
}

export async function loadInstitutions({ apiUrl, apiToken }) {
  const url = new URL(apiUrl);
  url.pathname = '/institutions';

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
    id: 99,
    name: 'TODAS'
  });

  return institutions;
}

export async function loadDepartments({ apiUrl, apiToken }) {
  console.log(apiUrl);
  console.log(apiToken);

  var promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'GENERAL'
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
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
    id: 99,
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
    type,
    department
  },
  { apiUrl, apiToken }
) {
  console.log(institution, gender, startDate, endDate, season, city);
  console.log(disease, geogroup, age, type, department, apiUrl, apiToken);
  console.log('holi');
  var promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Alborada',
          value: 4805,
          color: '#620808',
          coordinates: [
            [
              [
                -79.87386703491211,
                -2.1670513544934273
              ],
              [
                -79.90854263305664,
                -2.176657486097115
              ],
              [
                -79.89978790283203,
                -2.2078769896558996
              ],
              [
                -79.86339569091797,
                -2.200501011926227
              ],
              [
                -79.85910415649414,
                -2.168423662745808
              ],
              [
                -79.87386703491211,
                -2.1670513544934273
              ]
            ]
          ]
        },
        {
          id: 2,
          name: 'Mucho Lote',
          value: 3847,
          color: '#A53F3F',
          coordinates: [
            [
              [
                -79.90819931030273,
                -2.1301701068771766
              ],
              [
                -79.92811203002928,
                -2.160875951977666
              ],
              [
                -79.88605499267578,
                -2.148353530965763
              ],
              [
                -79.89601135253906,
                -2.1293123928781665
              ],
              [
                -79.90819931030273,
                -2.1301701068771766
              ]
            ]
          ]
        },
        {
          id: 3,
          name: 'Los Ceibos',
          value: 1843,
          color: '#F4CE74',
          coordinates: [
            [
              [
                -79.89680528640747,
                -2.2358581991813047
              ],
              [
                -79.89646196365356,
                -2.239117278679204
              ],
              [
                -79.89174127578735,
                -2.2389886309416256
              ],
              [
                -79.8912262916565,
                -2.238495481176313
              ],
              [
                -79.89096879959106,
                -2.235708109819491
              ],
              [
                -79.89680528640747,
                -2.2358581991813047
              ]
            ]
          ]
        },
        {
          id: 4,
          name: 'La Florida',
          value: 583,
          color: '#f7dda0',
          coordinates: [
            [
              [
                -79.89854335784912,
                -2.223186314817159
              ],
              [
                -79.89875793457031,
                -2.2226288351677694
              ],
              [
                -79.90566730499268,
                -2.2207419794080425
              ],
              [
                -79.9061393737793,
                -2.2228432504424447
              ],
              [
                -79.90922927856445,
                -2.2231005487309545
              ],
              [
                -79.91047382354736,
                -2.22558776320657
              ],
              [
                -79.9148941040039,
                -2.2267456029969406
              ],
              [
                -79.91433620452881,
                -2.2317200154431918
              ],
              [
                -79.91090297698975,
                -2.22957587420899
              ],
              [
                -79.90781307220459,
                -2.2293614599136964
              ],
              [
                -79.89738464355469,
                -2.2305621795649033
              ],
              [
                -79.8984146118164,
                -2.222800367389998
              ],
              [
                -79.89854335784912,
                -2.223186314817159
              ]
            ]
          ]
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
}
