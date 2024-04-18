const filterFunction = (searchFields, object, searchItem) => {
  // if (!searchItem || typeof searchItem !== "string") {
  //   return true;
  // }
  const searchTerm = searchItem.toLocaleLowerCase("tr");

  return searchFields.some((field) => {
    let fieldValue;

    fieldValue = object[field];
    return (
      fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm)
    );
  });
};

export default filterFunction;
