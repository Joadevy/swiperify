import React, { useEffect, useState } from 'react'

type props = {
  action: (value:number) => void
  durationInSeconds: number,
  isPlaying: boolean,
  trackId: string
}


const getMinutesWithFormatFromSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = Math.round(seconds % 60)
  return `${minutes}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
}

  
export const SongController = ( {  action,
  durationInSeconds,
  isPlaying,
  trackId
} : props
) => {
  const [secondsFromStart, setSecondsFromStart] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setSecondsFromStart(secondsFromStart + 1);
      } 
    }, 1000);

    return () => clearInterval(interval);
  }
  , [secondsFromStart, isPlaying]);

  useEffect(() => {
    setSecondsFromStart(0)
  }
  , [trackId]); // reset the seconds from start when the song changes

  return (
    <div className='flex gap-1 items-center justify-center text-sm'>
      <p>{getMinutesWithFormatFromSeconds(secondsFromStart)}</p>
      <input type="range" min={0} max={durationInSeconds} value={secondsFromStart} className=" range-thumb accent-zinc-600 w-[200px] h-1 rounded-sm" onChange={
                  e => {
                    action(Number(e.target.value) * 1000) // because it needs the value in ms
                    setSecondsFromStart(+e.target.value)
                  }
      }/>
      <p>{getMinutesWithFormatFromSeconds(durationInSeconds)}</p>
    </div>
  )
}

