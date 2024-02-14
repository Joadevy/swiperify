import type { DevicesResponse, SpotifyTrackResponse } from "./types";

export const SPOTIFY_GENRES = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"];

const API_BASEURL = 'https://api.spotify.com/v1';

const getRandomSpotifyGenres = (amount:number=5, spotifyGenres=SPOTIFY_GENRES) => {
  const result = [];
  const tempArray = [...spotifyGenres];

  for (let i = 0; i < amount; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    result.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }

  return result.join(',');
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

function getRandomSearch() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';  
  const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));

  return randomCharacter
}

export const getRandomTrackUri = async (spotifyToken:string, genre:string,amountTracks:number=1) => {
  const randomOffset = Math.floor(Math.random() * 1000);
  const search = getRandomSearch();
  const query = `${search}` + (genre !== 'all' ? `%20genre:${genre}` : '');

  try {
    const track:SpotifyTrackResponse = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=${amountTracks}&offset=${randomOffset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      }
    }).then(res => res.json());

    return track.tracks['items'][0]['uri'];
  } catch (error) {
    console.error(error);
  }
}

 export const queueNewSong = async (spotifyToken:string,context_uri:string) => {
  console.log(context_uri)
        const response:{
          ok:boolean;
          status:number;
        } = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${context_uri}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${spotifyToken}`
            }
        })  

        if (!response.ok) 
            console.error(response.status);
}


// spotify:track:0J9g1MMJDhyvOb3NWckHMm
      