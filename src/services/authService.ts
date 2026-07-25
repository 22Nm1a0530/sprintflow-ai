import type { User, UserRole } from "../types/auth";

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const ACCOUNTS_KEY = "sprintflow_accounts";

function getAccounts(): StoredAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function generateToken(): string {
  return `sf_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export async function signup(
  name: string,
  email: string,
  password: string,
  role: UserRole = "developer"
): Promise<{ user: User; token: string }> {
  await new Promise((r) => setTimeout(r, 500)); // simulate network delay

  const accounts = getAccounts();
  const exists = accounts.some((a) => a.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const newAccount: StoredAccount = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    role,
  };

  accounts.push(newAccount);
  saveAccounts(accounts);

  const user: User = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    role: newAccount.role,
  };

  return { user, token: generateToken() };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  await new Promise((r) => setTimeout(r, 500)); // simulate network delay

  const accounts = getAccounts();
  const account = accounts.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );

  if (!account) {
    throw new Error("Invalid email or password.");
  }

  const user: User = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
  };

  return { user, token: generateToken() };
}