import * as esbuild from 'esbuild'
import esbuildPluginLicense from '../..'
import path from 'path'
import fs from 'fs'

process.chdir(__dirname)

describe('esbuildPluginLicense', () => {
  it('should generate dependencies and inject banner', async () => {
    const outdir = path.join(__dirname, 'dist')

    if (fs.existsSync(outdir)) {
      fs.rmdirSync(outdir, { recursive: true });
    }

    await esbuild.build({
      entryPoints: [path.join(__dirname, 'index.ts')],
      plugins: [esbuildPluginLicense({
        thirdParty: {
          excludedPackageTest: (packageName) => packageName.startsWith('@babel/')
        }
      })],
      bundle: true,
      platform: 'node',
      write: true,
      outdir
    })

    const outfiles = (await fs.promises.readdir(outdir)).map(file => ({
      path: file,
      content: fs.readFileSync(path.join(outdir, file)).toString()
    }))

    expect(outfiles).toMatchSnapshot()
  }, 100000)
})
