interface PergelConfig {
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
}

export function definePergel(config: PergelConfig) {
  return config
}
