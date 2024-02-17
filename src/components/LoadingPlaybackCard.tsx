import { Dislike, Like, Play } from "./WebPlayback";

const LoadingPlaybackCard = () => {
  return (
              <div className='w-[200px] h-[325px] relative animate-pulse flex flex-col gap-1 items-center justify-center rounded-md overflow-hidden bg-zinc-900 border border-zinc-800'>
                  <div className='flex flex-col absolute top-0' >
                    <div className='w-[200px] h-[200px] bg-zinc-800'>
                    </div>
  
                    <div className='flex flex-col text-xs p-1 mt-1'>
                          <div className='italic rounded-md h-4 w-24 bg-zinc-800 mb-1'>
                          </div>
  
                          <div className='italic rounded-md h-2 w-16 bg-zinc-800'>
                          </div>
                    </div>
                  </div>
                  
                  <div className='opacity-10 flex gap-6 lg:gap-3 items-center justify-center p-3 absolute bottom-0 '>
                    <button>
                          <Dislike className='hover:scale-105 transition-transform'/>
                    </button>
  
                    <button className="border p-2 rounded-full">
                        <Play/>
                    </button>
  
                    <button>
                          <Like/>
                    </button>
                  </div>
              </div>
)}

export default LoadingPlaybackCard