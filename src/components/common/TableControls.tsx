import { useState } from "react";
import { ChevronDownIcon } from "../../icons";

export default function TableControls({
  onSearchChange,
  onEntriesChange,
  containerStyle,
}: {
  onSearchChange?: (value: string) => void;
  onEntriesChange?: (value: number) => void;
  containerStyle?: string;
}) {
  const [entries, setEntries] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setEntries(value);
    onEntriesChange?.(value); // gọi callback nếu có
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange?.(value); // gọi callback nếu có
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${containerStyle?? "px-4 pt-4"}`}>
      {/* Select entries */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
        <div className="relative">
          <select
            value={entries}
            onChange={handleEntriesChange}
            className="appearance-none border border-gray-300 cursor-pointer dark:border-white/10 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white pr-6 focus:outline-none focus:ring-0 focus:border-gray-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          entries
        </span>
      </div>

      {/* Search box */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative">
          <button className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
            <svg
              className="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill=""
              />
            </svg>
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search or type command..."
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
          />
          <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
            <span>⌘</span>
            <span>K</span>
          </button>
        </div>
      </div>
    </div>
  );
}
