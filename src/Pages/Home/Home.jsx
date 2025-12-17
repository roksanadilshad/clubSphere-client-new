import UpcomingEventsTimeline from "../events/Upcoming";
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
    <div className="min-h-screen bg-primary">
      <HeroBanner />
      {/* <SearchBar /> */}
      <FeaturedClubs />
      <UpcomingEventsTimeline></UpcomingEventsTimeline>
       <TestimonialsSection/>
      <PopularCategories />
      <HowItWorks />
     
      <CTASection />
    </div>
  );
};

export default Home;
