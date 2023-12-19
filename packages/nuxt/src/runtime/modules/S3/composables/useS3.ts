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
import consola from 'consola'
import type { PartinalKey } from '../../../core/types'
import type { S3ModuleRuntimeConfig } from '../types'
import { clientFunctionTemplate } from '../../../core/useClient'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

const { clientInit } = clientFunctionTemplate<S3Client, S3ModuleRuntimeConfig>('S3')

export const pergelS3Client = clientInit

export async function useS3(
  this: PergelGlobalContextOmitModule,
  pergel?: PergelGlobalContextOmitModule,
  event?: H3Event,
) {
  const _pergel = pergel || this

  if (!_pergel || !_pergel.projectName)
    throw new Error('Pergel is not defined')

  const { client, runtime } = await pergelS3Client(_pergel, runtime => new S3Client({
    region: runtime.region,
    endpoint: runtime.endpoint,
    credentials: {
      accessKeyId: runtime.accessKeyId,
      secretAccessKey: runtime.secretAccessKey,
    },
  }), event)

  if (!client)
    consola.error('S3 is not defined')

  async function signedUrl(object: PartinalKey<GetObjectCommandInput, 'Bucket'>, options?: Parameters<typeof getSignedUrl>[2]) {
    const getFile = new GetObjectCommand({
      ...object,
      Bucket: runtime.bucket || object.Bucket,
    })

    return await getSignedUrl(client!, getFile, {
      expiresIn: 60 * 60 * 1,
      ...options,
    })
  }

  async function uploadObject(input: PartinalKey<PutObjectCommandInput, 'Bucket'>) {
    const command = new PutObjectCommand({
      ...input,
      Bucket: runtime.bucket || input.Bucket,
    })

    return await client!.send(command)
  }

  async function removeObject(input: PartinalKey<DeleteObjectCommandInput, 'Bucket'>) {
    const command = new DeleteObjectCommand({
      ...input,
      Bucket: runtime.bucket || input.Bucket,
    })
    return await client!.send(command)
  }

  async function removeObjects(data: {
    listObjects: PartinalKey<ListObjectsCommandInput, 'Bucket'>
    input: DeleteObjectsCommandInput
  }) {
    const deleteParams: DeleteObjectsCommandInput = {
      Bucket: runtime.bucket || data.listObjects.Bucket,
      Delete: { Objects: [] },
    }

    const objectData = new ListObjectsCommand({
      ...data.listObjects,
      Bucket: runtime.bucket || data.listObjects.Bucket,
    })

    const objects = await client!.send(objectData)

    if (objects.Contents?.length) {
      for await (const { Key } of objects.Contents) {
        deleteParams.Delete?.Objects?.push({
          Key,
        })
      }

      return await client!.send(new DeleteObjectsCommand(deleteParams))
    }
  }

  async function getObject(input: PartinalKey<GetObjectCommandInput, 'Bucket'>) {
    const command = new GetObjectCommand({
      ...input,
      Bucket: runtime.bucket || input.Bucket,
    })
    return await client!.send(command)
  }

  async function listAllObjects(bucket?: string) {
    const Bucket = bucket || runtime.bucket
    const allObjects: _Object[] = []
    for await (const obj of paginateListObjectsV2({ client }, { Bucket }))
      allObjects.push(...(obj.Contents ?? []))

    return allObjects
  }

  return {
    client,
    signedUrl,
    uploadObject,
    removeObject,
    removeObjects,
    getObject,
    listAllObjects,
  }
}
