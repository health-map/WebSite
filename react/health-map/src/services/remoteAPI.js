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
        },
        {
          id: 2,
          name: 'Quito'
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
}

export async function loadInstitutions({ apiUrl, apiToken }) {
  console.log(apiUrl);
  console.log(apiToken);

  var promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Hospital Leon Becerra'
        },
        {
          id: 2,
          name: 'Gil Gilbert'
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
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
  console.log(apiUrl);
  console.log(apiToken);

  var promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: '0 - 12 meses' 
        },
        {
          id: 2,
          name: '1 - 2 años' 
        },
        {
          id: 3,
          name: '2 - 10 años'
        },        
        {
          id: 4,
          name: '10 - 18 años'
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
}

export async function loadGenders({ apiUrl, apiToken }) {
  console.log(apiUrl);
  console.log(apiToken);

  var promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
}

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
          color: '#aaa'
        },
        {
          id: 2,
          name: 'Mucho Lote',
          value: 3847,
          color: '#bbb'
        },
        {
          id: 3,
          name: 'Los Ceibos',
          value: 1843,
          color: '#ccc'
        },
        {
          id: 4,
          name: 'La Florida',
          value: 583,
          color: '#ddd'
        }
      ]);
    }, 2000);
  });
  let x = await promise;
  console.log(x);
  return x;
}
