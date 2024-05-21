import { NextResponse } from 'next/server'
import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-provider-ini'

const s3Client = new S3Client({
  endpoint: 'http://localhost:4566', // endpointにlocalStackのエンドポイントを指定する
  region: 'ap-northeast-1',
  credentials: fromIni({ profile: 'localstack' }),
  forcePathStyle: true, // このクライアントにバケットに対してパス形式のアドレス指定を使用するように強制します。
  // デフォルトはfalseだがtrueにしておかなとLocalStackで動作しない
})

export async function POST(request: Request) {
  const params = {
    Bucket: 'my-bucket',
  }
  try {
    const response = await s3Client.send(new CreateBucketCommand(params))
    return NextResponse.json({ response })
  } catch (err) {
    return NextResponse.json(err)
  }
}

export async function DELETE(request: Request) {
  const bucketName = 'my-bucket'
  const params = {
    Bucket: bucketName,
  }
  try {
    // NOTE: 先にバケットを空にしないと削除できない
    const { Buckets } = await s3Client.send(new ListBucketsCommand({}))
    if (!Buckets || !Buckets.some((bucket) => bucket.Name === bucketName)) {
      return
    }
    const listObjectsResponse = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
      }),
    )
    if (
      listObjectsResponse &&
      listObjectsResponse.Contents &&
      listObjectsResponse.Contents.length > 0
    ) {
      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: listObjectsResponse.Contents.map((obj) => ({
            Key: obj.Key,
          })),
        },
      }
      await s3Client.send(new DeleteObjectsCommand(deleteParams))
    }
    const response = await s3Client.send(new DeleteBucketCommand(params))
    return NextResponse.json({ response })
  } catch (err) {
    return NextResponse.json(err)
  }
}
