import { delay } from '@/lib/async';
import { nextId, readStore, writeStore } from '@/lib/storage';
import { DEMO_PASSWORD, SEED_USERS } from '@/mocks/seed';
import type { AppUser, AppUserLoginInput, AppUserRegisterInput, AppUserUpdateInput } from '@/types';

// Bu servis şimdilik mock veriyle çalışıyor. Backend'de CORS + auth uçları hazır
// olduğunda burada localStorage yerine fetch('/api/user/...') çağrıları kullanılacak
// — dış arayüz (fonksiyon imzaları) aynı kalacağı için sayfa kodları değişmeyecek.

function getUsers(): AppUser[] {
  return readStore('users', SEED_USERS);
}
function setUsers(users: AppUser[]) {
  writeStore('users', users);
}

export async function login(input: AppUserLoginInput): Promise<AppUser> {
  await delay();
  const user = getUsers().find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (!user || input.password !== DEMO_PASSWORD) {
    throw new Error('E-posta veya şifre hatalı.');
  }
  return user;
}

export async function register(input: AppUserRegisterInput): Promise<AppUser> {
  await delay();
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('Bu e-posta adresi zaten kayıtlı.');
  }
  const newUser: AppUser = {
    id: nextId(users),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phoneNumber: input.phoneNumber,
    role: input.role,
    isEmailConfirmed: false,
    isPhoneNumberConfirmed: false,
    isProfileCompleted: false,
    createdDate: new Date().toISOString(),
  };
  setUsers([...users, newUser]);
  return newUser;
}

export async function getById(id: number): Promise<AppUser | undefined> {
  await delay(150);
  return getUsers().find((u) => u.id === id);
}

export async function updateUser(id: number, input: AppUserUpdateInput): Promise<AppUser> {
  await delay();
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('Kullanıcı bulunamadı.');
  users[idx] = { ...users[idx], ...input };
  setUsers(users);
  return users[idx];
}

export async function markProfileCompleted(id: number): Promise<void> {
  await delay(100);
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return;
  users[idx] = { ...users[idx], isProfileCompleted: true };
  setUsers(users);
}

export async function deleteAccount(id: number): Promise<void> {
  await delay();
  setUsers(getUsers().filter((u) => u.id !== id));
}
