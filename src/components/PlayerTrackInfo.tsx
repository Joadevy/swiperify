import React from 'react'

const PlayerTrackInfo = ({
  trackName,
  imageUrl,
  artistsChain
} : {
  trackName: string,
  imageUrl: string,
  artistsChain: string
}) => {
  return (
    <div className='flex gap-2 items-center justify-center absolute left-3 '>
          <div className='w-12 h-12 rounded-md shadow-xl overflow-hidden'>
                <img className='w-full' src={imageUrl} alt="" />
          </div>

          <div className='text-base'>
            <h4>
              {trackName.length > 50 ? trackName.slice(0, 50) + '...' : trackName}
            </h4>
            <p className='text-zinc-300 text-sm' title={artistsChain}>
              {artistsChain && artistsChain.length > 60 ? artistsChain.slice(0, 50) + '...' : artistsChain}
            </p>
          </div>
    </div>
  )
}

export default PlayerTrackInfo