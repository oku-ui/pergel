export interface PergelConfig {
  /**
   * The name of the project.
   * @default 'Pergel'
   */
  src?: string

  /**
   * The branch to use for the active version of the project.
   * @default 'main'
   */
  activeBranch?: string

  cli?: {
    database?: {
      driver: 'drizzle'
      project: string
      branch: string
      selectedScript?: string
    }
  }
}

export interface PergelYaml {
  [branchName: string]: {
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
}
