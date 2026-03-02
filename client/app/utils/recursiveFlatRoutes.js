/**
 * Adapted from @react-router/fs-routes v7.10.1 (MIT License)
 * Copyright (c) Remix Software Inc.
 *
 * Modified to support recursive directory walking so route files can be
 * organized into subdirectories while still producing flat route IDs.
 */
import fs from "node:fs";
import path from "node:path";
import { makeRe } from "minimatch";
import { getAppDirectory } from "@react-router/dev/routes";

// ---------------------------------------------------------------------------
// Helpers copied verbatim from @react-router/fs-routes
// ---------------------------------------------------------------------------

function normalizeSlashes(file) {
  return file.replaceAll(path.win32.sep, "/");
}

const routeModuleExts = [".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"];
const paramPrefixChar = "$";
const escapeStart = "[";
const escapeEnd = "]";
const optionalStart = "(";
const optionalEnd = ")";

const PrefixLookupTrieEndSymbol = Symbol("PrefixLookupTrieEndSymbol");

class PrefixLookupTrie {
  root = { [PrefixLookupTrieEndSymbol]: false };

  add(value) {
    if (!value) throw new Error("Cannot add empty string to PrefixLookupTrie");
    let node = this.root;
    for (const char of value) {
      if (!node[char]) {
        node[char] = { [PrefixLookupTrieEndSymbol]: false };
      }
      node = node[char];
    }
    node[PrefixLookupTrieEndSymbol] = true;
  }

  findAndRemove(prefix, filter) {
    let node = this.root;
    for (const char of prefix) {
      if (!node[char]) return [];
      node = node[char];
    }
    return this.#findAndRemoveRecursive([], node, prefix, filter);
  }

  #findAndRemoveRecursive(values, node, prefix, filter) {
    for (const char of Object.keys(node)) {
      this.#findAndRemoveRecursive(values, node[char], prefix + char, filter);
    }
    if (node[PrefixLookupTrieEndSymbol] && filter(prefix)) {
      node[PrefixLookupTrieEndSymbol] = false;
      values.push(prefix);
    }
    return values;
  }
}

