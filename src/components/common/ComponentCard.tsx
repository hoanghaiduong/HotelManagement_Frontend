interface ComponentCardProps {
  title: string;
  titleStyle?: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for
  left?: React.JSX.Element;
  desc?: string; // Description text
  right?: React.JSX.Element;
  isImage?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  titleStyle,
  children,
  className = "",
  desc = "",
  right,
  left,
  isImage,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200
  bg-white dark:border-gray-800 dark:bg-white/[0.03]
  ${className}`}
    >
      {/* Card Header */}
      <div
        className="px-6 py-5 flex items-center
justify-between"
      >
        <div className={`${left ? "flex items-center" : ""}`}>
          {left && left}
          <div className={`${left ? "ml-3" : ""}`}>
            <h3
              className={`text-base font-medium
text-gray-800 dark:text-white/90 ${titleStyle}`}
            >
              {title}
            </h3>
            {desc && (
              <p
                className="mt-1 text-sm text-gray-500
dark:text-gray-400"
              >
                {desc}
              </p>
            )}
          </div>
        </div>
        {/* Right component for additional buttons */}
        {right && <div>{right}</div>}
      </div>

      {/* Card Body */}
      <div
        className={
          !isImage
            ? `p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6`
            : "border-t border-gray-100 dark:border-gray-800"
        }
      >
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
