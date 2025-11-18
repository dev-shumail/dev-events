// components/FeaturedEvents.tsx
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Events = async () => {
  // Data fetching logic moved here
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      <ul className="events">
        {events &&
          events.length > 0 &&
          events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Events;