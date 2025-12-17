import CTASection from "./CTASection";
import FeaturedClubs from "./FeaturedClubs";
import HeroBanner from "./HeroBanner";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import SearchBar from "./SearchBar";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";


const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      {/* <SearchBar /> */}
      <FeaturedClubs />
      <StatsSection/>
      <PopularCategories />
      <HowItWorks />
      <TestimonialsSection/>
      <CTASection />
    </div>
  );
};

export default Home;
