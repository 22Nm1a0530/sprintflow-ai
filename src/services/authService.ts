import type { User, UserRole } from "../types/auth";
import { supabase } from "./supabaseClient";

function generateToken(): string {
  return `sf_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export async function signup(
  name: string,
  email: string,
  password: string,
  role: UserRole = "developer"
): Promise<{ user: User; token: string }> {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ name, email, password, role })
    .select()
    .single();

  if (error || !data) {
    throw new Error("Signup failed. Please try again.");
  }

  const user: User = {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  };

  return { user, token: generateToken() };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .ilike("email", email)
    .eq("password", password)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Invalid email or password.");
  }

  const user: User = {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  };

  return { user, token: generateToken() };
}

export async function updateUserProfile(
  userId: string,
  updates: { name: string; email: string }
): Promise<User> {
  const { data: emailTaken } = await supabase
    .from("users")
    .select("id")
    .ilike("email", updates.email)
    .neq("id", userId)
    .maybeSingle();

  if (emailTaken) {
    throw new Error("This email is already in use.");
  }

  const { data, error } = await supabase
    .from("users")
    .update({ name: updates.name, email: updates.email })
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to update profile.");
  }

  const updatedUser: User = {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  };

  localStorage.setItem("sprintflow_user", JSON.stringify(updatedUser));

  return updatedUser;
}

export async function requestPasswordReset(email: string): Promise<string | null> {
  const { data: account } = await supabase
    .from("users")
    .select("id, email")
    .ilike("email", email)
    .maybeSingle();

  if (!account) {
    return null;
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("password_reset_tokens")
    .insert({ token, email: account.email, expires_at: expiresAt });

  if (error) {
    throw new Error("Something went wrong. Please try again.");
  }

  return token;
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<void> {
  const { data: entry } = await supabase
    .from("password_reset_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (!entry) {
    throw new Error("This reset link is invalid.");
  }
  if (new Date(entry.expires_at).getTime() < Date.now()) {
    throw new Error("This reset link has expired. Please request a new one.");
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ password: newPassword })
    .ilike("email", entry.email);

  if (updateError) {
    throw new Error("Failed to reset password.");
  }

  await supabase.from("password_reset_tokens").delete().eq("token", token);
}

export async function fetchAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at");

  if (error) {
    throw new Error("Failed to fetch users: " + error.message);
  }

  return data || [];
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    throw new Error("Failed to update user role: " + error.message);
  }
}

export async function deleteUserAccount(userId: string): Promise<void> {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) {
    throw new Error("Failed to delete user account: " + error.message);
  }
}