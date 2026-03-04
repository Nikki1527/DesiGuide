
import * as hana from '@sap/hana-client';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';          // ⬅ create your own logger

dotenv.config();


interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  schema: string;          // defaulted to DBADMIN if not supplied
}

const quote = (id: string) => `"${id.replace(/"/g, '""')}"`;
export class HanaConnection {
  private config: DatabaseConfig;
  private pool: hana.ConnectionPool | null = null;

  constructor() {
    this.config = {
      host:     process.env.HANA_HOST     ?? '',
      port:     Number(process.env.HANA_PORT ?? 443),
      user:     process.env.HANA_USER     ?? '',
      password: process.env.HANA_PASSWORD ?? '',
      schema:   process.env.HANA_SCHEMA   ?? 'DBADMIN'
    };
    this.validateConfig();
  }

  private validateConfig(): void {
    const missing = (['host','user','password'] as (keyof DatabaseConfig)[])
      .filter(k => !this.config[k]);
    if (missing.length) {
      throw new Error(`Missing required DB config keys: ${missing.join(', ')}`);
    }
  }

async initialize(): Promise<void> {
    try {
      const attrs = {
        serverNode: `${this.config.host}:${this.config.port}`,
        uid:  this.config.user,
        pwd:  this.config.password,
        encrypt: true,
        sslValidateCertificate: false,   // 🔒 set TRUE in production
        currentSchema: this.config.schema
      };

      this.pool = hana.createPool(attrs, { min: 1, max: 5 });
      
      const conn = this.pool.getConnection();   // ping
      logger.info('Connected to SAP HANA Cloud');
      
      conn.disconnect();
    } catch (err) {
      console.error('❌ SAP HANA connection failed:', err);
      logger.error('Failed to initialise HANA pool', err);
      throw err;
    }
  }

 async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.pool) throw new Error('HANA pool not initialised');

    let conn: hana.Connection | null = null;
    try {
      conn = this.pool.getConnection();
      return await conn.exec(sql, params) as T[];
    } finally {
      conn?.disconnect();
    }
  }

 async createUsersTable(): Promise<void> {
    const schema = this.config.schema.toUpperCase();
    const table  = 'USERS';

    const exists = await this.query(
      `SELECT 1 FROM SYS.TABLES WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?`,
      [schema, table]
    );
    if (exists.length) {
      logger.info('Table USERS already exists');
      return;
    }

    const full = `${quote(schema)}.${quote(table)}`;
    const ddl = `
      CREATE TABLE ${full} (
        "ID"          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "NAME"        NVARCHAR(100)  NOT NULL,
        "EMAIL"       NVARCHAR(255)  NOT NULL UNIQUE,
        "PASSWORD"    NVARCHAR(255)  NOT NULL,
        "ROLE"        NVARCHAR(50)   DEFAULT 'user',
        "AGE"         INTEGER,
        "ADDRESS"     NVARCHAR(500),
        "PROFILE_URL" NVARCHAR(500),
        "CREATED_AT"  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "UPDATED_AT"  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await this.query(ddl);
    logger.info('Table USERS created');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.query('SELECT 1 FROM DUMMY');
      return true;
    } catch (err) {
      console.error('❌ Database ping test failed:', err);
      logger.error('HANA ping failed', err);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      this.pool.clear();
      this.pool = null;
      logger.info('HANA pool closed');
    }
  }
}

export const hanaConnection = new HanaConnection();
