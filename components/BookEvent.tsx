"use client";
import { createBooking } from "@/lib/actions/booking.action";
import { useState } from "react";
const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, error } = await createBooking({ eventId, slug, email });

    if (success) {
      setSubmitted(true);
    } else {
      console.error("Booking Creation Failed", error);
    }
  };
  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank You For Signing Up!</p>
      ) : (
        <form onSubmit={handleSubmmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email Address"
            />
          </div>
          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
