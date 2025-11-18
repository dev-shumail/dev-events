"use server";

import connectDB from "../mongodb";
import Event from "@/database/event.model";

export const getSimilarEventsBySlug = async (slug: string) => {
  await connectDB();
  try {
    const event = await Event.findOne({ slug });
    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch {
    return [];
  }
};
