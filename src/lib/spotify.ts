import type { DevicesResponse } from "./types";

const API_BASEURL = 'https://api.spotify.com/v1';

export const playNewSong = async (spotifyToken:string, deviceId:string) => {
        const response:{
          ok:boolean;
          status:number;
        } = await fetch(`${API_BASEURL}/me/player/play ${deviceId ? `?device_id=${deviceId}` : ''}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${spotifyToken}`
            },
            body:JSON.stringify({
              // TODO: esta context_uri debera ser dinamica para ir obteniendo nuevas
                "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
                "position_ms":0,
                "offset":{
                  "position":5
                }
            })
        })  

        if (!response.ok) // TODO: Habria que mostrar un toast o algo al usuario 
            console.error(response.status);
}
          
export const pauseSong = async (spotifyToken:string) => {
  await fetch('https://api.spotify.com/v1/me/player/pause',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${spotifyToken}`
    }
  })
}

export const getCurrentDevice = async (spotifyToken:string) => {
  const {devices}:DevicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${spotifyToken}`
    }
  }).then(res => res.json());
  console.log({devices})

  const currentDevice = devices.find(device => device.is_active || device.supports_volume) ?? devices[0];

  console.log({currentDevice})
  return currentDevice ? currentDevice : null;
}