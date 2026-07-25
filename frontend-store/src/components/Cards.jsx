import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CardComponent = () => {
  const navigate = useNavigate();

  const cards = [
    { 
      title: 'QUALITY OVER QUANTITY', 
      content: 'Premium products, carefully selected for style and longevity.', 
      cta: 'Shop Now',
      action: () => navigate('/type/mens')
    },
    { 
      title: "KIDS' APPAREL", 
      content: 'Browse our collection of durable, fun, and stylish clothing for children.', 
      cta: 'Explore Collections',
      action: () => navigate('/type/kids')
    },
    { 
      title: 'WOMEN\'S COLLECTION', 
      content: 'Timeless pieces for every occasion, from casual to elegant.', 
      cta: 'View Collection',
      action: () => navigate('/type/womens')
    },
    { 
      title: 'SUMMER ESSENTIALS', 
      content: 'Light fabrics for hot days.', 
      cta: 'View Collection',
      action: () => navigate('/type/mens')
    },
    { 
      title: '100% AUTHENTIC', 
      content: 'Guaranteed quality.', 
      cta: 'Learn More',
      action: () => navigate('/')
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-2xl p-6 
            min-h-[auto] flex flex-col justify-between 
            transition duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
          >
            
            <div>
              <h3 className="text-base font-bold mb-3 uppercase tracking-wide text-gray-900 group-hover:text-blue-600 transition">
                {card.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700">
                {card.content}
              </p>
            </div>

            <button 
              onClick={card.action}
              className="mt-6 text-blue-600 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all group-hover:text-blue-700"
            >
              {card.cta}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CardComponent;