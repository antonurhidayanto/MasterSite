import React, { useEffect, useState } from 'react'
import { Button } from 'globalUtils/components'

interface ModalProps {
  show?: boolean;
  action: (event: React.FormEvent<HTMLFormElement>) => void;
  cancel: () => void;
  text: string;
  children: React.ReactNode;
  isEdit?: boolean;
  selectedRow?: any;
}

const Modal: React.FC<ModalProps> = ({ show = false, action, cancel, text, children,isEdit }) => {
  const [isShow, setIsShow] = useState<boolean>(false)

  useEffect(() => {
    if (show) {
      setIsShow(true)
    }
  }, [show])

  const handleOk = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Fungsi handleOk dijalankan");
    event.preventDefault();  
    action(event); 
    setIsShow(false);
  };

  function handleCancel() {
    setIsShow(false)
    cancel()
  }

  return (
    <div className={`${isShow ? 'visible' : 'invisible'} transition-opacity duration-300 ease-in-out`}>
      <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-40">
        <div className="w-full flex items-center justify-center ">
          {/* Cuma tempelan supaya ketengah axis-y nya */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          {/* sampe sini aja */}

          <div className="w-full flex items-center justify-center flex-col p-4 shadow-sm rounded-lg">
            <div className="w-full py-2 flex items-center justify-center flex-col">
              <div className="text-white my-2 text-center flex flex-wrap">
                {text}
              </div>
              <div className="text-white my-2 text-center flex flex-wrap">
                {children}
              </div>
            </div>
            <div className="w-full py-2 flex justify-center items-center gap-2 text-white">
              <Button variant="secondary" onClick={handleCancel} type="button" text="Cancel">Cancel</Button>
              <Button variant='secondary' onClick={(event) => handleOk(event)} type="button" text={isEdit ? 'Update' : 'Ok'} >{isEdit ? 'Update' : 'Ok'}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
