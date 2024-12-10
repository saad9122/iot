import React from 'react';
import { Table } from '@tanstack/react-table';

interface ColumnVisibilityProps<TData> {
  table: Table<TData>;
}

const ColumnVisibilityToggle = <TData,>({ table }: ColumnVisibilityProps<TData>) => {
  const allColumns = table.getAllColumns();

  // Handler for toggling all columns
  const toggleAllVisibility = (isVisible: boolean) => {
    allColumns.forEach((column) => {
      if (column.getCanHide()) {
        column.toggleVisibility(isVisible);
      }
    });
  };

  return (
    <div>
      <div className="toggle-all-controls">
        <button onClick={() => toggleAllVisibility(true)}>Show All</button>
        <button onClick={() => toggleAllVisibility(false)}>Hide All</button>
      </div>

      <div className="column-toggle-list">
        {allColumns.map((column) => (
          <label key={column.id} className="column-toggle-label">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              disabled={!column.getCanHide()}
              onChange={column.getToggleVisibilityHandler()}
              aria-label={`Toggle visibility for ${String(column.columnDef.header)}`}
            />
            {column.columnDef.header}
            <span className="tooltip">{column.getIsVisible() ? 'Visible' : 'Hidden'}</span>
          </label>
        ))}
      </div>

      <style jsx>{`
        .toggle-all-controls {
          margin-bottom: 10px;
        }

        .column-toggle-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .column-toggle-label {
          display: flex;
          align-items: center;
          position: relative;
        }

        .column-toggle-label input {
          margin-right: 8px;
        }

        .column-toggle-label .tooltip {
          margin-left: 8px;
          color: #666;
          font-size: 0.9rem;
          visibility: hidden;
          position: absolute;
          left: 100%;
          margin-left: 5px;
          background-color: #f0f0f0;
          padding: 3px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }

        .column-toggle-label:hover .tooltip {
          visibility: visible;
        }

        .toggle-all-controls button {
          margin-right: 8px;
          padding: 5px 10px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 4px;
        }

        .toggle-all-controls button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ColumnVisibilityToggle;
