import { googlePlacesApiKey } from "@/data/places";
import { Card } from "../ui/card";


export default function EmbededMap({ placeId }: {
    placeId: string;
}) {
  const encodedPlaceId = encodeURIComponent(placeId);
  const query = `
   https://www.google.com/maps/embed/v1/place?key=${googlePlacesApiKey}&q=${encodedPlaceId}&zoom=21
    `;

  return (
    <>
      <Card>
        <iframe
          title="map"
          width="300"
          height="160"
          style={{ border: 0 }}
          frameBorder={0}
          referrerPolicy="no-referrer-when-downgrade"
          src={query}>
        </iframe>
      </Card>
    </>
  );
}
