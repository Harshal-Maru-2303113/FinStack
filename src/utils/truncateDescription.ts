const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 2) {
      return words.slice(0, 2).join(" ") + " ...";
    }
    return description;
  };

export default truncateDescription;