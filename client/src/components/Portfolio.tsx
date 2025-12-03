import React, { useState, useEffect, useRef } from 'react';
import wallImage from '@/assets/wall-finishing.jpg';
import floorImage from '@/assets/floor-finishing.jpg';
import ceilingImage from '@/assets/ceiling-finishing.jpg';
import studia from '@/assets/studia.jpeg';
import living from '@/assets/living.jpeg';
import living2 from '@/assets/living2.jpeg';
import kitchen from '@/assets/kitchen.jpeg';
import kitchen2 from '@/assets/kitchen2.jpeg';
import bedroom from '@/assets/bedroom.jpeg';
import bedroom2 from '@/assets/bedroom2.jpeg';

import andreyImage from '@/assets/андрей.png';
import asapImage from '@/assets/асап.jpg';
import zoloImage from '@/assets/золо.jpg';
import leonidImage from '@/assets/Леонид.jpg';
import mortyImage from '@/assets/морти.jpg';
import saraImage from '@/assets/сара.jpg';
import tarasImage from '@/assets/тарас.png';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const projects = [
  { image: wallImage },
  { image: floorImage },
  { image: ceilingImage },
  { image: studia },
  { image: living },
  { image: living2 },
  { image: kitchen },
  { image: kitchen2 },
  { image: bedroom },
  { image: bedroom2 },
];

const reviews = [
  {
    text: 'Отличная работа! Всё сделали быстро и аккуратно.',
    name: 'Какой то тип',
    avatar: andreyImage,
  },
  {
    text: 'Это мои братишки сделали просто супер, респект!',
    name: 'Асап Роки',
    avatar: asapImage,
  },
  { text: 'Это конечно не баобаб, но очень качественно.', name: 'Иван Золо', avatar: zoloImage },
  { text: 'Это преступление такого рода.', name: 'Леонид Коневский', avatar: leonidImage },
  {
    text: 'Рик сказал что вы лучшие в нашей солнечной системе.',
    name: 'Морти',
    avatar: mortyImage,
  },
  {
    text: 'Качество что даже выдержит падения моего старого металического друга.',
    name: 'Сара Конор',
    avatar: saraImage,
  },
  {
    text: 'Это мои братишки сделали просто супер, респект!',
    name: 'Тарас Легендарович',
    avatar: tarasImage,
  },
];

export default function Portfolio(): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Выбираем отзыв по порядку (с использованием индекса слайда)
  const currentReview = reviews[index % reviews.length];

  // Плавный переход при смене слайда
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  }, [index]);

  const prev = () => setIndex((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setIndex((i) => (i + 1) % projects.length);
  const goTo = (i: number) => setIndex(i);

  // Свайп для мыши и тача
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    if (!carouselRef.current) return;
    carouselRef.current.dataset.dragging = 'true';
    carouselRef.current.dataset.startX = clientX.toString();
    carouselRef.current.dataset.scrollLeft = carouselRef.current.scrollLeft.toString();
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!carouselRef.current?.dataset.dragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startX = Number(carouselRef.current.dataset.startX);
    const walk = (clientX - startX) * 2;
    carouselRef.current.scrollLeft = Number(carouselRef.current.dataset.scrollLeft) - walk;
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!carouselRef.current?.dataset.dragging) return;
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const startX = Number(carouselRef.current.dataset.startX);
    const walked = clientX - startX;

    delete carouselRef.current.dataset.dragging;

    if (walked < -80) next();
    else if (walked > 80) prev();
  };

  return (
    <section id="portfolio" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Наши Проекты</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Портфолио реализованных проектов с использованием современных материалов
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto items-start">
          {/* === КАРУСЕЛЬ БЕЗ СКРОЛЛБАРА === */}
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            >
              {projects.map((project, i) => (
                <div key={i} className="w-full flex-shrink-0 snap-center">
                  <img
                    src={project.image}
                    alt={`Проект ${i + 1}`}
                    className="w-full h-auto object-cover aspect-[4/3] md:aspect-[5/4] select-none pointer-events-none rounded-lg"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Стрелки */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-3 shadow-lg transition-all z-10"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-3 shadow-lg transition-all z-10"
            >
              <ArrowRight className="h-6 w-6" />
            </button>

            {/* Простые белые точки без фона */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'bg-white w-10' : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* === Отзыв === */}
          <div className="bg-background/95 rounded-2xl p-8 shadow-xl border border-border">
            <Quote className="h-12 w-12 text-primary/20 mb-6" />
            <p className="text-lg md:text-xl italic text-foreground/90 leading-relaxed mb-8">
              "{currentReview.text}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed border-gray-400 overflow-hidden">
                <img
                  src={currentReview.avatar}
                  alt={currentReview.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
              <div>
                <p className="font-semibold text-lg">{currentReview.name}</p>
                <p className="text-sm text-muted-foreground">Наш клиент</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}