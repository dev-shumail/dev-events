import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

interface RouteParams {
  slug: string;
}

/**
 * Handles GET requests to /api/events/[slug] to retrieve event details.
 * @param req The NextRequest object.
 * @param context The context object containing dynamic route parameters.
 * @returns A NextResponse object with the event data or an error message.
 */
interface RouteContext {
  params: Promise<RouteParams>;
}

export async function GET(
  req: NextRequest,
  // Use the defined interface for the second argument
  context: RouteContext
): Promise<NextResponse> {
  try {
    // 3. Destructure and await the params object, which is needed by your environment
    const { slug } = await context.params;

    // Establish database connection
    await connectDB();

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter." },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    // Assuming 'Event' is your Mongoose model
    const event = await Event.findOne({
      slug: sanitizedSlug,
    }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug ${sanitizedSlug} not found!` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching event by slug: ", error);
    }

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
