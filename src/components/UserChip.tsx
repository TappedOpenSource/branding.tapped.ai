import { UserModel, profileImage } from "@/domain/types/user_model";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

export default function UserChip({ performer }: { performer: UserModel }) {
  const router = useRouter();
  const pathname = usePathname();
  const imageSrc = profileImage(performer);

  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => {
          const newSearchParams = `username=${performer.username}`;
          const newPathname = pathname.includes("?") ? `${pathname}&${newSearchParams}` : `${pathname}?${newSearchParams}`;
          router.push(newPathname);
        }}
      >
        <div className="flex flex-row justify-start items-center">
          <div
            className="relative bg-card rounded-xl w-6 h-6"
          >
            <Image
              src={imageSrc}
              alt="performer profile picture"
              className="rounded-xl"
              style={{ objectFit: "cover", overflow: "hidden" }}
              fill
            />
          </div>
          <p
            className="p-1 md:p-2"
          >{performer.artistName ?? performer.username}</p>
        </div>
      </Button>
    </>
  );
}
