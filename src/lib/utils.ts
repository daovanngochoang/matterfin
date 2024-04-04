import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import fs from "node:fs";
import { error } from "console";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function errorLog(error: string) {
  let logPath: string | undefined = process.env.LOG_FILE_PATH;
  // if (logPath !== undefined) {
  //   if (fs.existsSync(logPath!)) {
  //     fs.mkdirSync(logPath)
  //   }
  //   fs.appendFileSync(logPath, error);
  // }
}


