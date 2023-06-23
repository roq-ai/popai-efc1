import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PerformanceReviewInterface {
  id?: string;
  review_date: any;
  feedback: string;
  team_leader_id: string;
  team_member_id: string;
  created_at?: any;
  updated_at?: any;

  user_performance_review_team_leader_idTouser?: UserInterface;
  user_performance_review_team_member_idTouser?: UserInterface;
  _count?: {};
}

export interface PerformanceReviewGetQueryInterface extends GetQueryInterface {
  id?: string;
  feedback?: string;
  team_leader_id?: string;
  team_member_id?: string;
}
