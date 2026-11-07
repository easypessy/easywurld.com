/* Compatibility entry point. The active campaign has one source of truth.
 * Run node marketing/build-plan.mjs, or this wrapper.
 * Legacy October sources are archived and are never read by this builder.
 */
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
await import(pathToFileURL(resolve(here, '../../../marketing/build-plan.mjs')).href);
