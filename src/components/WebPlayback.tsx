import { useState, useEffect } from 'react';
import { Toast } from './Toast';
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
  <svg className={className}  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill='currentColor'  d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"/></svg>
)

export const Dislike = ({ className } : {className?:string} ) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill='currentColor' d="M20 3H6.693A2.01 2.01 0 0 0 4.82 4.298l-2.757 7.351A1 1 0 0 0 2 12v2c0 1.103.897 2 2 2h5.612L8.49 19.367a2.004 2.004 0 0 0 .274 1.802c.376.52.982.831 1.624.831H12c.297 0 .578-.132.769-.36l4.7-5.64H20c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2m-8.469 17h-1.145l1.562-4.684A1 1 0 0 0 11 14H4v-1.819L6.693 5H16v9.638zM18 14V5h2l.001 9z"/></svg>
)

type props= {
  spotify_access_token: string;
}

type Track = {
  name: string;
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
    current_track: Track; // Reemplaza 'any' con el tipo correcto para 'current_track'
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

export function WebPlayback({spotify_access_token}: props) {
  const [player, setPlayer] = useState<Player|null>(null);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<Track | null>(null);
  // const [current_track, setTrack] = useState<Track | null>({
  //   name: "Canción de ejemplo",
  //   album: {
  //     images: [{url: "https://via.placeholder.com/150"}]
  //   },
  //   artists: [{name: "Artista de ejemplo"}]
  // });

  const [playerError, setPlayerError] = useState<string|null>(null);

  useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
              name: 'Web Playback SDK',
              getOAuthToken: (cb:(token: string) => void) => { cb(spotify_access_token); },
              volume: 0.5
          });

          setPlayer(player);

          player.addListener('ready', ({ device_id }:{device_id:string}) => {
              const transferPlayback = async (spotifyToken:string, deviceId: string) => {
              await fetch('https://api.spotify.com/v1/me/player',
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${spotifyToken}`
                },
                body: JSON.stringify({
                  device_ids:[deviceId],
                  // play:true TODO: decidir si establecer o no el autoplay
                })
              })
            }

            transferPlayback(spotify_access_token!, device_id);
          });

          player.addListener('not_ready', ({ device_id }:{device_id:string}) => {
              console.log('Device ID has gone offline', device_id);
              setPlayerError('Device has gone offline');
          });

          player.addListener('player_state_changed', ((state:PlayerState) => {
              if (!state) {
                  return;
              }

              setTrack(state.track_window.current_track);
              setPaused(state.paused);


              player.getCurrentState().then((state:PlayerState) => { 
                  (!state)? setActive(false) : setActive(true) 
              });
          }));

          player.connect();
      };
  }, []);


  return (<div className='grid place-content-center'>
              {current_track ? (
              <div className='flex flex-col gap-1 items-center justify-center w-fit rounded-md overflow-hidden bg-zinc-900 border border-zinc-800'>
                  <div className='flex flex-col relative' >
                    <div className='w-[150px] h-[150px]'>
                       <img src={current_track.album.images[0].url} alt="" />
                    </div>
  
                    <div className='flex flex-col text-xs p-1'>
                          <div className='font-bold border-b border-accent-light w-fit mb-1 text-accent-light'>
                            {current_track.name}
                          </div>
  
                          <div className='italic'>
                            {current_track.artists[0].name}
                          </div>
                    </div>
                  </div>
                  
                  <div className='flex gap-2 items-center justify-center p-3'>
                    <button className="btn-spotify" onClick={() => { player?.nextTrack() }} >
                          <Dislike className='hover:scale-105 transition-transform'/>
                    </button>
  
                    <button className="border p-2 rounded-full hover:border-accent-light transition-colors" onClick={() => { player?.togglePlay() }} >
                        { is_paused ? 
                          <Play/>
                        : <Pause/> }
                    </button>
  
                    <button className="btn-spotify" onClick={() => { console.log('liked'); player?.nextTrack() }} >
                          <Like className='hover:scale-105 transition-transform'/>
                    </button>
                  </div>
              </div>
              // TODO: agregar spinner component para la carga
            ) : "loading..."}
    

            {playerError && <Toast type="error" message={playerError}  />}
        </div>
   )
}
