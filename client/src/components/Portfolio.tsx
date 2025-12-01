import React, { useState } from 'react';
import wallImage from '@/assets/wall-finishing.jpg';
import floorImage from '@/assets/floor-finishing.jpg';
import ceilingImage from '@/assets/ceiling-finishing.jpg';
import house from '@/assets/house.jpeg';
import house2 from '@/assets/house2.jpeg';
import office from '@/assets/office.jpeg';
import office2 from '@/assets/office2.jpeg';
import studia from '@/assets/studia.jpeg';
import living from '@/assets/living.jpeg';
import living2 from '@/assets/living2.jpeg';
import kitchen from '@/assets/kitchen.jpeg';
import kitchen2 from '@/assets/kitchen2.jpeg';
import bedroom from '@/assets/bedroom.jpeg';
import bedroom2 from '@/assets/bedroom2.jpeg';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const projects = [
  {
    image: wallImage,
  },
  {
    image: floorImage,
  },
  {
    image: ceilingImage,
  },
  {
    image: wallImage,
  },
  {
    image: floorImage,
  },
  {
    image: ceilingImage,
  },
  {
    image: house,
  },
  {
    image: house2,
  },
  {
    image: office,
  },
  {
    image: office2,
  },
  {
    image: studia,
  },
  {
    image: living,
  },
  {
    image: living2,
  },
  {
    image: kitchen,
  },
  {
    image: kitchen2,
  },
  {
    image: bedroom,
  },
  {
    image: bedroom2,
  },
];

export default function Portfolio(): React.JSX.Element {
  const [index, setIndex] = useState(0);

  const prev = (): void => setIndex((i) => (i - 1 + projects.length) % projects.length);
  const next = (): void => setIndex((i) => (i + 1) % projects.length);

  const goTo = (i: number): void => setIndex(i);

  return (
    <section id="portfolio" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Наши Проекты</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Портфолио реализованных проектов с использованием современных материалов
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Image display */}
          <div className="relative rounded-lg shadow-soft overflow-hidden">
            <div className="aspect-[4/3] bg-black">
              <img
                src={projects[index].image}
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>

            {/* overlay text */}
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-md">
              <div className="text-primary-foreground"></div>
            </div>

            {/* left arrow */}
            <button
              type="button"
              aria-label="Назад"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 text-foreground rounded-full p-2 shadow-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {/* right arrow */}
            <button
              type="button"
              aria-label="Вперёд"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 text-foreground rounded-full p-2 shadow-md transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* indicators */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {projects.map((project, i) => (
              <button
                key={i}
                aria-label={`Перейти к ${(i + 1).toString()}`}
                onClick={() => goTo(i)}
                className={`h-2 w-8 rounded-full transition-all duration-200 ${
                  i === index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
