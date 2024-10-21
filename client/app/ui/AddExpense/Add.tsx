
import React, { useState } from 'react';
import Image from "next/image";
import add from '../../public/add.svg'
import Modal from './Modal'
const Add = () => {
    
    const [isAddVisible, setIsAddVisible] = useState(false);
  

    const toggleAddOverlay = () => {
        setIsAddVisible(!isAddVisible);
     
    };

    return (
        <div>
            <div className="fixed right-4 bottom-4 bg-[#005fe4] rounded-full shadow z-999"  onClick={toggleAddOverlay}>
                <div className="w-12 h-12 flex justify-center items-center">
                    <Image src={add} alt="Add expense" />
                </div>
            </div>
            {isAddVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Modal onClose={toggleAddOverlay} />
                </div>
            )}

        </div>
    )
}

export default Add
