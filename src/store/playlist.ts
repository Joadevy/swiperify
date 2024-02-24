import { persistentAtom } from '@nanostores/persistent'
import type { PlaylistItem } from '../lib/types';

type TplaylistPick = PlaylistItem['id']
export const $playlistPicked = persistentAtom<TplaylistPick>('playlistPicked', '',{
  encode:JSON.stringify,
  decode:JSON.parse
});

export const changePlaylistStored = (playlist: TplaylistPick) => {
  $playlistPicked.set(playlist);
}

export const getStoredPlaylist = () => {
  return $playlistPicked.get();
}