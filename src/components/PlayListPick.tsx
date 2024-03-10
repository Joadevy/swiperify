// import React from 'preact/compat';
import type { PlaylistItem } from '../lib/types';
import { useStore } from '@nanostores/react';
import {$playlistPicked, changePlaylistStored} from '../store/playlist';
import { clientRedirect } from '../lib/utils';

interface Props {
	playlist: PlaylistItem
}

export const PickPlaylist = ({ playlist }: Props) => {
    const $store = useStore($playlistPicked);

    const handleSelect = () => {
        changePlaylistStored(playlist.id);
        clientRedirect('newMusic', {p: playlist.id});
    }    
  return (
    <button onClick={handleSelect} className="p-2 bg-accent-light w-full bg-opacity-30 h-full">
        <p className="leading-none" >
            Select {playlist.name}
        </p>
    </button>
  );
};