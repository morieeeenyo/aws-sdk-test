"use client"
import { useState } from "react"

import s3 from '@aws-sdk/client-s3';
import { useStorage } from "./hooks/useStorage";

export default function Storage() {
 const [file, setFile] = useState<File | null>(null)

 const {
  creaeteBucket,
  deleteBucket,
  putObject
 } = useStorage()

 const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return
  setFile(e.target.files[0])
 }

 const onCreteBucket = async (e: React.MouseEvent) => {
  e.preventDefault()
  await creaeteBucket()
 }

 const onDeleteBucket = async (e: React.MouseEvent) => {
  e.preventDefault()
  await deleteBucket()
 }

 const onPutObject = async (e: React.MouseEvent) => {
  e.preventDefault()
  await putObject(file)
 }

 return (
  <div>
   <form>
    <input type="file" onChange={onFileChange} />
    {file && <p>{file.name}</p>}
    <button onClick={onCreteBucket}>バケット作成</button>
    <button onClick={onDeleteBucket}>バケット削除</button>
    <button onClick={onPutObject}>ファイルアップロード</button>
   </form>
   <p className="text-center">Storage</p>
  </div>
 )
}