import { ActionResult } from "./actions/actionResult";
import supabase from "./supabaseClient";
import { StorageError } from "@supabase/storage-js/src/lib/errors"

export type FileMetadata = {
  data: { path: string; },
  error: StorageError | null

}

const privateBucket: string = process.env.PRIVATE_STORAGE_BUCKET!
const publicBucket: string = process.env.PUBLIC_STORAGE_BUCKET!



export async function uploadFiles(bucket: string, orgId: string, files: File[]): Promise<FileMetadata[]> {
  const result = await Promise.all(
    files.map((file) => {
      return supabase.storage.from(bucket).upload(`${orgId}/${file.name}`, file)
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


