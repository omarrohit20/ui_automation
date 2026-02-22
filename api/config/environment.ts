/**
 * Environment Configuration
 * Supports multiple environments with configurable endpoints and settings
 */

export interface IEnvironmentConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface IEnvironments {
  [key: string]: IEnvironmentConfig;
}

const environments: IEnvironments = {
  dev: {
    baseUrl: 'https://practice.expandtesting.com',
    timeout: 10000,
    retryAttempts: 2,
    logLevel: 'debug',
  },
  qa: {
    baseUrl: process.env.QA_BASE_URL || 'https://practice.expandtesting.com',
    timeout: 15000,
    retryAttempts: 3,
    logLevel: 'info',
  },
  staging: {
    baseUrl: process.env.STAGING_BASE_URL || 'https://practice.expandtesting.com',
    timeout: 15000,
    retryAttempts: 3,
    logLevel: 'warn',
  },
  prod: {
    baseUrl: process.env.PROD_BASE_URL || 'https://practice.expandtesting.com',
    timeout: 20000,
    retryAttempts: 1,
    logLevel: 'error',
  },
};

class EnvironmentConfig {
  private static currentEnv: string = process.env.ENV || 'dev';

  static getConfig(): IEnvironmentConfig {
    const env = environments[this.currentEnv];
    if (!env) {
      throw new Error(`Environment '${this.currentEnv}' not found`);
    }
    return env;
  }

  static setEnvironment(env: string): void {
    if (!environments[env]) {
      throw new Error(`Environment '${env}' not supported`);
    }
    this.currentEnv = env;
  }

  static getCurrentEnvironment(): string {
    return this.currentEnv;
  }

  static getBaseUrl(): string {
    return this.getConfig().baseUrl;
  }
}

export default EnvironmentConfig;
