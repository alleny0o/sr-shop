"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play } from "lucide-react"

type Props = {
  medias: {
    id: string;
    url: string;
    name: string;
    mime_type: "image" | "video";
  }[];
}

const ImageViewerDesktop = ({ medias }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="hidden small:block relative">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-100 rounded-xl">
        <motion.div
          key={medias[currentIndex]?.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {medias[currentIndex]?.mime_type === "image" ? (
            <Image
              src={medias[currentIndex].url}
              priority
              alt={`Product image ${currentIndex + 1}`}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          ) : (
            <video
              src={medias[currentIndex].url}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
          )}
        </motion.div>
      </div>

      <div
        className="hidden small:flex gap-2 overflow-x-auto pb-2 mt-2 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {medias.map((media, index) => (
          <motion.button
            key={media.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-20 w-20 overflow-hidden flex-shrink-0 rounded-md transition-opacity ${
              currentIndex === index
                ? "opacity-100"
                : "opacity-50 hover:opacity-80"
            }`}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.1 }}
            aria-label={`View product ${index + 1}`}
          >
            {media.mime_type === "image" ? (
              <Image
                src={media.url}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover rounded-md"
                sizes="64px"
              />
            ) : (
              <>
                <video
                  src={media.url}
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
                <div className="absolute bottom-1 right-1 bg-black/50 p-[2px] rounded-md">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ImageViewerDesktop
