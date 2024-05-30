"use client";

import UserBottomSheet from "@/components/BottomSheet";
import FeaturedPerformers from "@/components/FeaturedPerformers";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import UserSideSheet from "@/components/UserSideSheet";
import BuyPremium from "@/components/landing/BuyPremium";
import MapHeader from "@/components/map_header";
import { Button } from "@/components/ui/button";
import useWindowDimensions from "@/utils/window_dimensions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Globe2 } from "lucide-react";
import Link from "next/link";

const queryClient = new QueryClient();
export default function Page() {
  const { width } = useWindowDimensions();
  const screenIsSmall = width < 640;

  return (
    <>
      {screenIsSmall ? <UserBottomSheet /> : <UserSideSheet />}
      <div className="fixed top-0 z-10">
        <MapHeader showSearch={false} />
      </div>
      <QueryClientProvider client={queryClient}>
        <div className="px-4 pb-12 min-h-screen flex flex-col justify-start items-center">
          <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mt-40 md:mt-64 lg:mt-64 xl:mt-[175px]">
            <h1 className="font-black text-5xl mb-4">
              search performers
            </h1>
            <SearchBar />
            <Link
              href="/map"
            >
              <Button variant={"link"}>
              view the map <span className="ml-2"><Globe2 className="h-4 w-4" /></span>
              </Button>
            </Link>
          </div>
          <FeaturedPerformers />
          {/* <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
            <BuyPremium />
          </div> */}
        </div>
        <Footer />
      </QueryClientProvider>
    </>
  );
}
