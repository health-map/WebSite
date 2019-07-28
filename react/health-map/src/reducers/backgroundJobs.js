/**
 * @file backgroundJobs.js
 * @description Background Jobs reducer
 *
 */

import Immutable from 'immutable';

import { types } from './../actions/backgroundJobs';

const initialState = Immutable.Map({
  isMaximized: false,
  jobs: Immutable.List()
});

/**
 *
 */
const toggleDialog = (state) => {
  return state.set('isMaximized', !state.get('isMaximized'));
};

/**
 *
 */
const addBackgroundJob = (state, action) => {
  const { jobId, type, progress } = action.payload;
  if (state.get('jobs').filter(j => j.get('id') === jobId).size === 0) {
    return state.set(
      'jobs',
      state.get('jobs').push(Immutable.fromJS({
        id: jobId,
        type,
        progress
      }))
    );
  }
  return state;
};

/**
 *
 */
const updateBackgroundJob = (state, action) => {
  const { jobId, progress } = action.payload;
  return state.set(
    'jobs',
    state.get('jobs').update(
      state.get('jobs').findIndex(j => j.get('id') === jobId),
      (j) => j.set('progress', progress)
    )
  );
};

/**
 *
 */
const removeBackgroundJob = (state, action) => {
  const { jobId } = action.payload;
  return state.set(
    'jobs',
    state.get('jobs').filter(j => j.get('id') !== jobId)
  );
};


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export default function general(state = initialState, action) {
  switch (action.type) {
  case types.TOGGLE_DIALOG:
    return toggleDialog(state);
  case types.ADD_BACKGROUND_JOB:
    return addBackgroundJob(state, action);
  case types.UPDATE_BACKGROUND_JOB:
    return updateBackgroundJob(state, action);
  case types.REMOVE_BACKGROUND_JOB:
    return removeBackgroundJob(state, action);
  default:
    return state;
  }
}
