import { LogLevel } from "@/Enums/LogLevels";

export interface LogOptions {
    level: LogLevel | keyof typeof LogLevel;
    getCallerFile: string;
    args: any[];
}