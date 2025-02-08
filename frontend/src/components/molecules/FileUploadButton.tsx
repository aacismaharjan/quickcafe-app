import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

interface FileUploadButtonWithInfoProps {
  label: string;
  onFileChange: (file: File) => void;
  accept?: string;
}

const FileUploadButtonWithInfo: React.FC<FileUploadButtonWithInfoProps> = ({
  label,
  onFileChange,
  accept = 'image/*',
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      setFile(selectedFile);
      onFileChange(selectedFile); // Call the onFileChange prop function
    }
  };

  return (
    <div>
      <Button
        component="label"
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        {label}
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          style={{ display: 'none' }} // Hide the default file input
        />
      </Button>

      {file && (
        <Typography component="span" sx={{ paddingLeft: 1 }}>
          {file.name} - {file.size} bytes
        </Typography>
      )}
    </div>
  );
};

export default FileUploadButtonWithInfo;
