
import { createAction } from 'redux-actions';

/**
 *
 */
export const types = {
  TOGGLE_DIALOG: 'BACKGROUND_JOBS/TOGGLE_DIALOG',
  ADD_BACKGROUND_JOB: 'BACKGROUND_JOBS/ADD_BACKGROUND_JOB',
  UPDATE_BACKGROUND_JOB: 'BACKGROUND_JOBS/UPDATE_BACKGROUND_JOB',
  REMOVE_BACKGROUND_JOB: 'BACKGROUND_JOBS/REMOVE_BACKGROUND_JOB'
};

/**
 *
 */
export const actions = {
  toggleDialog: createAction(
    types.TOGGLE_DIALOG
  ),
  addBackgroundJob: createAction(
    types.ADD_BACKGROUND_JOB,
    (jobId, type, progress) => ({ jobId,
      type,
      progress })
  ),
  updateBackgroundJob: createAction(
    types.UPDATE_BACKGROUND_JOB,
    (jobId, progress) => ({ jobId,
      progress })
  ),
  removeBackgroundJob: createAction(
    types.REMOVE_BACKGROUND_JOB,
    (jobId) => ({ jobId })
  )
};
