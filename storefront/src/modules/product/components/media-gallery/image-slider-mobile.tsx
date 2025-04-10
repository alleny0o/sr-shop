"use client"

import { useRef, useState } from "react"
import Image from "next/image"

type Props = {
  medias: {
    id: string;
    url: string;
    name: string;
    mime_type: "image" | "video";
  }[];
}

const ImageSliderMobile = ({ medias }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollPosition = container.scrollLeft
      const slideWidth = container.clientWidth
      const newIndex = Math.round(scrollPosition / slideWidth)
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    }
  }

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory w-full small:hidden scrollbar-none"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {medias.map((media, index) => (
          <div key={media.id} className="w-full flex-shrink-0 snap-center">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              {media.mime_type === "image" ? (
                <Image
                  src={media.url}
                  priority={index === 0}
                  className="absolute inset-0"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={media.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center small:hidden">
        {medias.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 mx-1 rounded-full transition-opacity ${
              currentIndex === index ? "bg-emerald-700" : "bg-green-500 opacity-50"
            }`}
            onClick={() => {
              setCurrentIndex(index)
              if (scrollContainerRef.current) {
                const container = scrollContainerRef.current
                const slideWidth = container.clientWidth
                container.scrollTo({ left: index * slideWidth, behavior: 'smooth' })
              }
            }}
            aria-label={`Go to media ${index + 1}`}
          />
        ))}
      </div>
    </>
  )
}

export default ImageSliderMobile
