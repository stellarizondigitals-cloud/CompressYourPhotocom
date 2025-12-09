import { UploadDropzone } from '../UploadDropzone';

export default function UploadDropzoneExample() {
  const handleFilesSelected = (files: File[]) => {
    console.log('Files selected:', files.map(f => f.name));
  };

  return <UploadDropzone onFilesSelected={handleFilesSelected} />;
}
