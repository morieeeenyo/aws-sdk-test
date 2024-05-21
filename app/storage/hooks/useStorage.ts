import s3 from '@aws-sdk/client-s3'
import axios from 'axios'

export const useStorage = () => {
  const creaeteBucket = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/storage/bucket`)
  }

  const deleteBucket = async () => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/storage/bucket`)
  }

  const putObject = async (file: File | null) => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/storage/object`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }

  return {
    creaeteBucket,
    deleteBucket,
    putObject,
  }
}
