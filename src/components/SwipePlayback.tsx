import { useState, useEffect } from 'react';
import { Toast } from './Toast';
import LoadingPlaybackCard from './LoadingPlaybackCard';
import { getRandomTrackUri, queueNewSong } from '../lib/spotify';
import { usePlaylist } from '../hooks/usePlaylist';
import { SelectGenre } from './SelectGenre';
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export const Pause = ({ className }:{className?:string}) => (
  <svg className={className} role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path fill='currentColor' d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
)

export const Play = ({ className } : {className?:string} ) => (
  <svg className={className} role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path fill='currentColor' d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
)

export const Like = ({ className } : {className?:string} ) => (
  <svg className={className}  xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill='currentColor'  d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"/></svg>
)

export const Dislike = ({ className } : {className?:string} ) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill='currentColor' d="M20 3H6.693A2.01 2.01 0 0 0 4.82 4.298l-2.757 7.351A1 1 0 0 0 2 12v2c0 1.103.897 2 2 2h5.612L8.49 19.367a2.004 2.004 0 0 0 .274 1.802c.376.52.982.831 1.624.831H12c.297 0 .578-.132.769-.36l4.7-5.64H20c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2m-8.469 17h-1.145l1.562-4.684A1 1 0 0 0 11 14H4v-1.819L6.693 5H16v9.638zM18 14V5h2l.001 9z"/></svg>
)

type props= {
  spotify_access_token: string
  playlist_id: string
}

type Track = {
  name: string;
  id:string;
  uri:string;
  album: {
    images: {
      url: string;
    }[];
  };
  artists: {
    name: string;
  }[];
};

type PlayerState = {
  track_window: {
    current_track: Track;
  };
  paused: boolean;
};

type Player = {
  addListener: (event: string, cb: (state: any) => void) => void;
  connect: () => void;
  getCurrentState: () => Promise<PlayerState>;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
};

const handleChangeSong = async (spotify_access_token:string, action:(() => void) | undefined, setPlayerError: (value: React.SetStateAction<string | null>) => void
, genre:string) => {
  let context_uri: string | undefined = undefined
  try {
    context_uri = await getRandomTrackUri(spotify_access_token, genre);
  } catch (error) {
    console.error(error);
    setPlayerError('We could not get a new song to play. Please try again or reload the page.');
  } finally {
    if (!context_uri) return setPlayerError('We could not get a new song to play. Please try again or reload the page.');
    try {
      await queueNewSong(spotify_access_token, context_uri!);
    } catch (error) {
      console.error(error);
      setPlayerError('We could not play the new song. Please try again or reload the page.');
    } finally {
    if (!action) return setPlayerError('We could not play the new song. Please try again or reload the page.');
    action()
    }
  }
}


