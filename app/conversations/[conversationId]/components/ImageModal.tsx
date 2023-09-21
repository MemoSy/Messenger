'use client'

import Modal from "@/app/components/Modal";
import Image from "next/image";
import React from "react";

interface ImageModalProps {
  isOpen?: boolean;
  onClose: () => void;
  src: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({
  onClose,
  src,
  isOpen
}) => {
  if (!src) {
    return null
  }
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="w-80 h-80">
        <Image
          src={src}
          fill
          className="object-cover"
          alt="Image"
        />
      </div>
    </Modal>
  )
}

export default ImageModal
