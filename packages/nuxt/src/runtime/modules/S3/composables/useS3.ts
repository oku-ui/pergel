import type { H3Event } from 'h3'
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
  paginateListObjectsV2,
} from '@aws-sdk/client-s3'
import type {
  DeleteObjectCommandInput,
  DeleteObjectsCommandInput,
  GetObjectCommandInput,
  ListObjectsCommandInput,
  PutObjectCommandInput,
  _Object,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { S3ModuleRuntimeConfig } from '../types'
import type { PartinalKey } from '../../../core/types/module'
import { usePergelContext } from '../../../server/utils/usePergelContext'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export function usePergelS3(
  this: PergelGlobalContextOmitModule,
  params: {
    pergel?: PergelGlobalContextOmitModule
    event?: H3Event
  },
) {
  const context = params.pergel || this

  if (!context || !context.projectName)
    throw new Error('Pergel is not defined')

  const { selectData, runtime } = usePergelContext<'s3'>({
    moduleName: 'S3',
    projectName: context.projectName,
  }, (runtime) => {
    if (!runtime)
      throw new Error('S3 is not defined')

    return {
      s3: {
        client: new S3Client({
          region: runtime.region,
          endpoint: runtime.endpoint,
          credentials: {
            accessKeyId: runtime.accessKeyId,
            secretAccessKey: runtime.secretAccessKey,
          },
        }),
      },
    }
  }, params.event)

  if (!selectData?.s3?.client || !runtime)
    throw new Error('S3 is not defined')

  const s3Composables = S3Composables.call({
    client: selectData.s3.client,
    runtime,
  })

  return {
    ...s3Composables as ReturnType<typeof S3Composables>,
    client: selectData.s3.client,
  }
}

function S3Composables(this: {
  client: S3Client
  runtime: S3ModuleRuntimeConfig
}) {
  const signedUrl = async (
    object: PartinalKey<GetObjectCommandInput, 'Bucket'>,
    options?: Parameters<typeof getSignedUrl>[2],
  ) => {
    const getFile = new GetObjectCommand({
      ...object,
      Bucket: this.runtime.bucket || object.Bucket,
    })

    return await getSignedUrl(this.client, getFile, {
      expiresIn: 60 * 60 * 1,
      ...options,
    })
  }

  const uploadObject = async (
    input: PartinalKey<PutObjectCommandInput, 'Bucket'>,
  ) => {
    const command = new PutObjectCommand({
      ...input,
      Bucket: this.runtime.bucket || input.Bucket,
    })

    return await this.client.send(command)
  }

  const removeObject = async (
    input: PartinalKey<DeleteObjectCommandInput, 'Bucket'>,
  ) => {
    const command = new DeleteObjectCommand({
      ...input,
      Bucket: this.runtime.bucket || input.Bucket,
    })
    return await this.client.send(command)
  }

  const removeObjects = async (data: {
    listObjects: PartinalKey<ListObjectsCommandInput, 'Bucket'>
    input: DeleteObjectsCommandInput
  }) => {
    const deleteParams: DeleteObjectsCommandInput = {
      Bucket: this.runtime.bucket || data.listObjects.Bucket,
      Delete: { Objects: [] },
    }

    const objectData = new ListObjectsCommand({
      ...data.listObjects,
      Bucket: this.runtime.bucket || data.listObjects.Bucket,
    })

    const objects = await this.client.send(objectData)

    if (objects.Contents?.length) {
      for await (const { Key } of objects.Contents) {
        deleteParams.Delete?.Objects?.push({
          Key,
        })
      }

      return await this.client.send(new DeleteObjectsCommand(deleteParams))
    }
  }

  const getObject = async (
    input: PartinalKey<GetObjectCommandInput, 'Bucket'>,
  ) => {
    const command = new GetObjectCommand({
      ...input,
      Bucket: this.runtime.bucket || input.Bucket,
    })
    return await this.client.send(command)
  }

  const listAllObjects = async (
    bucket?: string,
  ) => {
    const Bucket = bucket || this.runtime.bucket
    const allObjects: _Object[] = []
    for await (const obj of paginateListObjectsV2({ client: this.client }, { Bucket }))
      allObjects.push(...(obj.Contents ?? []))

    return allObjects
  }

  return {
    signedUrl,
    uploadObject,
    removeObject,
    removeObjects,
    getObject,
    listAllObjects,
  }
}
