declare module 'zaproxy' {
  interface ReportsAPI {
    generate(options: any, opts?: any): Promise<any>;
  }

  interface ZapClient {
    reports: ReportsAPI;
    [k: string]: any;
  }

  const ZapClientConstructor: {
    new(...args: any[]): ZapClient;
    (...args: any[]): ZapClient;
  };

  export default ZapClientConstructor;
}
