'use client'

import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

type CarouselProps = {
  items: ReactNode[]
  className?: string
  itemClassName?: string
  itemsPerSlide?: number
  showNavigators?: boolean
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function Carousel({
  items,
  className,
  itemClassName,
  itemsPerSlide = 1,
  showNavigators = true
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = useMemo(() => {
    const perSlide = Math.max(1, Math.floor(itemsPerSlide))
    const chunks: ReactNode[][] = []

    for (let i = 0; i < items.length; i += perSlide) {
      chunks.push(items.slice(i, i + perSlide))
    }

    return chunks
  }, [items, itemsPerSlide])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setIsAtStart(scrollLeft <= 4)
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 4)
      const nextActive = Math.round(scrollLeft / Math.max(clientWidth, 1))
      setActiveSlide(Math.min(Math.max(nextActive, 0), Math.max(slides.length - 1, 0)))
    }

    handleScroll()

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [slides.length])

  useEffect(() => {
    setActiveSlide(0)
  }, [slides.length])

  const scrollByAmount = (direction: 'prev' | 'next') => {
    const container = containerRef.current
    if (!container) return

    const { clientWidth } = container
    const offset = direction === 'next' ? clientWidth : -clientWidth
    container.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <div className={cn('flex w-full flex-col items-center gap-4', className)}>
      <div className='flex w-full items-center justify-center gap-4'>
        <button
          type='button'
          className={cn(
            'hidden shrink-0 items-center justify-center text-main-azul transition',
            showNavigators && 'sm:inline-flex',
            'h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20',
            'hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-azul focus-visible:ring-offset-2',
            (!showNavigators || isAtStart) && 'pointer-events-none opacity-40'
          )}
          aria-label='Ver anterior'
          onClick={() => scrollByAmount('prev')}
          disabled={isAtStart || !showNavigators}
        >
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.4'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12'
          >
            <path d='M15 18l-6-6 6-6' />
          </svg>
        </button>

        <div
          ref={containerRef}
          className='no-scrollbar flex w-full max-w-full flex-1 snap-x snap-mandatory gap-6 overflow-x-auto pb-4'
        >
          {slides.map((slideItems, slideIndex) => (
            <div key={slideIndex} className='min-w-full snap-center'>
              <div
                className='grid place-items-center gap-6'
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    slideItems.length,
                    Math.max(1, Math.floor(itemsPerSlide))
                  )}, minmax(0, 1fr))`
                }}
              >
                {slideItems.map((item, itemIndex) => (
                  <div
                    key={`${slideIndex}-${itemIndex}`}
                    className={cn(
                      'flex h-full flex-col rounded-3xl p-6 backdrop-blur-sm',
                      itemClassName
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type='button'
          className={cn(
            'hidden shrink-0 items-center justify-center text-main-azul transition',
            showNavigators && 'sm:inline-flex',
            'h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20',
            'hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-azul focus-visible:ring-offset-2',
            (!showNavigators || isAtEnd) && 'pointer-events-none opacity-40'
          )}
          aria-label='Ver siguiente'
          onClick={() => scrollByAmount('next')}
          disabled={isAtEnd || !showNavigators}
        >
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.4'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12'
          >
            <path d='M9 18l6-6-6-6' />
          </svg>
        </button>
      </div>

      {slides.length > 1 && (
        <div className='flex items-center gap-2'>
          {slides.map((_, index) => (
            <span
              key={`indicator-${index}`}
              aria-hidden='true'
              className={cn(
                'block h-2 w-2 rounded-full bg-gray-300 transition-all duration-200 ease-out',
                activeSlide === index && 'w-6 bg-main-azul'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
