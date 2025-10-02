import { resolve, extname, basename } from "node:path";
import { readdirSync } from "node:fs";

export interface IconInfo {
  name: string;
  path: string;
}

/**
 * Сканирует папку с иконками и возвращает список найденных Vue компонентов
 */
export function scanIcons(iconsPath: string): IconInfo[] {
  try {
    const fullPath = resolve(process.cwd(), iconsPath);
    const files = readdirSync(fullPath);

    return files
      .filter((file) => {
        const ext = extname(file);
        const isVueFile = ext === ".vue";
        return isVueFile;
      })
      .map((file) => ({
        name: basename(file, ".vue"),
        path: resolve(fullPath, file),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.warn(`Не удалось сканировать папку ${iconsPath}:`, error);
    return [];
  }
}
