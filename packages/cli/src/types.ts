export interface PergelConfig {
  /**
   * The name of the project.
   * @default 'Pergel'
   */
  src?: string

  /**
   * The branch to use for the active version of the project.
   */
  selectProject?: string

  cli?: {
    database?: {
      driver: 'drizzle'
      project: string
      selectedScript?: string
    }
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
