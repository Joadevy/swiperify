import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  UserId: string
  spotifyToken: string
}

type PlaylistCreation = {
  Name: string;
  Description: string;
  isPublic: boolean;
  isCollaborative: boolean;
};

const preventInputDefault = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
      event.preventDefault();
  }
}

export const CreateNewPlaylist = ({UserId, spotifyToken}:Props) => {
    const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement|null>(null);
  const {register, handleSubmit, formState:{errors}} = useForm({
    defaultValues:{
      Name: '',
      Description: '',
      isPublic: false,
      isCollaborative: false
    }
  });

  // console.log(errors)

  const handleOpen = () => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    setIsOpen(false);
    dialogRef.current?.close();
  };

  const handleCreate = () => {
    // handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Dependencias vacías, por lo que este efecto se ejecuta solo una vez

  console.log({UserId})

  const handleCreatePlaylist = async (data: PlaylistCreation) => {
    console.log(data);
    const response:{
      ok: boolean,
      status: number,
    } = await fetch(`https://api.spotify.com/v1/users/${UserId}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`,
      },
      body: JSON.stringify({
        name: data.Name,
        description: data.Description,
        public: data.isPublic,
        collaborative: data.isCollaborative
      })
    })

    console.log(response)

    if(response.ok && response.status === 201){
      handleClose();
    } else {
      console.log('Error creating playlist')
    }
  }

  return (
    <>
    <button onClick={handleOpen} className='p-2 bg-accent-light w-full bg-opacity-30'>Create playlist</button>
    <div className={ isOpen ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50' : '' }>
      <dialog className=" bg-zinc-800 p-4 text-slate-200 rounded-md w-80 sm:w-96" ref={dialogRef}>
        <h2 className='text-center font-bold text-2xl'>Create new playlist</h2>
        <form className='flex flex-col gap-4 my-2' onSubmit={handleSubmit((data) => {
          console.log(data);
          handleCreatePlaylist(data);
        })}>
            <label className='flex flex-col gap-1' htmlFor="Name">Playlist name
                <input onKeyDown={preventInputDefault} className={'text-zinc-800 rounded-sm px-2 placeholder:text-sm outline-none focus:outline-accent-light ' + (errors.Name ? 'focus:outline-tinder-red' : '')} {...register("Name",{required:"Name is required"})} id="Name" type="text" placeholder="Type playlist name..." />
            </label>
            {errors.Name && <span className='text-red-500 text-sm'>{errors.Name.message}</span>}

            <label className='flex flex-col gap-1' htmlFor="Description"> Playlist description
                <input onKeyDown={preventInputDefault} className='text-zinc-800 rounded-sm px-2 placeholder:text-sm outline-none focus:outline-accent-light' {...register("Description")} id="Description" type="text" placeholder="Type playlist description..." />
            </label>

            <label htmlFor="isPublic">Public
                <input onKeyDown={preventInputDefault} {...register("isPublic")} className='ml-2' type="checkbox" id="isPublic" />
            </label>
            <label htmlFor="isCollaborative">Collaborative
                <input onKeyDown={preventInputDefault} className='ml-2' {...register("isCollaborative")} type="checkbox" id="isCollaborative" />
            </label>

          <footer className='flex justify-between mt-4'>
              <input type="submit" value="Create & Use" className='p-2 bg-accent-light text-zinc-800 rounded-md hover:scale-105 hover:cursor-pointer transition-all hover:animate-bounce hover:opacity-85' />
              <button type="button" onClick={handleClose}>Close</button>
          </footer>
        </form>

      </dialog>
    </div>
    </>
  );
//     const $store = useStore($playListPicked);
//     const [openModal, setOpenModal] = useState(false);

//     const handleCreate = async () => {
//         console.log('creando playlist!')
//         setOpenModal(true);
//         // const newPlaylist = await createPlaylist(playListData); // se le pasa nombre, desc y boolean public
//         // $playListPicked.set(newPlaylist.id);
//         // clientRedirect('newMusic')
//     }

//     const handleClose = () => {
//         setOpenModal(false);
//     }

//     // useEffect(() => {
//         console.log('playlist created', $store);
//     // }
//     // , [$store]);
    
//   return (
//     <>
//         <button onClick={handleCreate} className="p-2 bg-accent-light w-full bg-opacity-30">
//             <p>
//                 Create new playlist
//             </p>
//         </button>

//         {openModal && (
//             <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
//                 <dialog className="bg-white p-4 text-black">
//                     <h2>Create new playlist</h2>
//                     <input type="text" placeholder="Playlist name" />
//                     <input type="text" placeholder="Playlist description" />
//                     <button onClick={handleCreate}>Create</button>

//                     <button onClick={handleClose}>Close</button>
//                 </dialog>
//             </div>
//         )}
//     </>
//   );
};