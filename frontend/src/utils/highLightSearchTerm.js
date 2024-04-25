export  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    const normalizedText = text.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const startIndex = normalizedText.indexOf(normalizedSearchTerm);
    if (startIndex !== -1) {
      const endIndex = startIndex + searchTerm.length;
      const highlightedText = (
        <>
          {text.substring(0, startIndex)}
          <span className="bg-yellow-300">{text.substring(startIndex, endIndex)}</span>
          {text.substring(endIndex)}
        </>
       
      );
      return highlightedText;
    }
    return text;
  };