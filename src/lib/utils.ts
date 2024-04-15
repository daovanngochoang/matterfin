import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import fs from "node:fs";
//

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



const IS_SERVER = typeof window === "undefined";
export default function getURL(path: string) {
  const baseURL = IS_SERVER
    ? process.env.NEXT_PUBLIC_SITE_URL!
    : window.location.origin;
  return new URL(path, baseURL).toString();
}

