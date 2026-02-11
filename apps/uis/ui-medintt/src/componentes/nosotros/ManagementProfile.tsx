import { type ReactElement } from 'react'

export type SocialIcon = 'facebook' | 'instagram' | 'linkedin'

export type ManagementProfileProps = {
  src: string
  name: string
  description: string
  socialmedia: Array<{ url: string; icon: SocialIcon }>
}

const iconMap: Record<SocialIcon, JSX.Element> = {
  facebook: (
    <svg
      aria-hidden='true'
      focusable='false'
      viewBox='0 0 24 24'
      className='h-4 w-4 fill-current'
    >
      <path d='M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06c0 4.99 3.66 9.13 8.44 9.94v-7.03H8.1v-2.91h2.34V9.75c0-2.32 1.38-3.61 3.5-3.61.7 0 1.55.12 1.93.18v2.12h-1.09c-1.08 0-1.42.67-1.42 1.35v1.62h2.58l-.41 2.91h-2.17v7.08C18.43 21.37 22 17.05 22 12.06Z' />
    </svg>
  ),
  instagram: (
    <svg
      aria-hidden='true'
      focusable='false'
      viewBox='0 0 24 24'
      className='h-4 w-4 fill-current'
    >
      <path d='M12 7.35a4.65 4.65 0 1 0 4.65 4.65A4.66 4.66 0 0 0 12 7.35Zm0 7.65A3 3 0 1 1 15 12a3 3 0 0 1-3 3Zm5.94-7.94a1.09 1.09 0 1 1-1.09-1.09 1.09 1.09 0 0 1 1.09 1.09ZM21.66 12c0-1.52.01-3.05-.07-4.57a5.12 5.12 0 0 0-5-5C14.1 2.35 9.9 2.35 7.41 2.43a5.12 5.12 0 0 0-5 5C2.35 9.9 2.35 14.1 2.43 16.59a5.12 5.12 0 0 0 5 5c2.49.08 6.69.08 9.18 0a5.12 5.12 0 0 0 5-5c.08-1.52.05-3.05.05-4.57ZM19.85 17a3.27 3.27 0 0 1-3.21 3.21c-2.33.07-6.94.07-9.27 0A3.27 3.27 0 0 1 4.16 17c-.07-2.33-.07-6.94 0-9.27A3.27 3.27 0 0 1 7.37 4.52c2.33-.07 6.94-.07 9.27 0A3.27 3.27 0 0 1 19.52 7.7c.07 2.33.07 6.94.33 9.27Z' />
    </svg>
  ),
  linkedin: (
    <svg
      aria-hidden='true'
      focusable='false'
      viewBox='0 0 24 24'
      className='h-4 w-4 fill-current'
    >
      <path d='M20.45 3H3.55A.55.55 0 0 0 3 3.55v16.9a.55.55 0 0 0 .55.55h16.9a.55.55 0 0 0 .55-.55V3.55A.55.55 0 0 0 20.45 3ZM8.56 18.56H6.13V9.85h2.43v8.71ZM7.35 8.71a1.41 1.41 0 1 1 1.41-1.41 1.41 1.41 0 0 1-1.41 1.41Zm11.21 9.85h-2.43v-4.25c0-1.02 0-2.33-1.42-2.33s-1.64 1.11-1.64 2.26v4.32h-2.43V9.85h2.33v1.19h.03a2.55 2.55 0 0 1 2.29-1.26c2.44 0 2.89 1.6 2.89 3.68Z' />
    </svg>
  )
}

export default function ManagementProfile({
  src,
  name,
  description,
  socialmedia
}: ManagementProfileProps): ReactElement {
  return (
    <div className='flex h-[33rem] w-fit flex-col overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f5f5f7] via-[#c9c9d8] to-[#8b8ba3] pb-6 text-main-azul shadow-lg'>
      <div className='mx-auto h-[19rem] w-[17rem] overflow-hidden rounded-[1.5rem] bg-white/60 backdrop-blur-sm sm:h-[20rem] sm:w-[18rem] md:h-[21rem] md:w-[20rem] lg:h-[21.5rem] lg:w-[21rem] xl:h-[22rem] xl:w-[22rem]'>
        {src ? (
          <img
            src={src}
            alt={name}
            className='h-full w-full object-cover'
          />
        ) : null}
      </div>
      <div className='mt-6 flex w-[17rem] flex-col gap-4 px-6 text-left sm:w-[18rem] md:w-[20rem] lg:w-[21rem] xl:w-[22rem]'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <span className='text-lg font-bold'>{name}</span>
          {socialmedia.length > 0 && (
            <div className='flex items-center gap-2'>
              {socialmedia.map(({ url, icon }) => (
                <button
                  key={`${name}-${icon}-${url}`}
                  type='button'
                  className='text-main-azul transition-transform hover:scale-110'
                  onClick={() => {
                    window.open(url, '_blank', 'noopener,noreferrer')
                  }}
                  aria-label={`Abrir ${icon} de ${name}`}
                >
                  {iconMap[icon]}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className='text-sm leading-relaxed text-white'>{description}</p>
      </div>
    </div>
  )
}
