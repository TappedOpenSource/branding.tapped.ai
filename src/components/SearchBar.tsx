"use client";

import { isVerified } from "@/data/database";
import { type UserModel, userAudienceSize, profileImage } from "@/domain/types/user_model";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounce } from "@/context/debounce";
import { useSearch } from "@/context/search";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { BadgeCheck, Search } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { track } from "@vercel/analytics/react";
import { LoadingSpinner } from "./LoadingSpinner";

function getSubtitle(hit: UserModel): string {
  const capacity = hit.venueInfo?.capacity ?? null;
  const totalFollowing = userAudienceSize(hit);
  const category = hit.performerInfo?.category ?? null;

  if (capacity === null && category === null) {
    return totalFollowing === 0 ?
      `@${hit.username}` :
      `${totalFollowing.toLocaleString()} followers`;
  }

  if (capacity === null && category !== null) {
    return `${category} performer`;
  }

  if (capacity === null) {
    return `@${hit.username}`;
  }

  return `${capacity.toLocaleString()} capacity venue`;
}

function Hit({ hit, onClick }: { hit: UserModel; onClick: () => void }) {
  const imageSrc = profileImage(hit);
  const subtitle = getSubtitle(hit);

  const [verified, setVerified] = useState(false);
  useEffect(() => {
    const getIfVerified = async () => {
      const res = await isVerified(hit.id);
      setVerified(res);
    };

    getIfVerified();
  }, [hit.id]);

  return (
    <button onClick={onClick}>
      <div className="py-px">
        <div className="bg-card my-1 flex w-full flex-row items-center justify-start rounded-xl px-4 py-3 transition-all duration-150 ease-in-out hover:scale-105">
          <div className="pl-1 pr-2">
            <div className="relative h-[42px] w-[42px]">
              <Image
                src={imageSrc}
                alt="user profile picture"
                fill
                className="rounded-full"
                style={{ objectFit: "cover", overflow: "hidden" }}
              />
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col items-start justify-center overflow-hidden">
            <h1 className="line-clamp-1 overflow-hidden text-ellipsis text-start text-xl font-bold">
              {(hit.artistName ?? hit.username)?.trim()}
              {verified && (
                <span className="inline">
                  <TooltipProvider disableHoverableContent>
                    <Tooltip>
                      <TooltipTrigger>
                        <BadgeCheck className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start" alignOffset={2}>
                          verified
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>

              )}
            </h1>
            <p className="line-clamp-1 overflow-hidden text-ellipsis text-start text-sm text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function GenreList({ genres, selectedGenres, setSelectedGenres }: {
    genres: string[];
    selectedGenres: string[];
    setSelectedGenres: (genres: string[]) => void;
  }) {
  const selectedGenresInFrom = genres.slice(0).sort((a, b) => {
    const aSelected = selectedGenres.includes(a);
    const bSelected = selectedGenres.includes(b);

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;

    return 0;
  });

  return (
    <div className="flex flex-row items-center justify-start ease-in-out peer-has-[:focus-within]:flex overflow-x-scroll no-scrollbar">
      {selectedGenresInFrom.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenres.includes(genre) ? "default" : "outline"}
          onClick={() => {
            if (selectedGenres.includes(genre)) {
              setSelectedGenres(selectedGenres.filter((g) => g !== genre));
            } else {
              setSelectedGenres([...selectedGenres, genre]);
            }
          }}
          className="m-1"
        >
          {genre.toLowerCase()}
        </Button>
      ))}
    </div>
  );
}

const phrases = [
  // eslint-disable-next-line sonarjs/no-duplicate-string
  "search tapped...",
  "'Bad Bunny'",
  "'Madison Square Garden'",
  "search tapped...",
  "'Drake'",
  "'Elsewhere Brooklyn'",
  "'Noah Kahan'",
  "search tapped...",
  "'9:30 Club'",
  "'Chandler'",
];

const queryClient = new QueryClient();
export default function SearchBar(props: {
  animatedPlaceholder?: boolean;
  onSelect?: (user: UserModel) => void;
}) {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
        <QueryClientProvider client={queryClient}>
          <_SearchBar {...props} />
        </QueryClientProvider>
      </Suspense>
    </>
  );
}

function _SearchBar({ animatedPlaceholder = false, onSelect }: {
  animatedPlaceholder?: boolean;
  onSelect?: (user: UserModel) => void;
}) {
  const { useSearchData } = useSearch();
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce<string>(query, 250);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (debouncedQuery === "") return;
    track("search", { query: debouncedQuery });
  }, [debouncedQuery]);

  const { data } = useSearchData(debouncedQuery, { hitsPerPage: 5 });
  useHotkeys("/", (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });

  const searchParams = useSearchParams();
  const rawSelectedGenres = searchParams.get("genres") ?? "";
  const selectedGenres = (rawSelectedGenres === "") ? [] : rawSelectedGenres.split(",");
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const setSelectedGenres = (genres: string[]) => {
    const newParams = createQueryString("genres", genres.join(","));
    router.push(`${pathname}?${newParams}`);
  };

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (!animatedPlaceholder) return;

    const text = phrases[currentPhraseIndex];
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }

    setTimeout(() => {
      setCurrentPhraseIndex((prevIndex) => {
        if (prevIndex === phrases.length - 1) return 0;
        return prevIndex + 1;
      });
      setCurrentText("");
      setCurrentIndex(0);
    }, 1500);
  }, [currentIndex, currentPhraseIndex]);

  const userTiles = useMemo(
    () =>
      (data ?? []).map((user) => {
        return (
          <Hit
            key={user.id}
            hit={user}
            onClick={() => {
              if (onSelect) {
                setQuery("");
                onSelect(user);
                return;
              }

              router.push(`${pathname}?${createQueryString("username", user.username)}`);
            }}
          />
        );
      }),
    [data, router, pathname, createQueryString, onSelect]
  );
  return (
    <>
      <div className="bg-card z-50 rounded-xl border border-input ring-offset-background">
        <div className="relative">
          <div className="pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3">
            <Search className="pointer-events-none h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={animatedPlaceholder ? currentText : "search tapped..."}
            className="bg-card w-full rounded-xl p-2.5 px-6 py-4 ps-10 shadow-xl"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="relative z-50">
          <div className="absolute z-50 w-full flex flex-col">{userTiles}</div>
        </div>
      </div>
      {/* <div className="overflow-x-auto">
              <GenreList
                genres={genres}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
              />
            </div> */}
    </>
  );
}
