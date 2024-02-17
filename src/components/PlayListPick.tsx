// import React from 'preact/compat';
import { useEffect } from 'react';
import type { PlaylistItem } from '../lib/types';
import { useStore } from '@nanostores/react';
import {$playListPicked} from '../store/playlist';
import { clientRedirect } from '../lib/utils';

interface Props {
	playlist: PlaylistItem
}

export const PickPlaylist = ({ playlist }: Props) => {
    const $store = useStore($playListPicked);

    const handleSelect = () => {
        $playListPicked.set(playlist.id);
        clientRedirect('newMusic', {p: playlist.id});
    }

    // useEffect(() => {
        console.log('playlist picked', $store);
    // }
    // , [$store]);
    
  return (
    <button onClick={handleSelect} className="p-2 bg-accent-light w-full bg-opacity-30 h-full">
        <p className="leading-none" >
            Select {playlist.name}
        </p>
    </button>
  );
};