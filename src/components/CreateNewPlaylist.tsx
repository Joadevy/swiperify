import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toast } from './Toast';
import type { SpotifyCreatePlaylistResponse } from '../lib/types';
import { useStore } from '@nanostores/react';
import { $playListPicked } from '../store/playlist';
import { clientRedirect } from '../lib/utils';

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
  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [playlistCreated, setPlaylistCreated] = useState<string | null>(null);
  const $store = useStore($playListPicked);

  const {register, handleSubmit, formState:{errors}} = useForm({
    defaultValues:{
      Name: '',
      Description: '',
      isPublic: false,
      isCollaborative: false
    }
  });


  const handleOpen = () => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    setIsOpen(false);
    dialogRef.current?.close();
  };


  // To avoid submitting the form when pressing the enter key in the input fields
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
  }, []); 

  const handleCreatePlaylist = async (data: PlaylistCreation) => {
    const response:{
      ok: boolean,
      status: number,
      json: () => Promise<SpotifyCreatePlaylistResponse>
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


    if(response.ok && response.status === 201){
      response.json().then((playlist) => {
        $playListPicked.set(playlist.id);
        clientRedirect('newMusic', {p: playlist.id});
      })
      setPlaylistCreated('Playlist created successfully');
      handleClose();
    } else {
      setPlaylistError('Error creating playlist, please try again later');
    }
  }

  useEffect(() => {
    if (playlistError){
      setTimeout(() => {
        setPlaylistError(null)
      }, 7500)
    } 

    if (playlistCreated){
      setTimeout(() => {
        setPlaylistCreated(null)
      }, 7500)
    }

  },[playlistCreated, playlistError])

  return (
    <>
      <button onClick={handleOpen} className='p-2 bg-accent-light w-full bg-opacity-30'>Create playlist</button>
      <div className={ isOpen ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50' : '' }>
        <dialog className=" bg-zinc-800 p-4 text-slate-200 rounded-md w-80 sm:w-[500px]" ref={dialogRef}>
          <div className="bg-gradient-to-r from-accent-light to-green-700 bg-clip-text text-transparent leading-none font-extrabold text-4xl p-2">
           <h2 className='text-center font-bold text-2xl lg:text-3xl '>Create new playlist</h2>

          </div>
          <form className='flex flex-col gap-4 my-2' onSubmit={handleSubmit((data) => {
            handleCreatePlaylist(data);
          })}>
              <label className='flex flex-col gap-1' htmlFor="Name">
                <p>
                  Name 
                  <span className={errors.Name ? 'ml-1 text-tinder-red' : 'ml-1 text-accent-light'}> 
                    *
                  </span>
                </p>
                <input onKeyDown={preventInputDefault} className={'text-zinc-800 rounded-sm px-2 py-1 placeholder:text-sm outline-none focus:outline-accent-light ' + (errors.Name ? 'focus:outline-tinder-red' : '')} {...register("Name",{required:"Name is required"})} id="Name" type="text" placeholder="Type playlist name..." />
              </label>
              {errors.Name && <span className='text-tinder-red text-sm'>{errors.Name.message}</span>}

              <label className='flex flex-col gap-1' htmlFor="Description"> Description
                  <input onKeyDown={preventInputDefault} className='text-zinc-800 rounded-sm px-2 py-1 placeholder:text-sm outline-none focus:outline-accent-light' {...register("Description")} id="Description" type="text" placeholder="Type playlist description..." />
              </label>

              <div className='flex gap-6'>
                <label htmlFor="isPublic" className='flex items-center gap-2'>Public
                    <input onKeyDown={preventInputDefault} {...register("isPublic")} className='ml-2' type="checkbox" id="isPublic" />
                </label>

                <label className='flex items-center gap-2' htmlFor="isCollaborative">Collaborative
                    <input onKeyDown={preventInputDefault} className='ml-2' {...register("isCollaborative")} type="checkbox" id="isCollaborative" />
                </label>
              </div>


            <footer className='flex justify-between mt-4'>
                <input type="submit" value="Create & Use" className='p-2 bg-accent-light text-zinc-800 rounded-sm hover:scale-105 hover:cursor-pointer transition-all hover:opacity-85' />
                <button type="button" className=' bg-zinc-700 p-2 rounded-sm hover:opacity-75 transition-opacity' onClick={handleClose}>Close</button>
            </footer>
          </form>

        </dialog>
      </div>

      {playlistError && <Toast type="error" message={playlistError}/>}
      {playlistCreated && <Toast type="success" message={playlistCreated}  />}
    </>
  );
};