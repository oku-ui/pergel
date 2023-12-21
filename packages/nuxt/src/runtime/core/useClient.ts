import type { H3Event } from 'h3'
import { usePergelRuntime } from './utils/usePergelRuntime'
import type { PergelGlobalContext } from '#pergel/types'

// TODO: runtimeClientGenerator
export function clientFunctionTemplate<ClientType, RuntimeConfigType, MapType = object>(
  moduleName: PergelGlobalContext['moduleName'],
) {
  const clientMap = new Map<string, {
    client: ClientType
  }>()

  // TODO: maybe params should be an object
  async function clientInit(
    data: Omit<PergelGlobalContext, 'moduleName'>,
    clientObject: (runtime: RuntimeConfigType) => ClientType,
    event?: H3Event,
    additionalMapValues?: object,
    customName?: string,
  ): Promise<{
    client: ClientType
    mapValue: Map<string, {
      projectName: string
      client: ClientType
    } & MapType>
    runtime: RuntimeConfigType
  }> {
    let moduleClient = clientMap.get(data.projectName)?.client as ClientType | undefined
    const { selectProject } = usePergelRuntime<RuntimeConfigType>({
      moduleName,
      projectName: data.projectName,
    }, event, customName)

    if (moduleClient) {
      return {
        client: moduleClient,
        mapValue: clientMap as any,
        runtime: selectProject,
      }
    }

    clientMap.set(data.projectName, {
      client: moduleClient = clientObject(selectProject),
      ...additionalMapValues,
    })

    return {
      client: moduleClient,
      mapValue: clientMap as any,
      runtime: selectProject,
    }
  }

  return {
    mapValue: clientMap,
    clientInit,
  }
}
