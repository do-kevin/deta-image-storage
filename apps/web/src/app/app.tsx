// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import CryptoJS from 'crypto-js';

export function App() {
  const [file, setFile] = useState<File | null>(null);

  const { handleSubmit, register } = useForm();

  const onSubmit = async (data: unknown) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('filefield', file, file.name);
        formData.append('name', file.name);
        formData.append('type', file.type);

        const projectKeyCipher = CryptoJS.AES.encrypt(
          import.meta.env.VITE_DETA_SPACE_PROJECT_KEY,
          import.meta.env.VITE_SECRET_KEY
        ).toString();

        formData.append('project_key', projectKeyCipher);

        formData.append(
          'drive_name',
          import.meta.env.VITE_DETA_SPACE_DRIVE_NAME
        );

        const result = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        console.log('[web] result: ', result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.files && event.target.files.length) {
      setFile(event.target.files[0]);
      console.log('[ file ]: ', file);
    }

    return file;
  };

  return (
    <>
      <h1>Deta Image Storage</h1>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <input
          {...(register('uploaded_file'), { required: true })}
          type="file"
          onChange={handleFile}
        />
        <input type="submit" />
      </form>
    </>
  );
}

export default App;
