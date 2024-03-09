import React, { useState } from 'react'

type props = {
  action: (value:number) => void
}

const volumenSvg = {
  0 : <svg className='block' xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M15.64 4.91c-.714.347-1.62.942-2.909 1.792l-.219.144l-.05.033c-.38.25-.643.424-.931.552a3.75 3.75 0 0 1-.89.267c-.31.052-.626.052-1.082.052H9.5c-1.444 0-1.93.016-2.345.208a2.47 2.47 0 0 0-1.036.975c-.218.405-.259.82-.336 2.084c-.02.347-.033.68-.033.983c0 .303.012.636.033.983c.077 1.264.118 1.68.336 2.084c.209.389.635.79 1.036.975c.414.192.901.208 2.345.208h.06c.455 0 .77 0 1.081.052c.307.052.605.142.89.267c.288.128.552.301.932.552l.05.033l.218.144c1.29.85 2.195 1.445 2.91 1.792c.711.346 1.068.36 1.317.275c.137-.047.272-.115.39-.199c.217-.152.415-.447.553-1.218c.14-.775.191-1.847.262-3.377c.053-1.12.087-2.06.087-2.571c0-.512-.034-1.451-.087-2.57c-.07-1.531-.122-2.603-.262-3.378c-.138-.771-.336-1.066-.552-1.218a1.569 1.569 0 0 0-.391-.2c-.25-.084-.605-.07-1.318.276m-.655-1.35c.826-.4 1.64-.624 2.457-.345c.272.093.534.226.769.391c.706.497 1.005 1.28 1.167 2.18c.159.884.213 2.056.281 3.516l.003.058c.052 1.115.088 2.088.088 2.64s-.036 1.525-.088 2.64l-.003.058c-.068 1.46-.122 2.632-.281 3.516c-.162.9-.461 1.683-1.167 2.18a3.066 3.066 0 0 1-.769.39c-.818.28-1.631.057-2.457-.344c-.814-.396-1.8-1.047-3.032-1.858l-.266-.176c-.448-.295-.602-.394-.762-.464c-.17-.076-.35-.13-.534-.16c-.171-.03-.354-.032-.89-.032h-.162c-1.217 0-2.062.001-2.814-.347a3.962 3.962 0 0 1-1.727-1.624c-.392-.729-.438-1.49-.504-2.575l-.008-.13A17.873 17.873 0 0 1 4.25 12c0-.341.014-.706.036-1.074l.008-.13c.066-1.084.112-1.846.504-2.575a3.962 3.962 0 0 1 1.727-1.624c.752-.348 1.597-.348 2.814-.347H9.5c.537 0 .72-.002.891-.031a2.25 2.25 0 0 0 .534-.16c.16-.07.314-.17.761-.465l.267-.176c1.231-.811 2.218-1.462 3.032-1.857" clipRule="evenodd"/></svg>,
  25 : <svg className='block' xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1.535 10.971c.073-1.208.11-1.813.424-2.394a3.215 3.215 0 0 1 1.38-1.3C3.94 7 4.627 7 6 7c.512 0 .768 0 1.016-.042a3 3 0 0 0 .712-.214c.23-.101.444-.242.871-.524l.22-.144C11.36 4.399 12.632 3.56 13.7 3.925c.205.07.403.17.58.295c.922.648.993 2.157 1.133 5.174A68.21 68.21 0 0 1 15.5 12c0 .532-.035 1.488-.087 2.605c-.14 3.018-.21 4.526-1.133 5.175a2.314 2.314 0 0 1-.58.295c-1.067.364-2.339-.474-4.882-2.151L8.6 17.78c-.427-.282-.64-.423-.871-.525a3 3 0 0 0-.712-.213C6.768 17 6.512 17 6 17c-1.374 0-2.06 0-2.66-.277a3.215 3.215 0 0 1-1.381-1.3c-.314-.582-.35-1.186-.424-2.395A17.127 17.127 0 0 1 1.5 12c0-.323.013-.671.035-1.029Z"/><path strokeLinecap="round" d="M20 6s1.5 1.8 1.5 6s-1.5 6-1.5 6" opacity=".4"/><path strokeLinecap="round" d="M18 9s.5.9.5 3s-.5 3-.5 3" opacity=".7"/></g></svg>,
  50 : <svg className='block' xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M12.14 4.91c-.714.347-1.62.942-2.909 1.792l-.219.144l-.05.033c-.38.25-.643.424-.931.552a3.75 3.75 0 0 1-.89.267c-.31.052-.626.052-1.082.052H6c-1.444 0-1.93.016-2.345.208a2.47 2.47 0 0 0-1.036.975c-.218.405-.259.82-.336 2.084c-.02.347-.033.68-.033.983c0 .303.012.636.033.983c.077 1.264.118 1.68.336 2.084c.209.389.635.79 1.036.975c.414.192.901.208 2.345.208h.06c.455 0 .77 0 1.081.052c.307.052.605.142.89.267c.288.128.552.301.932.552l.05.033l.218.144c1.29.85 2.195 1.445 2.91 1.792c.711.346 1.068.36 1.317.275c.137-.047.272-.115.39-.199c.217-.152.415-.447.553-1.218c.14-.775.191-1.847.263-3.377c.052-1.12.086-2.06.086-2.571c0-.512-.034-1.451-.086-2.57c-.072-1.531-.123-2.603-.262-3.378c-.14-.771-.337-1.066-.553-1.218a1.569 1.569 0 0 0-.391-.2c-.25-.084-.606-.07-1.318.276m-.655-1.35c.826-.4 1.64-.624 2.457-.345c.272.093.534.226.769.391c.706.497 1.005 1.28 1.167 2.18c.159.884.213 2.056.281 3.516l.003.058c.052 1.115.088 2.088.088 2.64s-.036 1.525-.088 2.64l-.003.058c-.068 1.46-.122 2.632-.281 3.516c-.162.9-.461 1.683-1.167 2.18a3.066 3.066 0 0 1-.769.39c-.818.28-1.631.057-2.457-.344c-.814-.396-1.8-1.047-3.032-1.858l-.267-.176c-.447-.295-.602-.394-.76-.464a2.17 2.17 0 0 0-.535-.16c-.171-.03-.354-.032-.89-.032h-.162c-1.217 0-2.062.001-2.814-.347a3.962 3.962 0 0 1-1.727-1.624c-.392-.729-.438-1.49-.504-2.575l-.008-.13A17.876 17.876 0 0 1 .75 12c0-.341.014-.706.036-1.074l.008-.13C.86 9.712.906 8.95 1.298 8.22a3.962 3.962 0 0 1 1.727-1.624c.752-.348 1.597-.348 2.814-.347H6c.537 0 .72-.002.891-.031a2.25 2.25 0 0 0 .534-.16c.16-.07.314-.17.761-.465l.267-.176c1.231-.811 2.218-1.462 3.032-1.857m8.035 1.864a.75.75 0 0 1 1.056.096L20 6l.576-.48l.001.001l.002.002l.003.004l.007.009a2.395 2.395 0 0 1 .086.114a4.7 4.7 0 0 1 .203.311c.161.27.368.665.572 1.195c.408 1.061.8 2.653.8 4.844c0 2.192-.392 3.783-.8 4.845a7.7 7.7 0 0 1-.572 1.194a4.677 4.677 0 0 1-.268.399l-.013.017l-.008.01l-.007.009l-.003.003l-.002.002L20 18l.576.48a.75.75 0 0 1-1.156-.955m0 0l.003-.005l.031-.041a3.28 3.28 0 0 0 .137-.212c.12-.198.288-.516.459-.961c.342-.889.7-2.297.7-4.306c0-2.008-.358-3.417-.7-4.306a6.212 6.212 0 0 0-.459-.961a3.274 3.274 0 0 0-.171-.257l.003.004l-.001-.002l-.002-.002a.75.75 0 0 1 .1-1.052m-1.884 2.92a.75.75 0 0 1 1.02.292l-.628.349l.628-.349v.001l.001.002l.002.003l.004.007l.01.018l.026.054a5.001 5.001 0 0 1 .278.805c.14.551.273 1.364.273 2.474s-.132 1.923-.273 2.474a5.172 5.172 0 0 1-.203.631a2.947 2.947 0 0 1-.102.228l-.01.019l-.003.007l-.002.003v.001s-.001.002-.63-.347l.629.348a.75.75 0 0 1-1.317-.719l.005-.01a3.665 3.665 0 0 0 .18-.534c.108-.424.226-1.11.226-2.1s-.118-1.678-.227-2.102a3.662 3.662 0 0 0-.179-.534l-.005-.01a.75.75 0 0 1 .297-1.01" clipRule="evenodd"/></svg>,
}

const getVolumeSvg = (volume:number) => {
  if(volume === 0) return volumenSvg[0]
  if(volume < 50) return volumenSvg[25]
  if(volume >= 50) return volumenSvg[50]
  return volumenSvg[25]
}
  

const VolumeController = ( {  action
} : props
) => {
  const [volume, setVolume] = useState(50)
  return (
    <div className='flex gap-2 items-center justify-center absolute right-3 ' title={
      volume === 0 
      ? 'Unmute'
      : 'Mute'
    }>
      <button onClick={
      () => {
        if (volume === 0) {
          action(50/100)
          setVolume(50)
          return
        }
        action(0)
        setVolume(0)
      }
    }>
        {getVolumeSvg(volume)}
      </button>

      <input type="range" value={volume} className=" accent-accent-light w-[150px]" onChange={
                  e => {
                    action(Number(e.target.value)/100)
                    setVolume(+e.target.value)
                  }
      }/>
    </div>
  )
}

export default VolumeController