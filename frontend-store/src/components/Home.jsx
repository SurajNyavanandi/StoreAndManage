import HeroCarousel from "./HeroCarsouel";
import CardComponent from "./Cards";
import Popular from "./Popular";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "./Footer";

function Home() {
  return (
    <div>
      <HeroCarousel />

      <div className="container pt-24">
        <CardComponent />
        <Popular title="Popular Kids Products" category="kids" />
        <Popular title="Popular Men Products" category="mens" />
        <Popular title="Popular Women Products" category="womens" />
      </div>
      
      <WhyChooseUs />
      <Footer />
    </div>
  );
}

export default Home;