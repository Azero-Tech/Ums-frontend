import React from "react";

const Table = ({ headers, data, customStyles = {}, actions,student,mapping}) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full table-auto divide-y divide-gray-600 ${customStyles.table}`}
      >
        <thead>
          <tr> 
            {/* <th
                className={`px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${customStyles.header}`}
              >
                S.No
              </th> */}
            {headers.map((header, index) => ( 
              <th
                key={index}
                className={`px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${customStyles.header}`}
              >
                {header}
              </th>
            ))}
            {actions && (
              <th
                className={`px-4 py-3 text-left text-xs sm:text-sm font-medium`}
              >
                Actions
              </th>
            )}
             {student && (
              <th
                className={`px-4 py-3 text-left text-xs sm:text-sm font-medium`}
              >
                 Student
              </th>
            )}
             {mapping && (
              <th
                className={`px-4 py-3 text-left text-xs sm:text-sm font-medium`}
              >
                 Mapping
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                {/* <td 
                    className={`px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm ${customStyles.cell}`}
                  >
                    {rowIndex+1}
                  </td> */}
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm ${customStyles.cell}`}
                  >
                    {cell}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-2 text-gray-700 border-b">
                    {actions(row)}
                  </td>
                )}
                 {student && (
                  <td className="px-4 py-2 text-gray-700 border-b">
                    {student(row)}
                  </td>
                )}
                   {mapping && (
                  <td className="px-4 py-2 text-gray-700 border-b">
                    {mapping(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length + (actions ? 1 : 0)}
                className="text-center py-4 text-gray-500 text-xs sm:text-sm"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
