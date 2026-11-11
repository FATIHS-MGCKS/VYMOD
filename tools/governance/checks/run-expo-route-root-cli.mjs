#!/usr/bin/env node
import { checkExpoRouteRoot } from "./expo-route-root.mjs";

const result = checkExpoRouteRoot({ skipExportProbe: true });
if (result.status !== "pass") {
  for (const err of result.errors) console.error(err);
  process.exit(1);
}
console.log(`expo-route-root: ${result.meta.routerDirectory}`);
