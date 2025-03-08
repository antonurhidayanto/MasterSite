import { Button, Select } from "globalUtils/components";

interface PaginationProps {
  pageNumber: number;
  rowPerPage: number;
  rowCount: number;
  onPageChange: (page: number) => void;
  onRowPerPageChange: (rowPerPage: number) => void;
}
const Pagination = ({ pageNumber, rowPerPage, rowCount, onPageChange, onRowPerPageChange  } : PaginationProps) => {
  const totalPages = Math.ceil(rowCount / rowPerPage);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Page {pageNumber} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
        >
          Next
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span>Show:</span>
        <Select
          value={rowPerPage.toString()}
          onValueChange={(value) => onRowPerPageChange(Number(value))}
        >
          <Select.Item value="10">10</Select.Item>
          <Select.Item value="20">20</Select.Item>
          <Select.Item value="50">50</Select.Item>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;