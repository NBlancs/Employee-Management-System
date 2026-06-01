import { d as defineEventHandler } from '../../_/nitro.mjs';
import { p as proxyBackendRequest } from '../../_/backend.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const ____path_ = defineEventHandler(async (event) => {
  return proxyBackendRequest(event);
});

export { ____path_ as default };
//# sourceMappingURL=_...path_.mjs.map
