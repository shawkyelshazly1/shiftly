export type InvitationStatus = "pending" | "accepted" | "expired";

export type Invitation = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  roleId: string;
  expiresAt: string;
  token: string;
  userId: string;
  status: string;
  invitedById: string;
  acceptedAt: string | null;
};
