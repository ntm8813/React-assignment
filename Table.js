import React, { useState, useEffect } from 'react';
import './Table.css';

const initialData = [
  {
    "Geography": "North America",
    "Product 1": 10000000,
    "Product 2": 3000000,
    "Product 3": 2000000,
    "isDefault": true,
    "sub_geographies": [
      { "Geography": "United States", "Product 1": 8000000, "Product 2": 2400000, "Product 3": 1600000, "isDefault": true },
      { "Geography": "Canada", "Product 1": 2000000, "Product 2": 600000, "Product 3": 400000, "isDefault": true }
    ]
  },
  {
    "Geography": "Europe",
    "Product 1": 4000000,
    "Product 2": 500000,
    "Product 3": 250000,
    "isDefault": true,
    "sub_geographies": [
      { "Geography": "United Kingdom", "Product 1": 1400000, "Product 2": 175000, "Product 3": 87500, "isDefault": true },
      { "Geography": "Germany", "Product 1": 1200000, "Product 2": 150000, "Product 3": 75000, "isDefault": true },
      { "Geography": "France", "Product 1": 1400000, "Product 2": 175000, "Product 3": 87500, "isDefault": true }
    ]
  }
];

const initialProductNames = ["Product 1", "Product 2", "Product 3"];

const ExpandableTable = () => {
  const [data, setData] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [updatedProductNames, setUpdatedProductNames] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('tableData')) || initialData;
    const savedProductNames = JSON.parse(localStorage.getItem('productNames')) || initialProductNames;

    setData(savedData);
    setProductNames(savedProductNames);
    setUpdatedData(savedData);
    setUpdatedProductNames(savedProductNames);
  }, []);

  const computeTotal = (row) => {
    return productNames.reduce((sum, product) => sum + (row[product] || 0), 0);
  };

  const adjustData = (newData) => {
    const adjustedData = newData.map(row => ({
      ...row,
      Total: computeTotal(row),
      sub_geographies: row.sub_geographies ? row.sub_geographies.map(subRow => ({
        ...subRow,
        Total: computeTotal(subRow)
      })) : []
    }));
    setUpdatedData(adjustedData);
  };

  const handleCellChange = (e, rowIndex, subRowIndex, product) => {
    const newValue = parseInt(e.target.value) || 0;
    const newData = [...updatedData];
    if (subRowIndex === null) {
      newData[rowIndex][product] = newValue;
    } else {
      newData[rowIndex].sub_geographies[subRowIndex][product] = newValue;
      newData[rowIndex][product] = newData[rowIndex].sub_geographies.reduce((sum, subRow) => sum + (subRow[product] || 0), 0);
    }
    adjustData(newData);
  };

  const handleProductNameChange = (e, index) => {
    const newProductNames = [...updatedProductNames];
    newProductNames[index] = e.target.value;
    setUpdatedProductNames(newProductNames);
  };

  const handleGeographyChange = (e, rowIndex, subRowIndex = null) => {
    const newData = [...updatedData];
    if (subRowIndex === null) {
      newData[rowIndex].Geography = e.target.value;
    } else {
      newData[rowIndex].sub_geographies[subRowIndex].Geography = e.target.value;
    }
    setUpdatedData(newData);
  };

  const addRow = (isSubGeography, parentIndex = null) => {
    const newData = [...updatedData];
    const newRow = {
      "Geography": isSubGeography ? "New Sub-Geography" : "New Geography",
      "isDefault": false
    };
    updatedProductNames.forEach(product => {
      newRow[product] = 0;
    });
    if (isSubGeography && parentIndex !== null) {
      newData[parentIndex].sub_geographies.push(newRow);
      newData[parentIndex][productNames[0]] = newData[parentIndex].sub_geographies.reduce((sum, subRow) => sum + (subRow[productNames[0]] || 0), 0);
    } else {
      newRow.sub_geographies = [];
      newData.push(newRow);
    }
    adjustData(newData);
  };

  const deleteRow = (rowIndex, subRowIndex = null) => {
    const newData = [...updatedData];
    if (subRowIndex === null) {
      newData.splice(rowIndex, 1);
    } else {
      newData[rowIndex].sub_geographies.splice(subRowIndex, 1);
      newData[rowIndex][productNames[0]] = newData[rowIndex].sub_geographies.reduce((sum, subRow) => sum + (subRow[productNames[0]] || 0), 0);
    }
    adjustData(newData);
  };

  const toggleSubGeographies = (rowIndex) => {
    const newData = [...updatedData];
    newData[rowIndex].showSubGeographies = !newData[rowIndex].showSubGeographies;
    setUpdatedData(newData);
  };

  const addProduct = () => {
    const newProductName = `Product ${updatedProductNames.length + 1}`;
    const newProductNames = [...updatedProductNames, newProductName];
    setUpdatedProductNames(newProductNames);
  };

  const deleteProduct = (productKey) => {
    const newProductNames = updatedProductNames.filter(name => name !== productKey);
    setUpdatedProductNames(newProductNames);
  };

  const computeColumnTotals = () => {
    const totals = {};
    updatedProductNames.forEach(product => {
      totals[product] = updatedData.reduce((sum, row) => {
        let subTotal = row[product] || 0;
        if (row.sub_geographies) {
          subTotal += row.sub_geographies.reduce((subSum, subRow) => subSum + (subRow[product] || 0), 0);
        }
        return sum + subTotal;
      }, 0);
    });
    return totals;
  };

  const columnTotals = computeColumnTotals();
  const overallTotal = Object.values(columnTotals).reduce((sum, value) => sum + value, 0);

  const handleUpdate = () => {
    localStorage.setItem('tableData', JSON.stringify(updatedData));
    localStorage.setItem('productNames', JSON.stringify(updatedProductNames));
    setData(updatedData);
    setProductNames(updatedProductNames);
  };

  const renderRows = () => {
    return updatedData.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        <tr>
          <td>
            <div className="cell-content">
              <input
                type="text"
                value={row.Geography}
                onChange={(e) => handleGeographyChange(e, rowIndex)}
              />
              {row.sub_geographies && (
                <button onClick={() => toggleSubGeographies(rowIndex)}>
                  {row.showSubGeographies ? "↑" : "↓"}
                </button>
              )}
            </div>
          </td>
          {updatedProductNames.map(product => (
            <td key={product}>
              <div className="cell-content">
                <input
                  type="text"
                  value={row[product]}
                  onChange={(e) => handleCellChange(e, rowIndex, null, product)}
                  readOnly={row.sub_geographies && row.sub_geographies.length > 0} // ReadOnly if there are sub geographies
                />
              </div>
            </td>
          ))}
          <td>
            <div className="cell-content">{computeTotal(row)}</div>
          </td>
          <td>
            <div className="cell-content">
              <button onClick={() => addRow(true, rowIndex)}>+</button>
              <button onClick={() => deleteRow(rowIndex)}>-</button>
            </div>
          </td>
        </tr>
        {row.showSubGeographies && row.sub_geographies && row.sub_geographies.map((subRow, subRowIndex) => (
          <tr key={`${rowIndex}-${subRowIndex}`}>
            <td style={{ paddingLeft: '20px' }}>
              <div className="cell-content">
                <input
                  type="text"
                  value={subRow.Geography}
                  onChange={(e) => handleGeographyChange(e, rowIndex, subRowIndex)}
                />
              </div>
            </td>
            {updatedProductNames.map(product => (
              <td key={product}>
                <div className="cell-content">
                  <input
                    type="text"
                    value={subRow[product]}
                    onChange={(e) => handleCellChange(e, rowIndex, subRowIndex, product)}
                  />
                </div>
              </td>
            ))}
            <td>
              <div className="cell-content">{computeTotal(subRow)}</div>
            </td>
            <td>
              <div className="cell-content">
                <button onClick={() => deleteRow(rowIndex, subRowIndex)}>-</button>
              </div>
            </td>
          </tr>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>ARR Target by Product and Geography in FY'23</h1>
      <div className="excel-table">
        <button onClick={() => addRow(false)}>Add Geography</button>
        <button onClick={addProduct}>Add Product</button>
        <button onClick={handleUpdate}>Update</button>
        <table className="excel-table">
          <thead>
            <tr>
              <th>Product/Geography</th>
              {updatedProductNames.map((product, index) => (
                <th key={product}>
                  <div className="cell-content">
                    <input type="text" value={product} onChange={(e) => handleProductNameChange(e, index)} />
                    <button onClick={() => deleteProduct(product)}>X</button>
                  </div>
                </th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {renderRows()}
            <tr>
              <td>Totals</td>
              {updatedProductNames.map(product => (
                <td key={product}>
                  <div className="cell-content">{columnTotals[product]}</div>
                </td>
              ))}
              <td>
                <div className="cell-content">{overallTotal}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandableTable;
