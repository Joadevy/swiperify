// import React from 'preact/compat';
import { useStore } from '@nanostores/preact';
import {$playListPicked} from '../store/playlist';
import { clientRedirect } from '../lib/utils';

interface Props {}

export const CreateNewPlaylist = () => {
    const $store = useStore($playListPicked);

    const handleCreate = async () => {
        // const newPlaylist = await createPlaylist(playListData); // se le pasa nombre, desc y boolean public
        // $playListPicked.set(newPlaylist.id);
        clientRedirect('newMusic')
    }

    // useEffect(() => {
        console.log('playlist created', $store);
    // }
    // , [$store]);
    
  return (
    <button onClick={handleCreate} class="p-2 bg-accent-light w-full bg-opacity-30">
        <p>
            Create new playlist
        </p>
    </button>
  );
};