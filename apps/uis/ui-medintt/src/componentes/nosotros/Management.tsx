'use client'

import { type ReactElement, useEffect, useMemo, useState } from 'react'
import Carousel from '../shared/Carousel'
import ManagementProfile, { type ManagementProfileProps } from './ManagementProfile'

const profiles: ManagementProfileProps[] = [
  {
    src: '/resources/profesionales/oscar_franchi.jpg',
    name: 'Dr. Oscar Franchi',
    description:
      'Director de Medintt. Médico especialista en Ortopedia, Traumatología y Medicina del Trabajo. Formación en Cirugía Mini Invasiva del Pie.',
    socialmedia: [
      {
        url: 'https://www.instagram.com/droscarfranchi',
        icon: 'instagram'
      },
      {
        url: 'https://www.facebook.com/oscar.franchi.9',
        icon: 'facebook'
      },
      {
        url: 'https://www.linkedin.com/in/oscar-franchi-74b0b810',
        icon: 'linkedin'
      }
    ]
  },
  {
    src: '/resources/profesionales/cecilia_chacon.jpg',
    name: 'Dra. Cecilia Chacón',
    description:
      'Gerente general. Especialista en clínica médica. Auditoría médica y Gestión de los Servicios de Salud.',
    socialmedia: [
      {
        url: 'https://www.instagram.com/cecilia.mariela.chacon',
        icon: 'instagram'
      },
      {
        url: 'https://www.facebook.com/ceciliamchacon',
        icon: 'facebook'
      },
      {
        url: 'https://www.linkedin.com/in/cecilia-chacon-37003b10',
        icon: 'linkedin'
      }
    ]
  },
  {
    src: '/resources/profesionales/sergio_luscher.jpg',
    name: 'Dr. Sergio Luscher',
    description:
      'Especialista en Medicina del Deporte, Especialista en Traumatología y Ortopedia, Profesor Nacional de Educación Física.',
    socialmedia: [
      {
        url: 'https://www.instagram.com/sergio.luscher',
        icon: 'instagram'
      },
      {
        url: 'https://www.facebook.com/sergiohugo.luscher',
        icon: 'facebook'
      }
    ]
  },
  {
    src: '/resources/profesionales/viviana.jpg',
    name: 'Dra. Viviana',
    description: 'Dermatóloga',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/araceli.jpg',
    name: 'Araceli',
    description: 'Secretaria',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/miguel_briñon.jpg',
    name: 'Dr. Briñon Miguel',
    description: 'Cirujano',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/claudio_martinez.jpg',
    name: 'Martinez Claudio',
    description: 'Nutricionista',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/constantini_pablo.jpg',
    name: 'Dr. Constantini Pablo',
    description: 'Neurólogo',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/fillippelli_fernando.jpg',
    name: 'Dr. Fillippelli Fernando',
    description: 'Gastroenterólogo',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/riffo_mauricio.jpg',
    name: 'Riffo Mauricio',
    description: 'Técnico de egometrías',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/constanza_olga.jpg',
    name: 'Dra. Constanza Fernandez Olga',
    description: 'Otorrinolaringóloga',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/carla.jpg',
    name: 'Carla',
    description: '',
    socialmedia: []
  },
  {
    src: '/resources/profesionales/pereyra_paula.jpg',
    name: 'Pereyra Cerasuolo Maria Paula',
    description: '',
    socialmedia: []
  }
]

export default function Management(): ReactElement {
  const [itemsPerSlide, setItemsPerSlide] = useState(1)

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth

      if (width >= 2050) {
        setItemsPerSlide(5)
        return
      }

      if (width >= 1780) {
        setItemsPerSlide(4)
        return
      }

      if (width >= 1350) {
        setItemsPerSlide(3)
        return
      }

      if (width >= 1024) {
        setItemsPerSlide(2)
        return
      }

      setItemsPerSlide(1)
    }

    updateItemsPerSlide()
    window.addEventListener('resize', updateItemsPerSlide)
    return () => window.removeEventListener('resize', updateItemsPerSlide)
  }, [])

  const carouselItems = useMemo(
    () =>
      profiles.map((profile) => (
        <ManagementProfile
          key={profile.name}
          src={profile.src}
          name={profile.name}
          description={profile.description}
          socialmedia={profile.socialmedia}
        />
      )),
    []
  )

  return (
    <div className='flex w-full flex-col items-center justify-center gap-6 text-main-azul'>
      <h3 className='text-center text-2xl font-bold lg:text-3xl xl:text-4xl'>Nuestros profesionales</h3>
      <Carousel
        items={carouselItems}
        itemsPerSlide={itemsPerSlide}
        className='w-full'
        itemClassName='bg-transparent p-0 shadow-none'
      />
    </div>
  )
}
