import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OkrInterface {
  id?: string;
  objective: string;
  key_result: string;
  team_leader_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface OkrGetQueryInterface extends GetQueryInterface {
  id?: string;
  objective?: string;
  key_result?: string;
  team_leader_id?: string;
}
