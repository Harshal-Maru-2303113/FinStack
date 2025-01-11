'use server'

export default async function uploadToImgBB(file: File){
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=a2c9cdce3e2059963260f180be4a123b", // Replace with your ImgBB API key
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();

      if (data.success) {
        return data.data.url; // Return the public URL of the uploaded image
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };