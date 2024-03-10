import {  useState } from 'react';

function FreePlanModal() {
  const [isOpen, setIsOpen] = useState(true);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={isOpen ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ' : ''}>
      {isOpen && (
        <dialog
          open
          className="bg-zinc-800 text-slate-200 shadow-lg rounded-md w-80 sm:w-[500px] inset-0"
        >
          <button className='border border-zinc-300 rounded-full px-2  absolute top-2 right-2 hover:opacity-75 transition-opacity text-base text-zinc-300' onClick={closeModal}>X</button>
          <div className="p-4 rounded m-4">
            <h2 className="text-xl font-bold mb-4">Spotify plan information</h2>
            <p className='text-base'>
              We've detected that <span className='text-accent-light'> you're not a premium Spotify user</span>, and unfortunately, you won't be able to use this app to its full capacity. To enjoy the full experience, please log in with a premium account or upgrade your current plan.
            </p>
            <p className="mt-2 mb-4 text-base">
              We apologize for the inconvenience, but this is a Spotify policy and does not depend on us.
            </p>

            <footer className='flex text-base justify-between'>
              <button type='submit' onClick={closeModal} className="px-2 py-1 bg-accent-light text-zinc-800 rounded-sm hover:scale-105 hover:cursor-pointer transition-all hover:opacity-85'">
                I understand
              </button>
            </footer>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default FreePlanModal;