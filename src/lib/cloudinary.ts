import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function uploadToCloudinary(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "project-logos",
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result.secure_url)
                }
            ).end(buffer)
        })
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        throw error
    }
} 