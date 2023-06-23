import * as yup from 'yup';

export const okrValidationSchema = yup.object().shape({
  objective: yup.string().required(),
  key_result: yup.string().required(),
  team_leader_id: yup.string().nullable().required(),
});
