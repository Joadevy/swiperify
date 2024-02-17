import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { SPOTIFY_GENRES } from "../lib/spotify"

export const SelectGenre = (
  { setGenre } : {
    setGenre: Dispatch<SetStateAction<string>>;
  }
) => {

  return (
    <div className="bg-zinc-900 border w-fit p-3 rounded-md border-zinc-600 text-base text-center">
      <h2 className="text-md italic">Select the genre you wish</h2>
      <hr className="border-t border-zinc-700 mt-1 mb-3" />
      <select onChange={(e) => setGenre(e.target.value)} defaultValue={'all'}  className="capitalize text-whitesmoke text-md bg-zinc-800 py-1 rounded-md px-2">
        {['all',...SPOTIFY_GENRES].map(genre => (
          <option className="capitalize" key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  )
}