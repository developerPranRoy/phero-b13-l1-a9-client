import Banner from "@/components/home/Banner";
import FeaturedTutors from "@/components/home/FeaturedTutors";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedTutors />
      <HowItWorks />
      <WhyChooseUs />
    </>
  );
}
