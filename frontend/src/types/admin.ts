import type { AppUser } from './user';
import type { UserType } from './enums';

// Sahnem.Business/DTOs/Admin/AdminStatsDto.cs
export interface AdminRecentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdDate: string;
}

export interface AdminRecentAdvert {
  id: number;
  title: string;
  status: string;
  createdDate: string;
}

export interface AdminStats {
  totalUsers: number;
  totalMusicians: number;
  totalOrganizers: number;
  totalVenues: number;
  abandonedSignups: number;
  suspendedUsers: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;

  totalAdverts: number;
  openAdverts: number;
  closedAdverts: number;
  cancelledAdverts: number;

  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  rejectedOffers: number;

  totalConversations: number;
  totalMessages: number;

  recentSignups: AdminRecentUser[];
  recentAdverts: AdminRecentAdvert[];
}

// Sahnem.Business/DTOs/Admin/AdminUserDetailDto.cs
export interface AdminUserDetail {
  user: AppUser;
  advertCount: number;
  offerCount: number;
  messageCount: number;
  conversationCount: number;
  favoriteCount: number;
  profileSummary?: string;
}

export interface AdminUserFilter {
  search?: string;
  role?: UserType;
  isActive?: boolean;
  isEmailConfirmed?: boolean;
}
