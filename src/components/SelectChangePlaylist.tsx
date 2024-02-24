import { useEffect, useState } from "react"
import type { PlaylistItem } from "../lib/types"
import { useStore } from "@nanostores/react"
import { $playlistPicked, changePlaylistStored } from "../store/playlist"

export const SelectPlaylist = (
  { playlists, playlistIdFromURLParam } : {
    playlists: PlaylistItem[],
    playlistIdFromURLParam: PlaylistItem['id']
  }
) => {
  const playlistPicked = useStore($playlistPicked);

  useEffect(() => {
    if (!playlistPicked && playlistIdFromURLParam){
      changePlaylistStored(playlistIdFromURLParam)
    }
  },[])
  
  const handleChangePlaylist = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changePlaylistStored(e.target.value)
    const history = window.history
    const url = new URL(window.location.href)
    url.searchParams.set('p', e.target.value)
    history.pushState({}, '', url.toString())
  }

  return (
    <div className="bg-zinc-900 lg:border relative h-[85px] lg:h-fit w-[215px] p-3 rounded-md lg:border-zinc-600 lg:text-center">
        <h2 className="text-base italic">Change picked playlist</h2>
      <hr className=" hidden lg:block lg:border-t lg:border-zinc-700 lg:mt-1 lg:mb-3" />
      <select onChange={handleChangePlaylist} defaultValue={playlistPicked} className="text-whitesmoke text-base bg-zinc-800 py-1 rounded-md px-2">
        {playlists.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}