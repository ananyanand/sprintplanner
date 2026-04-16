import { useState } from "react";

type Column = {
  header: string;
  accessor: string;
};

type TableProps = {
  columns: Column[];
  data: any[];
  pageSize?: number;
};

export default function Table({
  columns,
  data,
  pageSize = 5,
}: TableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="w-full">

      {/* Table */}
      <div className="border border-primary/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">

          {/* Header */}
          <thead className="bg-primary/5 text-primary">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="text-left px-4 py-3 font-medium"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedData.map((row, i) => (
              <tr
                key={i}
                className="border-t border-primary/10 hover:bg-primary/5 transition"
              >
                {columns.map((col) => (
                  <td
                    key={col.accessor}
                    className="px-4 py-3 text-text"
                  >
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">

        {/* Info */}
        <span className="text-secondary">
          Page {page} of {totalPages}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-2">

          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 rounded-md border border-primary/20 text-primary hover:bg-primary/5"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={i}
                onClick={() => setPage(pageNumber)}
                className={`
                  px-3 py-1 rounded-md
                  ${
                    page === pageNumber
                      ? "bg-accent text-white"
                      : "border border-primary/20 text-primary hover:bg-primary/5"
                  }
                `}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages))
            }
            className="px-3 py-1 rounded-md border border-primary/20 text-primary hover:bg-primary/5"
          >
            Next
          </button>

        </div>
      </div>
    </div>
  );
}