function getRouteSegments(routeId) {
  const routeSegments = [];
  const rawRouteSegments = [];
  let index = 0;
  let routeSegment = "";
  let rawRouteSegment = "";
  let state = "NORMAL";

  const pushRouteSegment = (segment, rawSegment) => {
    if (!segment) return;
    const notSupportedInRR = (segment2, char) => {
      throw new Error(
        `Route segment "${segment2}" for "${routeId}" cannot contain "${char}".\nIf this is something you need, upvote this proposal for React Router https://github.com/remix-run/react-router/discussions/9822.`
      );
    };
    if (rawSegment.includes("*")) return notSupportedInRR(rawSegment, "*");
    if (rawSegment.includes(":")) return notSupportedInRR(rawSegment, ":");
    if (rawSegment.includes("/")) return notSupportedInRR(segment, "/");
    routeSegments.push(segment);
    rawRouteSegments.push(rawSegment);
  };

  while (index < routeId.length) {
    const char = routeId[index];
    index++;
    switch (state) {
      case "NORMAL": {
        if (isSegmentSeparator(char)) {
          pushRouteSegment(routeSegment, rawRouteSegment);
          routeSegment = "";
          rawRouteSegment = "";
          state = "NORMAL";
          break;
        }
        if (char === escapeStart) {
          state = "ESCAPE";
          rawRouteSegment += char;
          break;
        }
        if (char === optionalStart) {
          state = "OPTIONAL";
          rawRouteSegment += char;
          break;
        }
        if (!routeSegment && char === paramPrefixChar) {
          if (index === routeId.length) {
            routeSegment += "*";
            rawRouteSegment += char;
          } else {
            routeSegment += ":";
            rawRouteSegment += char;
          }
          break;
        }
        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case "ESCAPE": {
        if (char === escapeEnd) {
          state = "NORMAL";
          rawRouteSegment += char;
          break;
        }
        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case "OPTIONAL": {
        if (char === optionalEnd) {
          routeSegment += "?";
          rawRouteSegment += char;
          state = "NORMAL";
          break;
        }
        if (char === escapeStart) {
          state = "OPTIONAL_ESCAPE";
          rawRouteSegment += char;
          break;
        }
        if (!routeSegment && char === paramPrefixChar) {
          if (index === routeId.length) {
            routeSegment += "*";
            rawRouteSegment += char;
          } else {
            routeSegment += ":";
            rawRouteSegment += char;
          }
          break;
        }
        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case "OPTIONAL_ESCAPE": {
        if (char === escapeEnd) {
          state = "OPTIONAL";
          rawRouteSegment += char;
          break;
        }
        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
    }
  }

  pushRouteSegment(routeSegment, rawRouteSegment);
  return [routeSegments, rawRouteSegments];
}

function createRoutePath(routeSegments, rawRouteSegments, isIndex) {
  const result = [];
  if (isIndex) {
    routeSegments = routeSegments.slice(0, -1);
  }
  for (let index = 0; index < routeSegments.length; index++) {
    let segment = routeSegments[index];
    const rawSegment = rawRouteSegments[index];
    if (segment.startsWith("_") && rawSegment.startsWith("_")) continue;
    if (segment.endsWith("_") && rawSegment.endsWith("_")) {
      segment = segment.slice(0, -1);
    }
    result.push(segment);
  }
  return result.length ? result.join("/") : void 0;
}

function isSegmentSeparator(checkChar) {
  if (!checkChar) return false;
  return ["/", ".", path.win32.sep].includes(checkChar);
}

function findFile(dir, basename, extensions) {
  for (const ext of extensions) {
    const name = basename + ext;
    const file = path.join(dir, name);
    if (fs.existsSync(file)) return file;
  }
  return void 0;
}

function findRouteModuleForFile(appDirectory, filepath, ignoredFileRegex) {
  const relativePath = normalizeSlashes(path.relative(appDirectory, filepath));
  const isIgnored = ignoredFileRegex.some(regex => regex.test(relativePath));
  if (isIgnored) return null;
  return filepath;
}

function findRouteModuleForFolder(appDirectory, filepath, ignoredFileRegex) {
  const relativePath = path.relative(appDirectory, filepath);
  const isIgnored = ignoredFileRegex.some(regex => regex.test(relativePath));
  if (isIgnored) return null;

  const routeRouteModule = findFile(filepath, "route", routeModuleExts);
  const routeIndexModule = findFile(filepath, "index", routeModuleExts);

  if (routeRouteModule && routeIndexModule) {
    const [segments, raw] = getRouteSegments(
      path.relative(appDirectory, filepath)
    );
    const routePath = createRoutePath(segments, raw, false);
    console.error(
      getRoutePathConflictErrorMessage(routePath || "/", [
        routeRouteModule,
        routeIndexModule
      ])
    );
  }
  return routeRouteModule || routeIndexModule || null;
}

function routeManifestToRouteConfig(routeManifest, rootId = "root") {
  const routeConfigById = {};
  for (const id in routeManifest) {
    const route = routeManifest[id];
    routeConfigById[id] = {
      id: route.id,
      file: route.file,
      path: route.path,
      index: route.index,
      caseSensitive: route.caseSensitive
    };
  }
  const routeConfig = [];
  for (const id in routeConfigById) {
    const route = routeConfigById[id];
    const parentId = routeManifest[route.id].parentId;
    if (parentId === rootId) {
      routeConfig.push(route);
    } else {
      const parentRoute = parentId && routeConfigById[parentId];
      if (parentRoute) {
        parentRoute.children = parentRoute.children || [];
        parentRoute.children.push(route);
      }
    }
  }
  return routeConfig;
}

function getRoutePathConflictErrorMessage(pathname, routes) {
  const [taken, ...others] = routes;
  if (!pathname.startsWith("/")) pathname = "/" + pathname;
  return `\u26A0\uFE0F Route Path Collision: "${pathname}"\n\nThe following routes all define the same URL, only the first one will be used\n\n\u{1F7E2} ${taken}\n${others
    .map(route => `\u2B55\uFE0F\uFE0F ${route}`)
    .join("\n")}\n`;
}

function getRouteIdConflictErrorMessage(routeId, files) {
  const [taken, ...others] = files;
  return `\u26A0\uFE0F Route ID Collision: "${routeId}"\n\nThe following routes all define the same Route ID, only the first one will be used\n\n\u{1F7E2} ${taken}\n${others
    .map(route => `\u2B55\uFE0F\uFE0F ${route}`)
    .join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// Modified: flatRoutesUniversal — routeId uses full path for non-folder modules
// ---------------------------------------------------------------------------

function flatRoutesUniversal(appDirectory, routes, prefix = "routes") {
  const urlConflicts = new Map();
  const routeManifest = {};
  const prefixLookup = new PrefixLookupTrie();
  const uniqueRoutes = new Map();
  const routeIdConflicts = new Map();
  const routeIds = new Map();

  for (const file of routes) {
    const normalizedFile = normalizeSlashes(file);
    const routeExt = path.posix.extname(normalizedFile);
    const routeDir = path.posix.dirname(normalizedFile);
    const normalizedApp = normalizeSlashes(appDirectory);

    // Determine if this file is a folder module (route.jsx or index.jsx)
    const basename = path.posix
      .basename(normalizedFile)
      .slice(0, -routeExt.length);
    const isFolderModule =
      basename === "route" || basename === "index" || basename === "_layout";

    // Folder modules use directory path as routeId; all others use full file
    // path (minus extension), regardless of depth.
    const routeId = isFolderModule
      ? path.posix.relative(normalizedApp, routeDir)
      : path.posix
          .relative(normalizedApp, normalizedFile)
          .slice(0, -routeExt.length);

    const conflict = routeIds.get(routeId);
    if (conflict) {
      let currentConflicts = routeIdConflicts.get(routeId);
      if (!currentConflicts) {
        currentConflicts = [path.posix.relative(normalizedApp, conflict)];
      }
      currentConflicts.push(path.posix.relative(normalizedApp, normalizedFile));
      routeIdConflicts.set(routeId, currentConflicts);
      continue;
    }
    routeIds.set(routeId, normalizedFile);
  }

  const sortedRouteIds = Array.from(routeIds).sort(
    ([a], [b]) => b.length - a.length
  );

  for (const [routeId, file] of sortedRouteIds) {
    const index = routeId.endsWith("_index");
    const [segments, raw] = getRouteSegments(routeId.slice(prefix.length + 1));
    const pathname = createRoutePath(segments, raw, index);

    routeManifest[routeId] = {
      file: file.slice(appDirectory.length + 1),
      id: routeId,
      path: pathname
    };
    if (index) routeManifest[routeId].index = true;

    const childRouteIds = prefixLookup.findAndRemove(routeId, value => {
      return [".", "/"].includes(value.slice(routeId.length).charAt(0));
    });
    prefixLookup.add(routeId);

    if (childRouteIds.length > 0) {
      for (const childRouteId of childRouteIds) {
        routeManifest[childRouteId].parentId = routeId;
      }
    }
  }

  const parentChildrenMap = new Map();
  for (const [routeId] of sortedRouteIds) {
    const config = routeManifest[routeId];
    if (!config.parentId) continue;
    const existingChildren = parentChildrenMap.get(config.parentId) || [];
    existingChildren.push(config);
    parentChildrenMap.set(config.parentId, existingChildren);
  }

  for (const [routeId] of sortedRouteIds) {
    const config = routeManifest[routeId];
    const originalPathname = config.path || "";
    let pathname = config.path;
    const parentConfig = config.parentId
      ? routeManifest[config.parentId]
      : null;

    if (parentConfig?.path && pathname) {
      pathname = pathname
        .slice(parentConfig.path.length)
        .replace(/^\//, "")
        .replace(/\/$/, "");
    }

    if (!config.parentId) config.parentId = "root";
    config.path = pathname || void 0;

    const lastRouteSegment = config.id
      .replace(new RegExp(`^${prefix}/`), "")
      .split(".")
      .pop();
    const isPathlessLayoutRoute =
      lastRouteSegment &&
      lastRouteSegment.startsWith("_") &&
      lastRouteSegment !== "_index";
    if (isPathlessLayoutRoute) continue;

    const conflictRouteId = originalPathname + (config.index ? "?index" : "");
    const conflict = uniqueRoutes.get(conflictRouteId);
    uniqueRoutes.set(conflictRouteId, config);

    if (conflict && (originalPathname || config.index)) {
      let currentConflicts = urlConflicts.get(originalPathname);
      if (!currentConflicts) currentConflicts = [conflict];
      currentConflicts.push(config);
      urlConflicts.set(originalPathname, currentConflicts);
      continue;
    }
  }

  if (routeIdConflicts.size > 0) {
    for (const [routeId, files] of routeIdConflicts.entries()) {
      console.error(getRouteIdConflictErrorMessage(routeId, files));
    }
  }

  if (urlConflicts.size > 0) {
    for (const [urlPath, routes2] of urlConflicts.entries()) {
      for (let i = 1; i < routes2.length; i++) {
        delete routeManifest[routes2[i].id];
      }
      const files = routes2.map(r => r.file);
      console.error(getRoutePathConflictErrorMessage(urlPath, files));
    }
  }

  return routeManifest;
}

// ---------------------------------------------------------------------------
// New: recursive file collector
// ---------------------------------------------------------------------------

/**
 * Recursively walk `dir` collecting route module file paths.
 *
 * Convention:
 *  - If a directory contains route.jsx/index.jsx it is a **folder route**.
 *    The route module is registered; other files are co-located (ignored).
 *    Subdirectories are still recursed.
 *  - Otherwise it is an **organizational folder**. All route-extension files
 *    directly inside are treated as route modules. Subdirectories are recursed.
 */
function collectRouteFiles(dir, appDir, ignoredFileRegex) {
  const routes = [];

  // Skip directories that match an ignore pattern
  const dirRelative = normalizeSlashes(path.relative(appDir, dir));
  const dirIgnored = ignoredFileRegex.some(regex => regex.test(dirRelative));
  if (dirIgnored) return routes;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true, encoding: "utf-8" });
  } catch {
    return routes;
  }

  // Check if this directory is a folder route (has route.jsx or index.jsx)
  const folderModule = findRouteModuleForFolder(appDir, dir, ignoredFileRegex);

  if (folderModule) {
    // This is a folder route — register the module, skip sibling files
    routes.push(folderModule);

    // Still recurse into subdirectories for child routes
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subdir = path.join(dir, entry.name);
        routes.push(...collectRouteFiles(subdir, appDir, ignoredFileRegex));
      }
    }
  } else if (findFile(dir, "_layout", routeModuleExts)) {
    // Layout folder — _layout.jsx acts as the layout/parent route for this
    // directory (getting the directory path as its route ID), while sibling
    // files are still treated as route modules (unlike route.jsx which makes
    // siblings co-located).
    const layoutModule = findFile(dir, "_layout", routeModuleExts);
    const layoutRoute = findRouteModuleForFile(
      appDir,
      normalizeSlashes(layoutModule),
      ignoredFileRegex
    );
    if (layoutRoute) routes.push(layoutRoute);

    for (const entry of entries) {
      const filepath = normalizeSlashes(path.join(dir, entry.name));
      if (entry.isDirectory()) {
        routes.push(
          ...collectRouteFiles(
            path.join(dir, entry.name),
            appDir,
            ignoredFileRegex
          )
        );
      } else if (
        entry.isFile() &&
        filepath !== normalizeSlashes(layoutModule)
      ) {
        const route = findRouteModuleForFile(
          appDir,
          filepath,
          ignoredFileRegex
        );
        if (route) routes.push(route);
      }
    }
  } else {
    // Organizational folder — all route-ext files are route modules
    for (const entry of entries) {
      const filepath = normalizeSlashes(path.join(dir, entry.name));

      if (entry.isDirectory()) {
        routes.push(
          ...collectRouteFiles(
            path.join(dir, entry.name),
            appDir,
            ignoredFileRegex
          )
        );
      } else if (entry.isFile()) {
        const route = findRouteModuleForFile(
          appDir,
          filepath,
          ignoredFileRegex
        );
        if (route) routes.push(route);
      }
    }
  }

  return routes;
}

// ---------------------------------------------------------------------------
// New: public entry point (same interface as the original `flatRoutes`)
// ---------------------------------------------------------------------------

export async function recursiveFlatRoutes(options = {}) {
  const {
    ignoredRouteFiles = [],
    rootDirectory: userRootDirectory = "routes"
  } = options;

  const appDirectory = getAppDirectory();
  const rootDirectory = path.resolve(appDirectory, userRootDirectory);
  const relativeRootDirectory = path.relative(appDirectory, rootDirectory);
  const prefix = normalizeSlashes(relativeRootDirectory);

  if (!fs.existsSync(rootDirectory)) {
    return [];
  }

  // User-provided patterns are relative to rootDirectory, but the ignore
  // checks test paths relative to appDirectory. Prefix with the route prefix
  // so they match correctly.
  const prefixedPatterns = ignoredRouteFiles.map(p => `${prefix}/${p}`);
  const ignoredFileRegex = Array.from(new Set(["**/.*", ...prefixedPatterns]))
    .map(re => makeRe(re))
    .filter(re => !!re);

  // Collect route files recursively from the root directory
  const entries = fs.readdirSync(rootDirectory, {
    withFileTypes: true,
    encoding: "utf-8"
  });

  const routes = [];
  for (const entry of entries) {
    const filepath = normalizeSlashes(path.join(rootDirectory, entry.name));

    if (entry.isDirectory()) {
      routes.push(
        ...collectRouteFiles(
          path.join(rootDirectory, entry.name),
          appDirectory,
          ignoredFileRegex
        )
      );
    } else if (entry.isFile()) {
      const route = findRouteModuleForFile(
        appDirectory,
        filepath,
        ignoredFileRegex
      );
      if (route) routes.push(route);
    }
  }

  const routeManifest = flatRoutesUniversal(appDirectory, routes, prefix);
  return routeManifestToRouteConfig(routeManifest);
}
