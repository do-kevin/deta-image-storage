// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { DetaDrive } from '../../../../libs/shared/services/deta-drive';

export function App() {
  const [newFile, setNewFile] = useState(null);

  const deta = new DetaDrive(
    import.meta.env.VITE_DETA_SPACE_PROJECT_KEY,
    import.meta.env.VITE_DETA_SPACE_DRIVE_NAME
  );

  deta.createDrive(import.meta.env.VITE_DETA_SPACE_DRIVE_NAME);

  const { handleSubmit, register } = useForm();

  const onSubmit = async (data: any) => {
    if (newFile) {
      await deta.uploadImage(newFile, {
        name: newFile.name,
        type: newFile.type,
      });
    }
  };

  const handleFile = async (event: any) => {
    event.preventDefault();

    setNewFile(event.target.files[0]);
    console.log(newFile);
    return newFile;
  };

  return (
    <>
      <h1>Deta Image Storage</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...(register('file'), { required: true })}
          type="file"
          onChange={handleFile}
        />
        <input type="submit" />
      </form>
    </>
  );
}

export default App;
