export interface PergelConfig {
  /**
   * The name of the project.
   * @default 'Pergel'
   */
  src?: string

  /**
   * The package manager to use.
   * @default 'pnpm'
   */
  packageManager?: 'npm' | 'yarn' | 'pnpm'

  cli?: {
    project?: string
    module?: string
    script?: string
  }
}

export interface PergelYaml {
  [moduleName: string]: {
    [projectName: string]: {
      packageJson?: {
        dependencies?: string
        devDependencies?: string
      }
      scripts?: {
        [scriptName: string]: string
      }
      env?: {
        [envName: string]: string
      }
    }
  }
}
