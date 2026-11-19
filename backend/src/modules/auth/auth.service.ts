import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";
import { dbPool } from "../../shared/config/database.js";
import { env } from "../../shared/config/env.js";
import type {
  LoginInput,
  RegisterInput,
  SafeUser,
  UserRole,
  UserSession
} from "./auth.types.js";

function generateToken(user: SafeUser): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      agency: user.agency
    },
    env.jwt.secret,
    { expiresIn: "7d" }
  );
}

export async function ensureDefaultUsers(): Promise<void> {
  try {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users"
    );
    const count = Number(rows[0]?.count ?? 0);
    if (count === 0) {
      const adminHash = await bcrypt.hash("admin123", 10);
      const reporterHash = await bcrypt.hash("pelapor123", 10);

      await dbPool.query(
        `INSERT INTO users (id, name, email, password, role, agency, phone, is_active)
         VALUES 
           ('USR-ADM-01', 'Admin KKP Muna', 'admin@kkp.go.id', ?, 'admin', 'DKP Kabupaten Muna / BPSPL Makassar', '081234567890', 1),
           ('USR-REP-01', 'Pelapor Pesisir', 'pelapor@kkp.go.id', ?, 'reporter', 'Pokmaswas Muna', '081298765432', 1)`,
        [adminHash, reporterHash]
      );
      console.log("[auth] User default (admin & pelapor) berhasil di-seed ke database.");
    }
  } catch (error) {
    console.warn("[auth] Gagal memeriksa/seed user default:", error instanceof Error ? error.message : error);
  }
}

export async function login(
  input: LoginInput,
  expectedRole?: UserRole
): Promise<UserSession> {
  await ensureDefaultUsers();

  const [rows] = await dbPool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [input.email.toLowerCase().trim()]
  );

  if (!rows || rows.length === 0) {
    throw new Error("Email atau kata sandi tidak sesuai");
  }

  const userRecord = rows[0];

  if (!userRecord.is_active) {
    throw new Error("Akun pengguna ini telah dinonaktifkan");
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    userRecord.password
  );
  if (!isPasswordValid) {
    throw new Error("Email atau kata sandi tidak sesuai");
  }

  if (expectedRole && userRecord.role !== expectedRole) {
    throw new Error(
      `Akun ini tidak memiliki hak akses sebagai ${expectedRole}`
    );
  }

  const safeUser: SafeUser = {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    role: userRecord.role as UserRole,
    agency: userRecord.agency,
    phone: userRecord.phone,
    avatarUrl: userRecord.avatar_url,
    isActive: Boolean(userRecord.is_active),
    createdAt: new Date(userRecord.created_at).toISOString(),
    updatedAt: new Date(userRecord.updated_at).toISOString()
  };

  const token = generateToken(safeUser);

  return {
    user: safeUser,
    token,
    expiresIn: "7d"
  };
}

export async function register(input: RegisterInput): Promise<UserSession> {
  await ensureDefaultUsers();

  const normalizedEmail = input.email.toLowerCase().trim();

  const [existing] = await dbPool.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [normalizedEmail]
  );

  if (existing && existing.length > 0) {
    throw new Error("Email sudah terdaftar, silakan gunakan email lain atau login");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const userId = `USR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const role: UserRole = input.role ?? "reporter";
  const now = new Date();

  await dbPool.query(
    `INSERT INTO users (id, name, email, password, role, agency, phone, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    [
      userId,
      input.name.trim(),
      normalizedEmail,
      hashedPassword,
      role,
      input.agency ?? null,
      input.phone ?? null,
      now,
      now
    ]
  );

  const safeUser: SafeUser = {
    id: userId,
    name: input.name.trim(),
    email: normalizedEmail,
    role,
    agency: input.agency ?? null,
    phone: input.phone ?? null,
    avatarUrl: null,
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  const token = generateToken(safeUser);

  return {
    user: safeUser,
    token,
    expiresIn: "7d"
  };
}

export async function getUserById(id: string): Promise<SafeUser | null> {
  const [rows] = await dbPool.query<RowDataPacket[]>(
    "SELECT id, name, email, role, agency, phone, avatar_url, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role as UserRole,
    agency: r.agency,
    phone: r.phone,
    avatarUrl: r.avatar_url,
    isActive: Boolean(r.is_active),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString()
  };
}
