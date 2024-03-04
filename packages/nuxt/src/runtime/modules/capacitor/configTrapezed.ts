import type { MobileProjectConfig } from '@trapezedev/project'
import { MobileProject } from '@trapezedev/project'
import type { NuxtPergel } from '../../core/types/nuxtModule'

export async function trapezedRun(params: {
  nuxt: NuxtPergel
}) {
  const config: MobileProjectConfig = {
    ios: {
      path: 'ios/App',
    },
    android: {
      path: 'android',
    },
  }

  const project = new MobileProject(params.nuxt.options.rootDir, config)
  await project.load()

  console.log('project', project)

  //   const appTarget = project.ios!.getAppTarget()
  //   await project.ios?.addEntitlements(appTarget?.name ?? null, null, {
  //     'keychain-access-groups': ['group1', 'group2'],
  //   })

  // If you want to see the changes before committing
  // const changes = project.vfs.all();

  await project.commit()
}
