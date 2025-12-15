use sha2::{Digest, Sha256};

#[tauri::command]
pub fn get_content_hash(content: String) -> String {
    // 1. Create a new hasher instance.
    let mut hasher = Sha256::new();

    // 2. Feed the content data to the hasher.
    // We convert the String content into a byte array slice.
    hasher.update(content.as_bytes());

    // 3. Finalize the hash computation.
    // `finalize()` consumes the hasher and produces the result (a 32-byte array for SHA-256).
    let hash_result = hasher.finalize();

    // 4. Convert the binary hash result into a hexadecimal string.
    // This is the clean, readable, fixed-length string (64 characters) we'll use as the key.
    hex::encode(hash_result)
}
