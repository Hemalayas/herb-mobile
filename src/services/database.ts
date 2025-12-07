import * as SQLite from 'expo-sqlite';
import { Session, TBreak } from '../types';

// Open/create database
const db = SQLite.openDatabaseSync('herb.db');

// Initialize database tables
export const initDatabase = () => {
  try {
    // Sessions table with all new fields
    db.execSync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        method TEXT NOT NULL,
        strain TEXT,
        amount REAL,
        cost REAL,
        social INTEGER,
        notes TEXT
      );
    `);
    console.log('✅ Sessions table created');

    // T-Breaks table
    db.execSync(`
      CREATE TABLE IF NOT EXISTS tbreaks (
        id TEXT PRIMARY KEY,
        startDate INTEGER NOT NULL,
        goalDays INTEGER NOT NULL,
        completed INTEGER DEFAULT 0,
        endDate INTEGER
      );
    `);
    console.log('✅ T-Breaks table created');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
};

// ONE-TIME USE: Reset database (remove after first run)
export const resetDatabase = () => {
  try {
    db.execSync('DROP TABLE IF EXISTS sessions;');
    db.execSync('DROP TABLE IF EXISTS tbreaks;');
    console.log('🗑️ Old tables dropped');
    initDatabase();
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
};

// Session Operations
export const addSession = (session: Session): void => {
  db.runSync(
    `INSERT INTO sessions (id, timestamp, method, strain, amount, cost, social, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      session.id,
      session.timestamp,
      session.method,
      session.strain || null,
      session.amount || null,
      session.cost || null,
      session.social ? 1 : 0,
      session.notes || null,
    ]
  );
};

export const getSessions = (limit?: number): Session[] => {
  const query = limit
    ? `SELECT * FROM sessions ORDER BY timestamp DESC LIMIT ?`
    : `SELECT * FROM sessions ORDER BY timestamp DESC`;
  
  const params = limit ? [limit] : [];
  const result = db.getAllSync(query, params);
  
  return result.map((row: any) => ({
    id: row.id,
    timestamp: row.timestamp,
    method: row.method,
    strain: row.strain || undefined,
    amount: row.amount || undefined,
    cost: row.cost || undefined,
    social: row.social === 1 ? true : undefined,
    notes: row.notes || undefined,
  }));
};

export const getSessionsByDateRange = (startDate: number, endDate: number): Session[] => {
  const result = db.getAllSync(
    `SELECT * FROM sessions WHERE timestamp >= ? AND timestamp <= ? ORDER BY timestamp DESC`,
    [startDate, endDate]
  );
  
  return result.map((row: any) => ({
    id: row.id,
    timestamp: row.timestamp,
    method: row.method,
    strain: row.strain || undefined,
    amount: row.amount || undefined,
    cost: row.cost || undefined,
    social: row.social === 1 ? true : undefined,
    notes: row.notes || undefined,
  }));
};

export const deleteSession = (id: string): void => {
  db.runSync(`DELETE FROM sessions WHERE id = ?`, [id]);
};

// T-Break Operations
export const addTBreak = (tbreak: TBreak): void => {
  db.runSync(
    `INSERT INTO tbreaks (id, startDate, goalDays, completed, endDate)
     VALUES (?, ?, ?, ?, ?)`,
    [
      tbreak.id,
      tbreak.startDate,
      tbreak.goalDays,
      tbreak.completed ? 1 : 0,
      tbreak.endDate || null,
    ]
  );
};

export const getTBreaks = (): TBreak[] => {
  const result = db.getAllSync(
    `SELECT * FROM tbreaks ORDER BY startDate DESC`
  );
  
  return result.map((row: any) => ({
    id: row.id,
    startDate: row.startDate,
    goalDays: row.goalDays,
    completed: row.completed === 1,
    endDate: row.endDate || undefined,
  }));
};

export const getActiveTBreak = (): TBreak | null => {
  const result: any = db.getFirstSync(
    `SELECT * FROM tbreaks WHERE completed = 0 ORDER BY startDate DESC LIMIT 1`
  );
  
  if (!result) return null;
  
  return {
    id: result.id,
    startDate: result.startDate,
    goalDays: result.goalDays,
    completed: false,
    endDate: result.endDate || undefined,
  };
};

export const completeTBreak = (id: string): void => {
  const now = Date.now();
  db.runSync(
    `UPDATE tbreaks SET completed = 1, endDate = ? WHERE id = ?`,
    [now, id]
  );
};

// Stats
export const getTodaySessionCount = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = today.getTime();
  
  const result: any = db.getFirstSync(
    `SELECT COUNT(*) as count FROM sessions WHERE timestamp >= ?`,
    [startOfDay]
  );
  
  return result?.count || 0;
};

// Get total spending
export const getTotalSpending = (): number => {
  const result: any = db.getFirstSync(
    `SELECT SUM(cost) as total FROM sessions WHERE cost IS NOT NULL`
  );
  return result?.total || 0;
};

// Get unique strains
export const getUniqueStrains = (): string[] => {
  const result = db.getAllSync(
    `SELECT DISTINCT strain FROM sessions WHERE strain IS NOT NULL ORDER BY strain`
  );
  return result.map((row: any) => row.strain);
};

// Get total amount consumed
export const getTotalAmount = (): number => {
  const result: any = db.getFirstSync(
    `SELECT SUM(amount) as total FROM sessions WHERE amount IS NOT NULL`
  );
  return result?.total || 0;
};