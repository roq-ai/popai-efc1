import * as yup from 'yup';

export const meetingValidationSchema = yup.object().shape({
  title: yup.string().required(),
  date_time: yup.date().required(),
  team_leader_id: yup.string().nullable().required(),
  team_member_id: yup.string().nullable().required(),
});
