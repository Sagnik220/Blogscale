import { supabase } from './supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// ─── Session Management ───

export async function createSession(userId: number): Promise<string> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const { error } = await supabase
        .from('sessions')
        .insert({
            token,
            user_id: userId,
            expires_at: expiresAt.toISOString(),
        });

    if (error) {
        console.error('Error creating session:', error);
        throw error;
    }

    return token;
}

export async function validateSession(token: string): Promise<boolean> {
    if (!token) return false;

    const { data, error } = await supabase
        .from('sessions')
        .select('id, expires_at')
        .eq('token', token)
        .single();

    if (error || !data) return false;

    // Check expiration
    if (new Date(data.expires_at) < new Date()) {
        // Clean up expired session
        await supabase.from('sessions').delete().eq('token', token);
        return false;
    }

    return true;
}

export async function deleteSession(token: string): Promise<void> {
    await supabase.from('sessions').delete().eq('token', token);
}

// ─── Password Verification ───

export async function verifyAdminCredentials(
    email: string,
    password: string
): Promise<{ valid: boolean; userId: number | null }> {
    const { data: user, error } = await supabase
        .from('admin_users')
        .select('id, password_hash')
        .eq('email', email)
        .single();

    if (error || !user) {
        return { valid: false, userId: null };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    return { valid: isValid, userId: isValid ? user.id : null };
}

// ─── Rate Limiting ───

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;

    const entry = loginAttempts.get(ip);

    if (!entry || now > entry.resetAt) {
        loginAttempts.set(ip, { count: 1, resetAt: now + windowMs });
        return { allowed: true };
    }

    if (entry.count >= maxAttempts) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return { allowed: false, retryAfter };
    }

    entry.count++;
    return { allowed: true };
}

// ─── Admin User Seeding ───

export async function ensureAdminUser(email: string, plainPassword: string): Promise<void> {
    const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single();

    if (!data) {
        const hash = await bcrypt.hash(plainPassword, 12);
        await supabase.from('admin_users').insert({
            email,
            password_hash: hash,
        });
    }
}
