import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";

const s3Client = new S3Client({
 endpoint: "http://localhost:4566", // endpointにlocalStackのエンドポイントを指定する
 region: 'ap-northeast-1',
 credentials: fromIni({ profile: 'localstack' }),
 forcePathStyle: true // このクライアントにバケットに対してパス形式のアドレス指定を使用するように強制します。
 // デフォルトはfalseだがtrueにしておかなとLocalStackで動作しない
})

//Upload image to AWS S3
export async function POST(request: Request) {

 const formData = await request.formData();
 const file: any = formData.get("file");
 const fileName = file.name;

 // File オブジェクトから Buffer に変換
 const buffer = Buffer.from(await file?.arrayBuffer());

 // アップロードパラメータの設定
 const uploadParams: any = {
  Bucket: "my-bucket",
  Key: fileName, //保存時の画像名
  Body: buffer, //input fileから取得
 };

 try {
  //画像のアップロード
  const command = new PutObjectCommand(uploadParams);
  const uploadResult = await s3Client.send(command);
  console.log("Upload success:", uploadResult);
  const imageUrl = `https://my-bucket.s3.ap-northeast-1.amazonaws.com/${fileName}`;
  return NextResponse.json({ imageUrl });
 } catch (err) {
  console.error(err);
  return NextResponse.json(err);
 }
}