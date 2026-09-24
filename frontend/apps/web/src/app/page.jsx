import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { HomeHero } from "@/features/home/components/HomeHero";
import { CuisineCategories } from "@/features/home/components/CuisineCategories";
import { FeaturedRestaurants } from "@/features/home/components/FeaturedRestaurants";
import { PromotionalBanners } from "@/features/home/components/PromotionalBanners";
import { ServiceHighlights } from "@/features/home/components/ServiceHighlights";
import { HomeFooter } from "@/features/home/components/HomeFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      <main className="flex-1 space-y-12 py-6">
        <Container>
          <HomeHero />
        </Container>

        <Container>
          <CuisineCategories />
        </Container>

        <Container>
          <FeaturedRestaurants />
        </Container>

        <Container>
          <PromotionalBanners />
        </Container>

        <Container>
          <ServiceHighlights />
        </Container>
      </main>

      <HomeFooter />
    </div>
  );
}