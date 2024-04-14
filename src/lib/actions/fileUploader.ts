import { StorageError } from "@supabase/storage-js/src/lib/errors"
import supabase from "../supabaseClient";
import { ActionResult } from "./actionResult";


type FileData = { path: string; id: string; fullPath: string }

export type FileMetadata = {
  data: FileData,
  error: StorageError | null,
  publicUrl?: string
}

const privateBucket: string = process.env.PRIVATE_STORAGE_BUCKET!
const publicBucket: string = process.env.PUBLIC_STORAGE_BUCKET!



export async function uploadFiles(bucket: string, orgId: string, files: File[]): Promise<FileMetadata[]> {
  const result = await Promise.all(
    files.map(async (file) => {
      const { error, data } = await supabase.storage.from(bucket).upload(`${orgId}/${file.name}`, file, {
        upsert: true
      });

      const result: FileMetadata = {
        error: error as StorageError | null,
        data: data as FileData
      }
      if (error === null) {
        const publicUrlData = supabase.storage.from(bucket).getPublicUrl(data!.path);
        result.publicUrl = publicUrlData.data.publicUrl
      }
      return result
    })
  )
  return result as FileMetadata[]
}


export async function upLoadPublicFiles(orgId: string, files: File[]): Promise<ActionResult<FileMetadata[]>> {
  try {
    const result = await uploadFiles(publicBucket, orgId, files)
    return {
      data: result
    }
  } catch (e) {
    return {
      error: (e as StorageError).message
    }
  }


}


