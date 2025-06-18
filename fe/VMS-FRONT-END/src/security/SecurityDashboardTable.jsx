import React from "react";

function SecurityDashboardTable({ title, columns, data }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{title}</div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table" style={{ minWidth: 600 }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: "center", color: "#888" }}>No data</td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SecurityDashboardTable;
