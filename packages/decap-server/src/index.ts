// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import express from 'express';

import { registerCommonMiddlewares } from './middlewares/common';
import { registerMiddleware as registerLocalGit } from './middlewares/localGit';
import { registerMiddleware as registerLocalFs } from './middlewares/localFs';
import { createLogger } from './logger';

const app = express();
const port = process.env.PORT || 8081;
const level = process.env.LOG_LEVEL || 'info';

const logger = createLogger({ level });
const options = {
  logger,
};

registerCommonMiddlewares(app, options);

try {
  const mode = process.env.MODE || 'fs';
  if (mode === 'fs') {
    registerLocalFs(app, options);
  } else if (mode === 'git') {
    registerLocalGit(app, options);
  } else {
    throw new Error(`Unknown proxy mode '${mode}'`);
  }
} catch (error) {
  logger.error(error instanceof Error ? error.message : 'Unknown error');
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

app.listen(port, () => {
  logger.info(`Decap CMS Proxy Server listening on port ${port}`);
});
