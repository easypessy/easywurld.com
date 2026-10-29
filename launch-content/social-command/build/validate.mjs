/* Compatibility wrapper. Active campaign validation lives in marketing. */
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
await import(pathToFileURL(resolve(here,'../../../marketing/validate-plan.mjs')).href);
