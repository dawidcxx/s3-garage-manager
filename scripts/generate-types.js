import fs from 'node:fs';
import openapiTS, { astToString } from 'openapi-typescript';

const inputPath = new URL('./../generate/garage-admin-v1.yml', import.meta.url);
const outputPath = new URL('../src/api/garage/garage-schema.d.ts', import.meta.url);

const ast = await openapiTS(inputPath);
const contents = astToString(ast);

fs.writeFileSync(outputPath, contents);
