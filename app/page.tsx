// app/page.tsx
import { Suspense } from "react"; // 👈 Import Suspense
import ExploreBtn from "@/components/ExploreBtn";
import FeaturedEvents from "@/components/Events"; // 👈 New component

// Remove the data fetching and event rendering logic from here
const Home = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can't Miss!
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups and Conferences, All in one place
      </p>

      <ExploreBtn />

      {/* 👈 Wrap the data-fetching component in Suspense */}
      <Suspense fallback={<div>Loading featured events...</div>}>
        <FeaturedEvents />
      </Suspense>
    </section>
  );
};

export default Home;
