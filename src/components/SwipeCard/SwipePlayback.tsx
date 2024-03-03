import { useState, useEffect, useCallback } from 'react';
import { Toast } from '../Toast';
import { getRandomTrackUri, queueNewSong } from '../../lib/spotify';
import { usePlaylist } from '../../hooks/usePlaylist';
import { SelectGenre } from '../SelectGenre';
import SwipePlaybackCard from './SwipePlaybackCard';
import { SwipePlaybackLoading } from './SwipePlaybackLoading';
import { $playlistPicked } from '../../store/playlist';
import { useStore } from '@nanostores/react';
import VolumeController from '../VolumeController';
import PlayerTrackInfoLoading from '../PlayerTrackInfoLoader';
import PlayerTrackInfo from '../PlayerTrackInfo';
import { SongController } from '../SongController';
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
  duration_ms: number;
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
  setVolume: (value:number) => void;
  seek: (value:number) => void;
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

type props= {
  spotify_access_token: string
  playlist_id: string
  children?: React.ReactNode
}

export function SwipePlayback({spotify_access_token, children}: props) {
  const [player, setPlayer] = useState<Player|null>(null);
  const [is_paused, setPaused] = useState(true);
  const [current_track, setTrack] = useState<Track | null>(null);

  const playlistPick = useStore($playlistPicked);
  const [loadingSong, setLoadingSong] = useState(false);
  const [playerError, setPlayerError] = useState<string|null>(null);
  const [notify, setNotify] = useState<string|null>(null);
  const [handleAddToPlaylist] = usePlaylist(spotify_access_token!, playlistPick);
  const [genre, setGenre] = useState<string>('all');
  const artistsChain = current_track?.artists.map(artist => artist.name).join(', ');
    
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
                  // TODO: decidir si establecer o no el autoplay
                  // play:true 
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
          }));

          player.connect();
      };
  }, []);


  useEffect(() => {
    if (playerError){
      setTimeout(() => {
        setPlayerError(null)
      }, 7500)
    } 

    if (notify){
      setTimeout(() => {
        setNotify(null)
      }, 7500)
    }

  },[playerError, notify])

  const addSongToPlaylist = async() => { 
    if (!current_track) return;
    setLoadingSong(true);
    console.log('se le paso: ',current_track.name)
    const addResponse = await handleAddToPlaylist([current_track.uri]);
    if (!addResponse.ok) setPlayerError('We could not add the song to the playlist. Please try again or reload the page.');
    else {
      await handleChangeSong(spotify_access_token, () => player?.nextTrack(), setPlayerError, genre)
      setNotify(`${current_track.name} succesfully added to the playlist!`)
    }
    setLoadingSong(false);
  }

  const nextSongToQueue = useCallback(async () => {
    if (!player) return;
    setLoadingSong(true);
      await handleChangeSong(spotify_access_token,() => player.nextTrack(), setPlayerError, genre)
    setLoadingSong(false);
  }, [player, spotify_access_token, genre]);

  return (
  <main className='flex flex-col items-center gap-2 lg:gap-0'>    
    <div className='flex-wrap lg:self-start w-full gap-2 flex justify-between'>
        {children}

        <SelectGenre setGenre={setGenre}/>
    </div>


    <div className='grid place-content-center lg:-mt-28 relative mb-6'>
              {current_track && !loadingSong ? (
              <div className='drop-shadow-2xl relative p-3 w-[325px] lg:w-[400px] lg:h-[425px] h-[415px] flex flex-col gap-1 items-center justify-center rounded-sm overflow-hidden bg-zinc-900 border border-zinc-800'>
                  <SwipePlaybackCard  
                    actionRight={addSongToPlaylist}
                    actionLeft={nextSongToQueue} 
                      artist={current_track.artists[0].name} 
                      name={current_track.name} 
                      url={current_track.album.images[2]?.url ??  current_track.album.images[1]?.url ?? current_track.album.images[0].url }/>
                  
                  <div className='lg:hidden flex gap-6 lg:gap-3 items-center justify-center p-4 absolute bottom-0'>
                    <button onClick={nextSongToQueue} >
                          <Dislike className='hover:scale-105 transition-transform'/>
                    </button>
  
                    <button className="border p-2 rounded-full hover:border-accent-light transition-colors" onClick={() => { player?.togglePlay() }} >
                        { is_paused ? 
                          <Play/>
                        : <Pause/> }
                    </button>
  
                    <button onClick={addSongToPlaylist} >
                          <Like className='hover:scale-105 transition-transform'/>
                    </button>
                  </div>
              </div>
            ) : <SwipePlaybackLoading/>}
    
            {playerError && <Toast type="error" message={playerError}  />}
            {notify && <Toast type="success" message={notify}  />}
    </div>

    <footer className='hidden border-t border-zinc-600 lg:flex gap-6 lg:gap-3  items-center justify-center p-4 fixed bg-zinc-800 h-[70px] bottom-0 w-full'>
        {current_track && !loadingSong ? <PlayerTrackInfo
          artistsChain={artistsChain ?? ''}
          imageUrl={current_track.album.images[0].url}
          trackName={current_track.name}
        /> : <PlayerTrackInfoLoading />}


        <div className='flex flex-col gap-1 items-center justify-center'>
          <div className="flex gap-3 items-center justify-center">
            <button 
            onClick={nextSongToQueue}
            >
                  <Dislike className='hover:scale-105 transition-transform'/>
            </button>
      
            <button className="border p-2 rounded-full hover:border-accent-light transition-colors" onClick={() => { player?.togglePlay() }} >
                { is_paused ? 
                  <Play/>
                : <Pause/> }
            </button>
      
            <button 
            onClick={addSongToPlaylist}
            >
                  <Like className='hover:scale-105 transition-transform'/>
            </button>
          </div>

          <SongController
            action={(value) => player?.seek(value)}
            durationInSeconds={current_track?.duration_ms ? current_track.duration_ms / 1000 : 0}
            trackId={current_track?.id ?? crypto.randomUUID()}
            isPlaying={!is_paused}
          />
        </div>

        <VolumeController action={(value) => player?.setVolume(value)} />
      </footer>
  </main>
   )
}

