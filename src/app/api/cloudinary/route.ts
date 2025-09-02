import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.v2.utils.api_sign_request(
        { timestamp },
        process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
        signature,
        timestamp,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
    });
}
