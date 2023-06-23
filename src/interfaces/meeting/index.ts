import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MeetingInterface {
  id?: string;
  title: string;
  date_time: any;
  team_leader_id: string;
  team_member_id: string;
  created_at?: any;
  updated_at?: any;

  user_meeting_team_leader_idTouser?: UserInterface;
  user_meeting_team_member_idTouser?: UserInterface;
  _count?: {};
}

export interface MeetingGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  team_leader_id?: string;
  team_member_id?: string;
}
