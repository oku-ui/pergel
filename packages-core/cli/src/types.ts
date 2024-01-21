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

    /**
     * The name of the project.
     * @default 'server'
     */
    server?: string
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

    /**
     * The name of the project.
     * @default 'server'
     */
    server: string
  }
  filePath: {

    /**
     * The name of the project.
     * @default 'nuxt.config.ts'
     */
    nuxtConfig: string
  }
}

export interface PergelReadme {
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
  projectName: string
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

      replace?: {
        /**
         * Replace string
         * @default
         * `changeName`
         */
        from: string
        /**
         * Replace string
         * @default
         * {projectName}
         * @example
         * `rocketProject`
         */
        to: string
      }

      /**
       * Force download
       * @default
       * `true`
       */
      forceClean: boolean
    }[]
  }
  folder?: {
    /**
     * Directory of folder
     * @example
     * `packages/nuxt`
     */
    dir: string

    /**
     * Output folder name
     * @example
     * `packages/nuxt`
     */
    output: string

    /**
     * Force download
     * @default
     * `true`
     */
    forceClean: boolean

    replace?: {
      /**
       * Replace string
       * @example
       * `changeName`
       */
      from: string
      /**
       * Replace string
       * @example
       * `rocketProject`
       */
      to: string
    }
  }[]
  branch?: string
}

export interface DefinePergel {
  (config: PergelConfig): PergelConfig
}
