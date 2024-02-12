import { useEffect, useState } from "react"
import { useCurrentDevice } from "../hooks/useCurrentDevice"
import { Toast } from "./Toast"
import type { Device } from "../lib/types"

export const Pause = ({ className }:{className?:string}) => (
  <svg className={className} role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
)

export const Play = ({ className } : {className?:string} ) => (
  <svg className={className} role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
)

export const VolumeSilence = () => (
  <svg fill="currentColor" role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volumen apagado" viewBox="0 0 16 16" ><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path></svg>
) 

export const Volume = () => (
  <svg fill="currentColor" role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volumen alto" id="volume-icon" viewBox="0 0 16 16"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>
  )

  type Props = {
    spotifyToken: string,
    currentDevice: Device | null;
  }

const Player = ({spotifyToken, currentDevice}:Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const showNoDeviceToast = !currentDevice;

    useEffect(() => {
        //TODO: esta funcion podria usarse cuando se hace like/dislike pero el context_uri tendria que ser dinamico
        const playNewSong = async () => {
        const response:{
          ok:boolean;
          status:number;
        } = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${currentDevice}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${spotifyToken}`
            },
            body:JSON.stringify({
                "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
                "position_ms":0,
                "offset":{
                  "position":5
                }
            })
        })  

        if (!response.ok) 
            console.error(response.status);
        }

        const pauseSong = async () => {
          if (currentDevice) 
            await fetch(`https://api.spotify.com/v1/me/player/pause`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${spotifyToken}`
                }
            })
        }

        if (isPlaying) {
            playNewSong();
        } else {
            pauseSong();
        }
    },[isPlaying])
        

    return (
    <div>
        <button className="border p-2 rounded-full bg-white" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause/> : <Play />}
        </button>

        {/* {showNoDeviceToast && <div className="bg-red-500 text-white p-2 rounded">No se ha podido obtener el dispositivo actual</div>} */}
        {showNoDeviceToast && <Toast type="error" message="We couldn't get the device. Please open spotify somewhere to continue."  />}
    
    </div>
  )
}

export default Player