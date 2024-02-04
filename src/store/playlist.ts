import { atom } from 'nanostores';

type playlistPick = string | null
export const $playListPicked = atom<playlistPick>(null);