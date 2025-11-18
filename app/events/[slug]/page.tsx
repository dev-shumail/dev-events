import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItems = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const bookings = 10;

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div key={tag} className="pill">
        {tag}
      </div>
    ))}
  </div>
);

let event;

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch Event: ${request.statusText}`);
    }
    const response = await request.json();
    event = response.event;
  } catch (error) {
    console.error("Error Fetching Event:", error);
    return notFound();
  }

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  if (!description) return notFound();

  return (
    <div id="event">
      <div className="header">
        <h1>Event Desciption</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Booking"
            height={800}
            width={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItems
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItems
              icon="/icons/clock.svg"
              alt="clock"
              label={time}
            />
            <EventDetailItems
              icon="/icons/pin.svg"
              alt="pin"
              label={location}
            />
            <EventDetailItems icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItems
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={JSON.parse(agenda[0])} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={JSON.parse(tags[0])} />
        </div>
        {/* Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetailsPage;
