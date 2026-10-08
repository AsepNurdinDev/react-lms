import EmptyState from "../common/EmptyState";

function DataTable({ columns, data, emptyMessage = "Belum ada data." }) {
  if (data.length === 0) {
    return <EmptyState title="Data kosong" message={emptyMessage} />;
  }

  return (
    // overflow-x-auto: tabel bisa digeser ke samping di layar kecil
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="whitespace-nowrap px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key} className="whitespace-nowrap px-4 py-3">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
