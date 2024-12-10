import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TableSkeleton = ({ columnCount = 5, rowCount = 10 }) => (
  <div className="rounded-md border bg-white">
    {/* Skeleton for the input field */}
    <div className="flex items-center p-4">
      <Skeleton className="h-10 w-full max-w-sm rounded-md" />
    </div>

    {/* Skeleton for the table */}
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(columnCount)].map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-6 w-32 rounded-md" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rowCount)].map((_, rowIndex) => (
          <TableRow key={rowIndex} className="py-8">
            {[...Array(columnCount)].map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-32 rounded-md" />
              </TableCell>
            ))}
          </TableRow>
        ))}
        {/* Skeleton for no results */}
        {rowCount === 0 && (
          <TableRow className="py-24">
            <TableCell colSpan={columnCount} className="h-28 text-center">
              <Skeleton className="h-6 w-full rounded-md" />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

    {/* Skeleton for pagination */}
    <div className="flex justify-end mt-2">
      <Skeleton className="h-8 w-32 rounded-md" />
    </div>
  </div>
);

export default TableSkeleton;
