export type InvitationStatus = "pending" | "accepted" | "expired";

export type Invitation = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roleId: string;
  expiresAt: Date;
  token: string;
  userId: string;
  status: string;
  invitedById: string;
  acceptedAt: Date | null;
};
