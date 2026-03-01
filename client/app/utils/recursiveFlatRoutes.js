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
    if (!value)
      throw new Error("Cannot add empty string to PrefixLookupTrie");
    let node = this.root;
    for (let char of value) {
      if (!node[char]) {
        node[char] = { [PrefixLookupTrieEndSymbol]: false };
      }
      node = node[char];
    }
    node[PrefixLookupTrieEndSymbol] = true;
  }

  findAndRemove(prefix, filter) {
    let node = this.root;
    for (let char of prefix) {
      if (!node[char]) return [];
      node = node[char];
    }
    return this.#findAndRemoveRecursive([], node, prefix, filter);
  }

  #findAndRemoveRecursive(values, node, prefix, filter) {
    for (let char of Object.keys(node)) {
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
  let routeSegments = [];
  let rawRouteSegments = [];
  let index = 0;
  let routeSegment = "";
  let rawRouteSegment = "";
  let state = "NORMAL";

  let pushRouteSegment = (segment, rawSegment) => {
    if (!segment) return;
    let notSupportedInRR = (segment2, char) => {
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
    let char = routeId[index];
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
  let result = [];
  if (isIndex) {
    routeSegments = routeSegments.slice(0, -1);
  }
  for (let index = 0; index < routeSegments.length; index++) {
    let segment = routeSegments[index];
    let rawSegment = rawRouteSegments[index];
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
  for (let ext of extensions) {
    let name = basename + ext;
    let file = path.join(dir, name);
    if (fs.existsSync(file)) return file;
  }
  return void 0;
}

function findRouteModuleForFile(appDirectory, filepath, ignoredFileRegex) {
  let relativePath = normalizeSlashes(path.relative(appDirectory, filepath));
  let isIgnored = ignoredFileRegex.some(regex => regex.test(relativePath));
  if (isIgnored) return null;
  return filepath;
}

function findRouteModuleForFolder(appDirectory, filepath, ignoredFileRegex) {
  let relativePath = path.relative(appDirectory, filepath);
  let isIgnored = ignoredFileRegex.some(regex => regex.test(relativePath));
  if (isIgnored) return null;

  let routeRouteModule = findFile(filepath, "route", routeModuleExts);
  let routeIndexModule = findFile(filepath, "index", routeModuleExts);

  if (routeRouteModule && routeIndexModule) {
    let [segments, raw] = getRouteSegments(
      path.relative(appDirectory, filepath)
    );
    let routePath = createRoutePath(segments, raw, false);
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
  let routeConfigById = {};
  for (let id in routeManifest) {
    let route = routeManifest[id];
    routeConfigById[id] = {
      id: route.id,
      file: route.file,
      path: route.path,
      index: route.index,
      caseSensitive: route.caseSensitive
    };
  }
  let routeConfig = [];
  for (let id in routeConfigById) {
    let route = routeConfigById[id];
    let parentId = routeManifest[route.id].parentId;
    if (parentId === rootId) {
      routeConfig.push(route);
    } else {
      let parentRoute = parentId && routeConfigById[parentId];
      if (parentRoute) {
        parentRoute.children = parentRoute.children || [];
        parentRoute.children.push(route);
      }
    }
  }
  return routeConfig;
}

function getRoutePathConflictErrorMessage(pathname, routes) {
  let [taken, ...others] = routes;
  if (!pathname.startsWith("/")) pathname = "/" + pathname;
  return `\u26A0\uFE0F Route Path Collision: "${pathname}"\n\nThe following routes all define the same URL, only the first one will be used\n\n\u{1F7E2} ${taken}\n${others.map(route => `\u2B55\uFE0F\uFE0F ${route}`).join("\n")}\n`;
}

function getRouteIdConflictErrorMessage(routeId, files) {
  let [taken, ...others] = files;
  return `\u26A0\uFE0F Route ID Collision: "${routeId}"\n\nThe following routes all define the same Route ID, only the first one will be used\n\n\u{1F7E2} ${taken}\n${others.map(route => `\u2B55\uFE0F\uFE0F ${route}`).join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// Modified: flatRoutesUniversal — routeId uses full path for non-folder modules
// ---------------------------------------------------------------------------

function flatRoutesUniversal(appDirectory, routes, prefix = "routes") {
  let urlConflicts = new Map();
  let routeManifest = {};
  let prefixLookup = new PrefixLookupTrie();
  let uniqueRoutes = new Map();
  let routeIdConflicts = new Map();
  let routeIds = new Map();

  for (let file of routes) {
    let normalizedFile = normalizeSlashes(file);
    let routeExt = path.posix.extname(normalizedFile);
    let routeDir = path.posix.dirname(normalizedFile);
    let normalizedApp = normalizeSlashes(appDirectory);

    // Determine if this file is a folder module (route.jsx or index.jsx)
    let basename = path.posix
      .basename(normalizedFile)
      .slice(0, -routeExt.length);
    let isFolderModule = basename === "route" || basename === "index" || basename === "_layout";

    // Folder modules use directory path as routeId; all others use full file
    // path (minus extension), regardless of depth.
    let routeId = isFolderModule
      ? path.posix.relative(normalizedApp, routeDir)
      : path.posix
          .relative(normalizedApp, normalizedFile)
          .slice(0, -routeExt.length);

    let conflict = routeIds.get(routeId);
    if (conflict) {
      let currentConflicts = routeIdConflicts.get(routeId);
      if (!currentConflicts) {
        currentConflicts = [path.posix.relative(normalizedApp, conflict)];
      }
      currentConflicts.push(
        path.posix.relative(normalizedApp, normalizedFile)
      );
      routeIdConflicts.set(routeId, currentConflicts);
      continue;
    }
    routeIds.set(routeId, normalizedFile);
  }

  let sortedRouteIds = Array.from(routeIds).sort(
    ([a], [b]) => b.length - a.length
  );

  for (let [routeId, file] of sortedRouteIds) {
    let index = routeId.endsWith("_index");
    let [segments, raw] = getRouteSegments(routeId.slice(prefix.length + 1));
    let pathname = createRoutePath(segments, raw, index);

    routeManifest[routeId] = {
      file: file.slice(appDirectory.length + 1),
      id: routeId,
      path: pathname
    };
    if (index) routeManifest[routeId].index = true;

    let childRouteIds = prefixLookup.findAndRemove(routeId, value => {
      return [".", "/"].includes(value.slice(routeId.length).charAt(0));
    });
    prefixLookup.add(routeId);

    if (childRouteIds.length > 0) {
      for (let childRouteId of childRouteIds) {
        routeManifest[childRouteId].parentId = routeId;
      }
    }
  }

  let parentChildrenMap = new Map();
  for (let [routeId] of sortedRouteIds) {
    let config = routeManifest[routeId];
    if (!config.parentId) continue;
    let existingChildren = parentChildrenMap.get(config.parentId) || [];
    existingChildren.push(config);
    parentChildrenMap.set(config.parentId, existingChildren);
  }

  for (let [routeId] of sortedRouteIds) {
    let config = routeManifest[routeId];
    let originalPathname = config.path || "";
    let pathname = config.path;
    let parentConfig = config.parentId
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

    let lastRouteSegment = config.id
      .replace(new RegExp(`^${prefix}/`), "")
      .split(".")
      .pop();
    let isPathlessLayoutRoute =
      lastRouteSegment &&
      lastRouteSegment.startsWith("_") &&
      lastRouteSegment !== "_index";
    if (isPathlessLayoutRoute) continue;

    let conflictRouteId =
      originalPathname + (config.index ? "?index" : "");
    let conflict = uniqueRoutes.get(conflictRouteId);
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
    for (let [routeId, files] of routeIdConflicts.entries()) {
      console.error(getRouteIdConflictErrorMessage(routeId, files));
    }
  }

  if (urlConflicts.size > 0) {
    for (let [urlPath, routes2] of urlConflicts.entries()) {
      for (let i = 1; i < routes2.length; i++) {
        delete routeManifest[routes2[i].id];
      }
      let files = routes2.map(r => r.file);
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
  let routes = [];

  // Skip directories that match an ignore pattern
  let dirRelative = normalizeSlashes(path.relative(appDir, dir));
  let dirIgnored = ignoredFileRegex.some(regex => regex.test(dirRelative));
  if (dirIgnored) return routes;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true, encoding: "utf-8" });
  } catch {
    return routes;
  }

  // Check if this directory is a folder route (has route.jsx or index.jsx)
  let folderModule = findRouteModuleForFolder(appDir, dir, ignoredFileRegex);

  if (folderModule) {
    // This is a folder route — register the module, skip sibling files
    routes.push(folderModule);

    // Still recurse into subdirectories for child routes
    for (let entry of entries) {
      if (entry.isDirectory()) {
        let subdir = path.join(dir, entry.name);
        routes.push(...collectRouteFiles(subdir, appDir, ignoredFileRegex));
      }
    }
  } else if (findFile(dir, "_layout", routeModuleExts)) {
    // Layout folder — _layout.jsx acts as the layout/parent route for this
    // directory (getting the directory path as its route ID), while sibling
    // files are still treated as route modules (unlike route.jsx which makes
    // siblings co-located).
    let layoutModule = findFile(dir, "_layout", routeModuleExts);
    let layoutRoute = findRouteModuleForFile(appDir, normalizeSlashes(layoutModule), ignoredFileRegex);
    if (layoutRoute) routes.push(layoutRoute);

    for (let entry of entries) {
      let filepath = normalizeSlashes(path.join(dir, entry.name));
      if (entry.isDirectory()) {
        routes.push(...collectRouteFiles(path.join(dir, entry.name), appDir, ignoredFileRegex));
      } else if (entry.isFile() && filepath !== normalizeSlashes(layoutModule)) {
        let route = findRouteModuleForFile(appDir, filepath, ignoredFileRegex);
        if (route) routes.push(route);
      }
    }
  } else {
    // Organizational folder — all route-ext files are route modules
    for (let entry of entries) {
      let filepath = normalizeSlashes(path.join(dir, entry.name));

      if (entry.isDirectory()) {
        routes.push(
          ...collectRouteFiles(
            path.join(dir, entry.name),
            appDir,
            ignoredFileRegex
          )
        );
      } else if (entry.isFile()) {
        let route = findRouteModuleForFile(appDir, filepath, ignoredFileRegex);
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
  let {
    ignoredRouteFiles = [],
    rootDirectory: userRootDirectory = "routes"
  } = options;

  let appDirectory = getAppDirectory();
  let rootDirectory = path.resolve(appDirectory, userRootDirectory);
  let relativeRootDirectory = path.relative(appDirectory, rootDirectory);
  let prefix = normalizeSlashes(relativeRootDirectory);

  if (!fs.existsSync(rootDirectory)) {
    return [];
  }

  // User-provided patterns are relative to rootDirectory, but the ignore
  // checks test paths relative to appDirectory. Prefix with the route prefix
  // so they match correctly.
  let prefixedPatterns = ignoredRouteFiles.map(p => `${prefix}/${p}`);
  let ignoredFileRegex = Array.from(
    new Set(["**/.*", ...prefixedPatterns])
  )
    .map(re => makeRe(re))
    .filter(re => !!re);

  // Collect route files recursively from the root directory
  let entries = fs.readdirSync(rootDirectory, {
    withFileTypes: true,
    encoding: "utf-8"
  });

  let routes = [];
  for (let entry of entries) {
    let filepath = normalizeSlashes(path.join(rootDirectory, entry.name));

    if (entry.isDirectory()) {
      routes.push(
        ...collectRouteFiles(
          path.join(rootDirectory, entry.name),
          appDirectory,
          ignoredFileRegex
        )
      );
    } else if (entry.isFile()) {
      let route = findRouteModuleForFile(
        appDirectory,
        filepath,
        ignoredFileRegex
      );
      if (route) routes.push(route);
    }
  }

  let routeManifest = flatRoutesUniversal(appDirectory, routes, prefix);
  return routeManifestToRouteConfig(routeManifest);
}
