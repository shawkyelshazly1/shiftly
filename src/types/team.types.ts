import { User } from "./user.types";

export type Team = {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TeamWithMembers = Team & { teamMembers: User[] };

export type CreateTeamInput = { name: string; description?: string };

export type UpdateTeamInput = Partial<CreateTeamInput>;
