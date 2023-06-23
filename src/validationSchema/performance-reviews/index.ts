import * as yup from 'yup';

export const performanceReviewValidationSchema = yup.object().shape({
  review_date: yup.date().required(),
  feedback: yup.string().required(),
  team_leader_id: yup.string().nullable().required(),
  team_member_id: yup.string().nullable().required(),
});
