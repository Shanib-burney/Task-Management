import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, json } = format;

// Simple custom format for console (can switch to json)
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
  
  return `[${timestamp}] ${level} : ${message} ${metaString}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    colorize(),
    consoleFormat // use json() if you want JSON structured logs
  ),
  transports: [
    new transports.Console()
    // You can add File transport later:
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
  ],
});