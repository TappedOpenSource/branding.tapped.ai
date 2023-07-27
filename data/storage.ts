/* eslint-disable camelcase */
import { Resize } from "@cloudinary/url-gen/actions";
import cloudinary from "../utils/cloudinary";

const INPUT_IMAGE_WIDTH = 512;
const INPUT_IMAGE_HEIGHT = 512;

export type Storage = {
    uploadInputImage: (input: { imagePath: string }) => Promise<{ url: string }>;
    deleteInputImage: (input: { public_id: string }) => Promise<void>;
};

const CloudinaryStorage: Storage = {
  uploadInputImage: async ({ imagePath }: { imagePath: string }): Promise<{ url: string }> => {
    const { public_id } = await cloudinary.v2.uploader.upload(imagePath, {
      upload_preset: "input_images",
    });

    const uploadedImage = cloudinary.cld.image(public_id);
    uploadedImage.resize(Resize
      .scale()
      .width(INPUT_IMAGE_WIDTH)
      .height(INPUT_IMAGE_HEIGHT),
    );
    const resizedUrl = uploadedImage.toURL();
    return { url: resizedUrl };
  },
  deleteInputImage: async ({ public_id }: { public_id: string }): Promise<void> => {
    await cloudinary.v2.uploader.destroy(public_id);
  },
};

export default CloudinaryStorage;
