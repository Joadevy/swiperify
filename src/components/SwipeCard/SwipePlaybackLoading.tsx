import { Dislike, Like, Play } from "../WebPlayback"

export const SwipePlaybackLoading = () => {
  return (
                <div className='drop-shadow-2xl relative p-3 w-[325px] h-[415px] flex flex-col gap-1 items-center justify-center rounded-sm overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse'>
                  <article className='flex flex-col w-full absolute top-0 border border-zinc-600 rounded-md overflow-hidden shadow-xl ' >
                      <div className='w-full h-[325px] relative bg-zinc-700'/>
                      
                      <div className='flex flex-col text-base p-3 mt-1 absolute bottom-0 rounded-tr-md  bg-opacity-gradient justify-end w-full h-full'>
                        <div className='italic rounded-md h-6 w-36 bg-zinc-800 mb-2'/>
                        <div className='italic rounded-md h-4 w-24 bg-zinc-800'/>
                      </div>
                  </article> 
                  
                  <div className='flex gap-6 lg:gap-3 items-center justify-center p-4 absolute bottom-0'>
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
