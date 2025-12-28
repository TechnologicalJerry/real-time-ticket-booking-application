export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

class Logger {
  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, ...args));
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, ...args));
  }

  info(message: string, ...args: any[]): void {
    console.info(this.formatMessage(LogLevel.INFO, message, ...args));
  }

  debug(message: string, ...args: any[]): void {
    console.debug(this.formatMessage(LogLevel.DEBUG, message, ...args));
  }
}

export const logger = new Logger();

