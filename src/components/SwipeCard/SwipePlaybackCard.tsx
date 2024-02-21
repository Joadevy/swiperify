import { useEffect, useState } from "react"
import styles from './SwipeCard.module.css';


type Props = {
  url: string
  name: string
  artist: string
  actionRight: () => void,
  actionLeft: () => void
}
const DECISION_THRESHOLD = 150;

const SwipePlaybackCard = ({url, name, artist, actionLeft, actionRight}:Props) => {
  // const [isAnimating, setIsAnimating] = useState(false);
  // let pullX = 0;

  useEffect(() => {
    // if (isAnimating) return

    const card = document.getElementById('card-grab') as HTMLElement;

    const startDrag = (e:MouseEvent | TouchEvent ) => {
      // setIsAnimating(true);
      e.preventDefault();
      let startX: number;
      let pullDeltaX: number;
      if ('touches' in e) startX = e.touches[0].pageX;
      else startX = e.pageX;
      
      
      const moveCard = (e:MouseEvent | TouchEvent) => {
        let currentX: number;

        if ('touches' in e) currentX = e.touches[0].pageX;
        else currentX = e.pageX;
        

         pullDeltaX = currentX - startX;


        if (pullDeltaX == 0) return;

        // setIsAnimating(true);
        const deg = pullDeltaX / 15;

        card.style.transform = `translate(${pullDeltaX}px, 0) rotate(${deg}deg)`;
        card.style.cursor = 'grabbing';


        const opacity = Math.abs(pullDeltaX) / 100;
        const isRight = pullDeltaX > 0;

        const choiceElement = isRight ? document.getElementById('goRight') : document.getElementById('goLeft');
        if (choiceElement) choiceElement.style.opacity = `${opacity}`;
      }
      
      const releaseCard = () => {
        const decisionMade = Math.abs(pullDeltaX) > DECISION_THRESHOLD;

        if (decisionMade) {
          const goRight = pullDeltaX >= 0;
          if (goRight) {
            actionRight();
            card.classList.add( styles['go-right']);
          } else {
            actionLeft();
            card.classList.add(styles['go-left']);
          }
        } else {
          card.classList.add(styles['reset'])
          card.classList.remove(styles['go-right'], styles['go-left']);
          const isRight = pullDeltaX >= 0;
          const choiceElement = isRight ? document.getElementById('goRight') : document.getElementById('goLeft');
          if (choiceElement) choiceElement.style.opacity = `0`;
        }

        card.addEventListener('transitionend', () => {
          card.classList.remove(styles['reset'], styles['go-right'], styles['go-left']);
          card.style.transform = '';
          card.style.cursor = 'grab';
        }, {once: true});

        window.removeEventListener('mousemove', moveCard);
        window.removeEventListener('mouseup', releaseCard);
        window.removeEventListener('touchmove', moveCard);
        window.removeEventListener('touchend', releaseCard);
      }

      window.addEventListener('mousemove', moveCard);
      window.addEventListener('mouseup', releaseCard);
    }

    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag, {passive: true});

    return () => {
      card.removeEventListener('mousedown', startDrag);
      card.removeEventListener('touchstart', startDrag);
    }
  }, []);

  return (
     <article id="card-grab" className='flex flex-col absolute top-3 border border-accent-light rounded-md overflow-hidden cursor-grab shadow-xl ' >
        <div className='w-full h-[325px] relative'>
          <img  className='w-full h-full' 
          src={url} 
          alt="" />
        </div>

          <div id="goRight" className="opacity-0 absolute z-100 border-2 top-8 left-4 rotate-[-30deg] w-fit text-2xl font-extrabold rounded-lg px-1 py-2 text-accent-light border-accent-light">
              LIKE
          </div>
          <div id="goLeft" className=" opacity-0 absolute z-100 border-2 top-8 right-4 rotate-[30deg] w-fit text-2xl font-extrabold rounded-lg px-1 py-2 text-tinder-red  border-tinder-red">
              NEXT
          </div>
    
        <div className='flex flex-col text-base p-3 mt-1 absolute bottom-0 rounded-tr-md  bg-opacity-gradient justify-end w-full h-full'>
          <div className='font-bold border-b border-accent-light w-fit mb-1 text-accent-light' title={name}>
            {name.length >= 52 
              ? name.slice(0,52) + '...'
              : name} 
          </div>
    
          <div className='italic'>
            {artist}
          </div>
        </div>
    </article>
  )
}

export default SwipePlaybackCard