import { resolve, extname, basename } from "node:path";
import { readdirSync } from "node:fs";

export interface IconInfo {
  name: string;
  path: string;
}

/**
 * Сканирует папку или папки с иконками и возвращает список найденных Vue компонентов
 */
export function scanIcons(iconsPath: string | string[]): IconInfo[] {
  const paths = Array.isArray(iconsPath) ? iconsPath : [iconsPath];
  const allIcons: IconInfo[] = [];

  for (const path of paths) {
    try {
      const fullPath = resolve(process.cwd(), path);
      const files = readdirSync(fullPath);

      const icons = files
        .filter((file) => {
          const ext = extname(file);
          const isVueFile = ext === ".vue";
          return isVueFile;
        })
        .map((file) => ({
          name: basename(file, ".vue"),
          path: resolve(fullPath, file),
        }));

      allIcons.push(...icons);
    } catch (error) {
      console.warn(`Не удалось сканировать папку ${path}:`, error);
    }
  }

  // Удаляем дубликаты по имени и сортируем
  const uniqueIcons = allIcons.reduce((acc, icon) => {
    if (!acc.find((existing) => existing.name === icon.name)) {
      acc.push(icon);
    }
    return acc;
  }, [] as IconInfo[]);

  return uniqueIcons.sort((a, b) => a.name.localeCompare(b.name));
}
