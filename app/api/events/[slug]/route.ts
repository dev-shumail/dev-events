import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

interface RouteParams {
  slug: string;
}

/**
 * Handles GET requests to /api/events/[slug] to retrieve event details.
 * @param req The NextRequest object.
 * @param context The context object containing dynamic route parameters.
 * @returns A NextResponse object with the event data or an error message.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  try {
    // Establish database connection
    await connectDB();

    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter." },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

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
