import { useState, useEffect } from 'react';
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: "Men's Wear", price: "Starting at ₹599", image: img1 },
    { title: "Women's Wear", price: "Starting at ₹799", image: img2 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden bg-black" style={{ marginTop: '40px' }}>
      {/* Images */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-white drop-shadow-lg">
                <h2 className="text-5xl font-bold drop-shadow-2xl">{slide.title}</h2>
                <p className="text-2xl mt-4 drop-shadow-lg">{slide.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 hover:bg-white/75 text-black px-4 py-2 rounded"
      >
        ❮
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 hover:bg-white/75 text-black px-4 py-2 rounded"
      >
        ❯
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;