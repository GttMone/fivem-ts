import esbuild from 'esbuild';
import { writeFile } from 'node:fs/promises';

const watch = process.argv.includes('--watch');
const envoirments = ['client', 'server'];
const buildMethod = watch ? 'context' : 'build'

/** @type {esbuild.BuildOptions} */
const client = {
    platform: 'browser',
    target: ['es2017'],
    format: 'iife'
}

/** @type {esbuild.BuildOptions} */
const server = {
    platform: 'node',
    target: ['node16'],
    format: 'cjs',
    packages: 'external'
}

for (const envoirment of envoirments) {
    const context = await esbuild[buildMethod]({
        entryPoints: [`./src/${envoirment}/${envoirment}.ts`],
        bundle: true,
        outdir: './dist',
        minify: !watch,
        ...(envoirment === 'client' ? client : server)
    });

    if (watch) {
        await context.watch();
        console.log(`Running envoirment ${envoirment} in development mode. Watching for changes...`);
    } else console.log(`Built envoirment ${envoirment} for production.`);
}

writeFile('.yarn.installed');