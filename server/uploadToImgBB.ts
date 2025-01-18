'use server'

// Function to upload an image to ImgBB and return its public URL
export default async function uploadToImgBB(file: File) {
    const formData = new FormData();  // Create a FormData object to send the file
    formData.append("image", file);   // Append the image file to the FormData object

    try {
      // Send a POST request to the ImgBB API with the image file and API key
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=a2c9cdce3e2059963260f180be4a123b", // Replace with your ImgBB API key
        {
          method: "POST",  // HTTP method for uploading
          body: formData,  // The body contains the FormData object with the file
        }
      );

      // If the response is not successful, throw an error
      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      // Parse the response JSON to extract the data
      const data = await response.json();

      // If the upload is successful, return the public URL of the image
      if (data.success) {
        return data.data.url;  // Return the public URL of the uploaded image
      } else {
        throw new Error("Image upload failed");  // Throw an error if upload fails
      }
    } catch (error) {
      console.error("Error uploading image:", error);  // Log the error
      throw error;  // Rethrow the error to be handled elsewhere
    }
}
