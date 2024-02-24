import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { SPOTIFY_GENRES } from "../lib/spotify"

export const SelectGenre = (
  { setGenre } : {
    setGenre: Dispatch<SetStateAction<string>>;
  }
) => {

  return (
    <div 
    // className="bg-zinc-900 border w-fit lg:w-[215px] p-3 rounded-md border-zinc-600 text-base text-center"
    className="bg-zinc-900 relative lg:border h-[85px]  lg:h-fit w-[215px] p-3 rounded-md lg:border-zinc-600 lg:text-center"
    >
      <h2 className="text-base italic">Select a genre</h2>
      <hr className="hidden lg:block lg:border-t lg:border-zinc-700 lg:mt-1 lg:mb-3" />
      <select onChange={(e) => setGenre(e.target.value)} defaultValue={'all'}  className=" lg:relative capitalize text-whitesmoke text-base bg-zinc-800 py-1 rounded-md px-2">
        {['all',...SPOTIFY_GENRES].map(genre => (
          <option className="capitalize" key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  )
}