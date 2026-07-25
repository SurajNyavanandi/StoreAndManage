import { FiTruck, FiShield, FiRefreshCw, FiCreditCard, FiHeadphones, FiAward } from 'react-icons/fi';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FiTruck className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Free Shipping",
      description: "On orders above ₹500",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FiShield className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Secure Payment",
      description: "100% secure transactions",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FiRefreshCw className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Easy Returns",
      description: "7 days return policy",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FiCreditCard className="w-8 h-8 md:w-10 md:h-10" />,
      title: "COD Available",
      description: "Pay on delivery",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <FiHeadphones className="w-8 h-8 md:w-10 md:h-10" />,
      title: "24/7 Support",
      description: "Dedicated customer care",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FiAward className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Quality Assurance",
      description: "Premium products only",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">viRAttoM</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            We provide the best shopping experience with premium quality products and exceptional service
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Icon Container */}
              <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">10K+</div>
              <div className="text-sm md:text-base opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
              <div className="text-sm md:text-base opacity-90">Products</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">50+</div>
              <div className="text-sm md:text-base opacity-90">Brands</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">4.8★</div>
              <div className="text-sm md:text-base opacity-90">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;