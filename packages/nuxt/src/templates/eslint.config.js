import antfu from '@antfu/eslint-config'
import pergelEslint from 'pergel/eslint'

export default antfu(
  {},
  ...pergelEslint(),
)