export function SwipePlayback({spotify_access_token, playlist_id}: props) {
  const [player, setPlayer] = useState<Player|null>(null);
  const [is_paused, setPaused] = useState(false);
  // const [current_track, setTrack] = useState<Track | null>(null);
  const [current_track,setTrack] = useState<Track | null>({
    name: 'Soy yo',
    id: '1',
    uri: '1',
    album: {
      images: [{url: '../../testImageAlbum.jpg'}]
    },
    artists: [{name: 'Kany Garcia'}]
  });
  const [loadingSong, setLoadingSong] = useState(false);
  const [playerError, setPlayerError] = useState<string|null>(null);
  const [notify, setNotify] = useState<string|null>(null);
  const [handleAddToPlaylist] = usePlaylist(spotify_access_token!, playlist_id);
  const [genre, setGenre] = useState<string>('all');

  // useEffect(() => {
  //     const script = document.createElement("script");
  //     script.src = "https://sdk.scdn.co/spotify-player.js";
  //     script.async = true;

  //     document.body.appendChild(script);

  //     window.onSpotifyWebPlaybackSDKReady = () => {
  //         const player = new window.Spotify.Player({
  //             name: 'Web Playback SDK',
  //             getOAuthToken: (cb:(token: string) => void) => { cb(spotify_access_token); },
  //             volume: 0.5
  //         });

  //         setPlayer(player);

  //         player.addListener('ready', ({ device_id }:{device_id:string}) => {
  //             const transferPlayback = async (spotifyToken:string, deviceId: string) => {
  //             await fetch('https://api.spotify.com/v1/me/player',
  //             {
  //               method: 'PUT',
  //               headers: {
  //                 'Content-Type': 'application/json',
  //                 'Authorization': `Bearer ${spotifyToken}`
  //               },
  //               body: JSON.stringify({
  //                 device_ids:[deviceId],
  //                 // TODO: decidir si establecer o no el autoplay
  //                 // play:true 
  //               })
  //             })
  //           }

  //           transferPlayback(spotify_access_token!, device_id);
  //         });

  //         player.addListener('not_ready', ({ device_id }:{device_id:string}) => {
  //             console.log('Device ID has gone offline', device_id);
  //             setPlayerError('Device has gone offline');
  //         });

  //         player.addListener('player_state_changed', ((state:PlayerState) => {
  //             if (!state) {
  //                 return;
  //             }

  //             setTrack(state.track_window.current_track);
  //             setPaused(state.paused);
  //         }));

  //         player.connect();
  //     };
  // }, []);


  // useEffect(() => {
  //   if (playerError){
  //     setTimeout(() => {
  //       setPlayerError(null)
  //     }, 7500)
  //   } 

  //   if (notify){
  //     setTimeout(() => {
  //       setNotify(null)
  //     }, 7500)
  //   }

  // },[playerError, notify])

  return (
  <main className='flex flex-col items-center gap-5 lg:gap-0'>
    {/* <hr className="border-t border-zinc-700 mb-4" /> */}
    <div className="lg:self-start">
      <SelectGenre setGenre={setGenre}/>
    </div>
    <div className='grid place-content-center lg:-mt-20 relative'>
              {current_track && !loadingSong ? (
              <div className='drop-shadow-2xl relative p-3 w-[325px] h-[415px] flex flex-col gap-1 items-center justify-center rounded-sm overflow-hidden bg-zinc-900 border border-zinc-800'>
                
                  {/* El article va a ser lo que va a poder swipear como tinder, los controles debajo se mantienen */}
                    <article className='flex flex-col absolute top-3 border border-accent-light rounded-md overflow-hidden cursor-grab shadow-xl' >
                      <div className='w-full h-[325px] relative'>
                        <img  className='w-full h-full' 
                        src={current_track.album.images[0].url} 
                        alt="" />
                      </div>
    
                      <div className='flex flex-col text-base p-3 mt-1 absolute bottom-0 rounded-tr-md  bg-opacity-gradient justify-end w-full h-full'>
                            <div className='font-bold border-b border-accent-light w-fit mb-1 text-accent-light'
                              title={current_track.name}
                            >
                              {current_track.name.length >= 52 ? 
                                  current_track.name.slice(0,52) + '...'
                                  : current_track.name  
                              }
                            </div>
    
                            <div className='italic'>
                              {current_track.artists[0].name}
                            </div>
                      </div>
                    </article>
                  
                  <div className='flex gap-6 lg:gap-3 items-center justify-center p-4 absolute bottom-0'>
                    <button onClick={async () => { 
                        setLoadingSong(true);
                          await handleChangeSong(spotify_access_token,() => player?.nextTrack(), setPlayerError, genre)
                        setLoadingSong(false);
                      }} >
                          <Dislike className='hover:scale-105 transition-transform'/>
                    </button>
  
                    <button className="border p-2 rounded-full hover:border-accent-light transition-colors" onClick={() => { player?.togglePlay() }} >
                        { is_paused ? 
                          <Play/>
                        : <Pause/> }
                    </button>
  
                    <button onClick={async() => { 
                      setLoadingSong(true);
                        const addResponse = await handleAddToPlaylist([current_track.uri]);
                        if (!addResponse.ok) setPlayerError('We could not add the song to the playlist. Please try again or reload the page.');
                        else {
                          await handleChangeSong(spotify_access_token, () => player?.nextTrack(), setPlayerError, genre)
                          setNotify(`${current_track.name} succesfully added to the playlist!`)
                        }
                      setLoadingSong(false);
                     }} >
                          <Like className='hover:scale-105 transition-transform'/>
                    </button>
                  </div>
              </div>
            ) : <LoadingPlaybackCard/>}
    
            {playerError && <Toast type="error" message={playerError}  />}
            {notify && <Toast type="success" message={notify}  />}
    </div>
  </main>
   )
}

