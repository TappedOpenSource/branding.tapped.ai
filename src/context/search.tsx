import { BoundingBox, queryVenuesInBoundedBox, queryUsers } from "@/data/search";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";


export const useSearch = () => {
  const useVenueData = (boundingBox: BoundingBox | null) =>
    useQuery({
      queryKey: ["venues", boundingBox],
      queryFn: async () => {
        return await queryVenuesInBoundedBox(boundingBox, {
          hitsPerPage: 150,
        });
      },
    });

  const useSearchData = (query: string, { hitsPerPage }: {
    hitsPerPage: number;
  }) => useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      if (query === "") {
        return [];
      }

      return await queryUsers(query, { hitsPerPage });
    },
  });

  return {
    useVenueData,
    useSearchData,
  };
};

export function SearchProvider({ children }: {
  children: ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}