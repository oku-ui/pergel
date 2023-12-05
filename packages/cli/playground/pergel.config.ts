import { definePergel } from 'pergel/core'

export default definePergel({
  src: 'pergel',
  selectProject: 'project2',
  cli: {
    database: {
      driver: 'drizzle',
      project: 'project2',
      selectedScript: 'migrate',
    },
  },
})
