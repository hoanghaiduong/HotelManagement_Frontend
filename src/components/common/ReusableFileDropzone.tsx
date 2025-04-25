import { useEffect, useState } from "react";
import ComponentCard from "./ComponentCard";
import Constants from "../../common/configs/Constants";
import { useDropzone } from "react-dropzone";

interface ReusableFileDropzoneProps {
  title?: string; // Tiêu đề của component
  accept?: { [key: string]: string[] }; // Loại file được chấp nhận
  multiple?: boolean; // Hỗ trợ nhiều file hay không
  existingUrl?: string; // URL của file có sẵn (nếu có)
  onFilesChange: (files: File[], previews: string[]) => void; // Callback trả về danh sách file và preview
  previewClassName?: string; // Class tùy chỉnh cho hình ảnh preview
  containerClassName?: string; // Class tùy chỉnh cho container
}

const ReusableFileDropzone: React.FC<ReusableFileDropzoneProps> = ({
  title = "Tải lên hình ảnh",
  accept = { "image/*": [] },
  multiple = false,
  existingUrl,
  onFilesChange,
  previewClassName = "w-full h-48 object-cover rounded",
  containerClassName = "border-dashed border-2 p-6 rounded-lg cursor-pointer",
}) => {
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);

  // Khởi tạo preview từ existingUrl (nếu có)
  useEffect(() => {
    if (existingUrl) {
      setFiles([
        {
          file: new File([], "existing-file"),
          preview: `${Constants.BASE_URL_BACKEND}/${existingUrl}`,
        },
      ]);
    }
  }, [existingUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    onDrop: (acceptedFiles) => {
      const newFiles: { file: File; preview: string }[] = [];
      let readCount = 0;

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newFiles.push({ file, preview: reader.result as string });
          readCount++;

          if (readCount === acceptedFiles.length) {
            const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
            setFiles(updatedFiles);

            onFilesChange(
              updatedFiles.map((f) => f.file),
              updatedFiles.map((f) => f.preview)
            );
          }
        };
        reader.readAsDataURL(file);
      });
    },
  });

  return (
    <ComponentCard title={title}>
      <div
        {...getRootProps()}
        className={`${containerClassName} ${
          isDragActive ? "border-brand-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <div className={multiple ? "grid grid-cols-2 gap-4" : ""}>
            {files.map((item, index) => (
              <img
                key={index}
                src={item.preview}
                className={previewClassName}
                alt={`Preview ${index}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Kéo & thả hoặc bấm để chọn file
          </p>
        )}
      </div>
    </ComponentCard>
  );
};

export default ReusableFileDropzone;
