import { User } from "./user.types";

export type Team = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TeamWithMembers = Team & { users: User[] };

export type CreateTeamInput = {
  name: string;
  description?: string;
  teamMemberIds?: string[];
};

export type UpdateTeamInput = Partial<CreateTeamInput>;
