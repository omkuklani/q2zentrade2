import React, { useState } from 'react';

const App = () => {
  const [jsonData, setJsonData] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({
    popularity: true,
    subcategory: true,
    title: true,
    price: true,
  });
  const [availableFields, setAvailableFields] = useState(Object.keys(selectedAttributes));
  const [displayedFields, setDisplayedFields] = useState(['popularity', 'subcategory', 'title', 'price']);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          setJsonData(parsedData);
          setAvailableFields(Object.keys(parsedData['1']));
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleCheckboxChange = (attribute) => {
    setSelectedAttributes((prevAttributes) => ({
      ...prevAttributes,
      [attribute]: !prevAttributes[attribute],
    }));
  };

  const handleDisplayFieldChange = (e) => {
    const selectedOptions = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setDisplayedFields(selectedOptions);
  };

  const moveSelectedFields = (direction) => {
    const sourceList = direction === 'right' ? availableFields : displayedFields;
    const targetList = direction === 'right' ? displayedFields : availableFields;

    const selectedOptions = Array.from(document.getElementById('displayFields')).selectedOptions;
    const selectedFields = Array.from(selectedOptions).map((option) => option.value);

    const updatedSourceList = sourceList.filter((field) => !selectedFields.includes(field));
    const updatedTargetList = [...targetList, ...selectedFields];

    if (direction === 'right') {
      setAvailableFields(updatedSourceList);
      setDisplayedFields(updatedTargetList);
    } else {
      setAvailableFields(updatedTargetList);
      setDisplayedFields(updatedSourceList);
    }
  };

  return (
    <div className="App">
      <h1>JSON Display App</h1>
      <input type="file" accept=".json" onChange={handleFileUpload} />

      {jsonData && (
        <>
          <div>
            <label>
              Display Fields:
              <select
                multiple
                id="displayFields"
                onChange={handleDisplayFieldChange}
                value={displayedFields}
              >
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => moveSelectedFields('right')}>{'>>'}</button>
            <button onClick={() => moveSelectedFields('left')}>{'<<'}</button>
          </div>

          <table>
            <thead>
              <tr>
                {displayedFields.map((field) => (
                  <th key={field}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(jsonData)
                .sort((a, b) => jsonData[b].popularity - jsonData[a].popularity)
                .map((productId) => (
                  <tr key={productId}>
                    {displayedFields.map((field) => (
                      <td key={`${productId}-${field}`}>
                        {jsonData[productId][field]}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default App;
