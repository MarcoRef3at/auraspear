const path = require('path')

const buildEslintCommand = fileNames =>
  `eslint ${fileNames.map(f => `"${path.relative(process.cwd(), f)}"`).join(' ')}`

const buildPrettierCommand = fileNames =>
  `prettier --write ${fileNames.map(f => `"${path.relative(process.cwd(), f)}"`).join(' ')}`

const buildTscCommand = () =>
  process.platform === 'win32'
    ? 'node_modules\\.bin\\tsc.cmd --noEmit --pretty'
    : 'tsc --noEmit --pretty'

module.exports = {
  '*.{ts,tsx,js,jsx}': [buildEslintCommand, buildTscCommand],
  '*.{ts,tsx,js,jsx,json,css,md,yml,yaml}': [buildPrettierCommand],
}
