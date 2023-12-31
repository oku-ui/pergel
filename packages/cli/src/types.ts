export interface PergelConfig {
  /**
   * The name of the project.
   * @default 'pergel'
   */
  src?: string

  /**
   * The version of the project.
   * @default 'pergel/templates'
   */
  templateDir?: string
}

export interface ResolvedPergelConfig {
  /**
   * The name of the project.
   * @default 'pergel'
   */
  src: string

  /**
   * The version of the project.
   * @default 'pergel/templates'
   */
  templateDir: string
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

export interface DefineDownloadOptions {
  file?: {
    /**
     * Directory of file
     * @example
     * `packages/nuxt`
     */
    dir: string
    /**
     * File name
     * @example
     * `pergel.config.ts`
     */
    path: {
      /**
       * File name
       * @example
       * `pergel.config.ts`
       */
      fileName: string
      /**
       * Output file name
       * @example
       * `pergel.config.ts`
       */
      outputFileName: string
    }[]
    /**
     * Folder name
     * @default
     * `.tempPergel`
     */
    tempOutput?: string
  }
  folder?: {
    dir: string
    output: string
  }[]
  branch?: string
}
