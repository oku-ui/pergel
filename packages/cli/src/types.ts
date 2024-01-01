export interface Pergel {
  options: {
    scanDirs: string[]
    ignore?: string[]
  }
}

export interface PergelConfig {

  dir?: {
    /**
     * The name of the project.
     * @default 'pergel'
     */
    pergel?: string
    /**
     * The version of the project.
     * @default 'pergel/templates'
     */
    template?: string
  }
  filePath?: {

    /**
     * The name of the project.
     * @default 'nuxt.config.ts'
     */
    nuxtConfig?: string
  }
}

export interface ResolvedPergelConfig {
  dir: {
    /**
     * The name of the project.
     * @default 'pergel'
     */
    pergel: string
    /**
     * The version of the project.
     * @default 'pergel/templates'
     */
    template: string
  }
  filePath: {

    /**
     * The name of the project.
     * @default 'nuxt.config.ts'
     */
    nuxtConfig: string
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

export interface DefineDownloadOptions {
  /**
   * Folder name
   * @default
   * `.tempPergel`
   */
  tempOutput: string
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

      /**
       * Force download
       * @default
       * `true`
       */
      forceClean: boolean
    }[]
  }
  folder?: {
    dir: string
    output: string
    forceClean: boolean
  }[]
  branch?: string
}
