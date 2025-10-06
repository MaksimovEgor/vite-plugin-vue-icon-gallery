import { resolve, extname, basename } from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import type { Dirent } from "node:fs";

export interface IconInfo {
  name: string;
  path: string;
}

/**
 * Сканирует папку или папки с иконками и возвращает список найденных Vue компонентов
 */
export function scanIcons(iconsPath: string | string[]): IconInfo[] {
  const roots = (Array.isArray(iconsPath) ? iconsPath : [iconsPath]).map((p) =>
    resolve(process.cwd(), p)
  );

  const ignoreDirs = new Set([
    "node_modules",
    ".git",
    ".husky",
    ".next",
    "dist",
    "build",
    ".output",
    ".turbo",
  ]);

  const all: IconInfo[] = [];

  const isIconVueFile = (absolutePath: string): boolean => {
    if (extname(absolutePath) !== ".vue") return false;
    try {
      const content = readFileSync(absolutePath, "utf8");
      // Heuristic: inline SVG inside <template> section
      // - find <template ...> ... </template>
      // - check if it contains <svg ...>
      const tplMatch = content.match(/<template[\s\S]*?>[\s\S]*?<\/template>/i);
      if (!tplMatch) return false;
      return /<svg\b[^>]*>/i.test(tplMatch[0]);
    } catch {
      return false;
    }
  };

  const walk = (dir: string) => {
    let entries: Dirent[] = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true }) as unknown as Dirent[];
    } catch {
      return;
    }
    for (const ent of entries) {
      const abs = resolve(dir, ent.name);
      if (ent.isDirectory()) {
        if (ignoreDirs.has(ent.name)) continue;
        walk(abs);
      } else if (ent.isFile()) {
        if (isIconVueFile(abs)) {
          all.push({ name: basename(abs, ".vue"), path: abs });
        }
      }
    }
  };

  for (const root of roots) {
    walk(root);
  }

  // Удаляем дубликаты по имени и сортируем
  const unique = all.reduce((acc, icon) => {
    if (!acc.find((e) => e.name === icon.name)) acc.push(icon);
    return acc;
  }, [] as IconInfo[]);

  return unique.sort((a, b) => a.name.localeCompare(b.name));
}
