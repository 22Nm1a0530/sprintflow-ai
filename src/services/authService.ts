import type { User, UserRole } from "../types/auth";

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const ACCOUNTS_KEY = "sprintflow_accounts";
const RESET_TOKENS_KEY = "sprintflow_reset_tokens";
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
interface ResetTokenEntry {
  token: string;
  email: string;
  expiresAt: number;
}

function getResetTokens(): ResetTokenEntry[] {
  const raw = localStorage.getItem(RESET_TOKENS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveResetTokens(tokens: ResetTokenEntry[]) {
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
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
export async function updateUserProfile(
  userId: string,
  updates: { name: string; email: string }
): Promise<User> {
  await new Promise((r) => setTimeout(r, 400));

  const raw = localStorage.getItem("sprintflow_accounts");
  const accounts: StoredAccount[] = raw ? JSON.parse(raw) : [];
  const account = accounts.find((a) => a.id === userId);

  if (!account) {
    throw new Error("Account not found.");
  }

  const emailTaken = accounts.some(
    (a) => a.id !== userId && a.email.toLowerCase() === updates.email.toLowerCase()
  );
  if (emailTaken) {
    throw new Error("This email is already in use.");
  }

  account.name = updates.name;
  account.email = updates.email;
  localStorage.setItem("sprintflow_accounts", JSON.stringify(accounts));

  const updatedUser: User = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
  };

  localStorage.setItem("sprintflow_user", JSON.stringify(updatedUser));

  return updatedUser;
}
export async function requestPasswordReset(email: string): Promise<string | null> {
  await new Promise((r) => setTimeout(r, 400));

  const accounts = getAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

  // Always behave the same whether or not the account exists (don't leak which emails are registered).
  if (!account) {
    return null;
  }

  const token = generateToken();
  const tokens = getResetTokens().filter((t) => t.email.toLowerCase() !== email.toLowerCase());
  tokens.push({
    token,
    email: account.email,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  });
  saveResetTokens(tokens);

  return token;
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));

  const tokens = getResetTokens();
  const entry = tokens.find((t) => t.token === token);

  if (!entry) {
    throw new Error("This reset link is invalid.");
  }
  if (entry.expiresAt < Date.now()) {
    throw new Error("This reset link has expired. Please request a new one.");
  }

  const accounts = getAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === entry.email.toLowerCase());
  if (!account) {
    throw new Error("Account not found.");
  }

  account.password = newPassword;
  saveAccounts(accounts);

  // Invalidate the token after use.
  saveResetTokens(tokens.filter((t) => t.token !== token));
}