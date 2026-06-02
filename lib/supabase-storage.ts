import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase URL or Service Role Key in environment configuration.");
}

// Highly secure, isolated server-side client bypass instance
export const supabaseStorage = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Handles binary stream uploading directly into Supabase Storage Buckets
 * @returns The permanent, public asset string URL
 */
export async function uploadAsset(file: File, folder: "covers" | "previews"): Promise<string> {
  // Generate an isolated, completely unique filename tracking string
  const fileExtension = file.name.split(".").pop();
  const uniqueFileName = `${folder}/${crypto.randomUUID()}.${fileExtension}`;

  // Convert the browser file binary representation cleanly into an array buffer stream
  const fileArrayBuffer = await file.arrayBuffer();

  const { data, error } = await supabaseStorage.storage
    .from("book-assets")
    .upload(uniqueFileName, fileArrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase asset upload rejected: ${error.message}`);
  }

  // Retrieve the permanent open CDN public asset path mapping string
  const { data: publicUrlData } = supabaseStorage.storage
    .from("book-assets")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * Safely removes a file from the Supabase bucket using its public URL
 */
export async function deleteAssetByUrl(publicUrl: string): Promise<boolean> {
  try {
    if (!publicUrl) return false;

    // Extract the storage file path from the public URL
    // e.g., https://supabase.co
    const urlParts = publicUrl.split("/book-assets/");
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabaseStorage.storage
      .from("book-assets")
      .remove([filePath]);

    if (error) {
      console.error(`Failed to delete obsolete asset from bucket: ${error.message}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error running asset deletion:", err);
    return false;
  }
}
