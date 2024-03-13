import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  paginateListObjectsV2,
} from '@aws-sdk/client-s3'
import type {
  DeleteObjectCommandInput,
  DeleteObjectsCommandInput,
  GetObjectCommandInput,
  ListObjectsCommandInput,
  PutObjectCommandInput,
  S3Client,

  _Object,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { PartinalKey } from '../../../core/types/module'

export function useS3(client: S3Client, params: {
  bucket: string
}) {
  const signedUrl = async (
    object: PartinalKey<GetObjectCommandInput, 'Bucket'>,
    options?: Parameters<typeof getSignedUrl>[2],
  ) => {
    const getFile = new GetObjectCommand({
      ...object,
      Bucket: params.bucket || object.Bucket,
    })

    return await getSignedUrl(client, getFile, {
      expiresIn: 60 * 60 * 1,
      ...options,
    })
  }

  const uploadObject = async (
    input: PartinalKey<PutObjectCommandInput, 'Bucket'>,
  ) => {
    const command = new PutObjectCommand({
      ...input,
      Bucket: params.bucket || input.Bucket,
    })

    return await client.send(command)
  }

  const removeObject = async (
    input: PartinalKey<DeleteObjectCommandInput, 'Bucket'>,
  ) => {
    const command = new DeleteObjectCommand({
      ...input,
      Bucket: params.bucket || input.Bucket,
    })
    return await client.send(command)
  }

  const removeObjects = async (data: {
    listObjects: PartinalKey<ListObjectsCommandInput, 'Bucket'>
    input: DeleteObjectsCommandInput
  }) => {
    const deleteParams: DeleteObjectsCommandInput = {
      Bucket: params.bucket || data.listObjects.Bucket,
      Delete: { Objects: [] },
    }

    const objectData = new ListObjectsCommand({
      ...data.listObjects,
      Bucket: params.bucket || data.listObjects.Bucket,
    })

    const objects = await client.send(objectData)

    if (objects.Contents?.length) {
      for await (const { Key } of objects.Contents) {
        deleteParams.Delete?.Objects?.push({
          Key,
        })
      }

      return await client.send(new DeleteObjectsCommand(deleteParams))
    }
  }

  const getObject = async (
    input: PartinalKey<GetObjectCommandInput, 'Bucket'>,
  ) => {
    const command = new GetObjectCommand({
      ...input,
      Bucket: params.bucket || input.Bucket,
    })
    return await client.send(command)
  }

  const listAllObjects = async (
    bucket?: string,
  ) => {
    const Bucket = bucket || params.bucket
    const allObjects: _Object[] = []
    for await (const obj of paginateListObjectsV2({ client }, { Bucket }))
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
