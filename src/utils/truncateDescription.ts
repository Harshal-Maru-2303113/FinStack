// Function to truncate a description string to a maximum of two words followed by ellipsis "..."
const truncateDescription = (description: string) => {
  // Split the description into words using space as a delimiter
  const words = description.split(" ");

  // Check if there are more than 2 words in the description
  if (words.length > 2) {
      // If more than 2 words, take the first two words and append " ..."
      return words.slice(0, 2).join(" ") + " ...";
  }

  // If there are 2 or fewer words, return the description as is
  return description;
};

// Export the function to use it in other parts of the application
export default truncateDescription;
