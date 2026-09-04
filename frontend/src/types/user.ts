import type { UserType } from './enums';

// Sahnem.Core/Entities/AppUser.cs
export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserType;
  isEmailConfirmed: boolean;
  isPhoneNumberConfirmed: boolean;
  isProfileCompleted: boolean;
  isActive: boolean;
  avatarUrl?: string;
  createdDate: string;
}

// Sahnem.Business/DTOs/User/AppUserRegisterDto.cs — backend'de rol alanı YOK.
// Rol, register anında değil, profil oluşturma anında (CreateMusicianProfile vb.)
// atanır. Kayıt formundaki rol seçimi sadece profil kurulum sihirbazına hangi
// formun gösterileceğini belirleyen bir istemci-tarafı seçimdir (bkz. Register.tsx).
export interface AppUserRegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  allowCityAdvertAlerts?: boolean;
}

// Sahnem.Business/DTOs/User/AppUserLoginDto.cs
export interface AppUserLoginInput {
  email: string;
  password: string;
}

// Sahnem.Business/DTOs/User/AppUserUpdateDto.cs
export interface AppUserUpdateInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl?: string;
}
