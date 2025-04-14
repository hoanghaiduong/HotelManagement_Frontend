import Button from "../ui/button/Button";
const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  return (
    <div
      className="flex flex-col sm:flex-row justify-between items-center mt-6
dark:text-white space-y-3 sm:space-y-0"
    >
      <span className="text-sm">
        Page {currentPage} of {totalPages} (Total: {totalCount})
      </span>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="outline"
        >
          Prev
        </Button>
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              onClick={() => onPageChange(page)}
              variant={page === currentPage ? "primary" : "outline"}
              className={
                page === currentPage ? "font-bold border border-blue-600" : ""
              }
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2 text-gray-500">
              {page}
            </span>
          )
        )}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
