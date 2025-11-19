"use client";
import FormInput from "@/components/FormInput";
import React, { useState } from "react";
const CreateEvent = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "",
    agenda: [],
    audience: "",
    organizer: "",
    tags: [],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags" || key === "agenda") {
          formPayload.append(key, JSON.stringify(value)); // Arrays -> JSON string
        } else if (key === "image" && value) {
          formPayload.append("image", value); // File
        } else {
          formPayload.append(key, value);
        }
      });

      const response = await fetch(`${BASE_URL}/api/events`, {
        method: "POST",
        body: formPayload,
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("Event Created Successfully!");

        // 🔥 RESET FORM HERE
        setFormData({
          title: "",
          description: "",
          overview: "",
          venue: "",
          location: "",
          date: "",
          time: "",
          mode: "",
          audience: "",
          organizer: "",
          tags: [],
          agenda: [],
          image: null,
        });

        setImagePreview(null);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }

      // Update form data with the file
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1>Create Event</h1>
      <h2 className="mt-2">
        Dev-Events helps you to create events instantly! Create Event anytime
        anywhere!
      </h2>

      <div className="relative z-10 w-full">
        <div className="backdrop-blur-xl bg-white/10 rounded-lg shadow-2xl border border-white/20 py-8 mt-4 px-4">
          {/* Header */}

          {/* Form */}
          <form
            className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4"
            onSubmit={handleSubmit}
          >
            <FormInput
              label="Event Title"
              id="title"
              name="title"
              type="text"
              placeholder="NEX-JS 16 Event"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Event Description"
              id="description"
              name="description"
              type="text"
              placeholder="It's an event for the new features about next js."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Event Overview"
              id="overview"
              name="overview"
              type="text"
              placeholder="Next js is widely used in the modern era."
              value={formData.overview}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Event Venue"
              id="venue"
              name="venue"
              type="text"
              placeholder="Moscon Center"
              value={formData.venue}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Event Location"
              id="location"
              name="location"
              type="text"
              placeholder="San Francisco"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Event Date"
              id="date"
              name="date"
              type="date"
              placeholder="25-10-25"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Event Time"
              id="time"
              name="time"
              type="time"
              placeholder="25-10-25"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Event Audience"
              id="audience"
              name="audience"
              type="text    "
              placeholder="DevOps, Frontend, Backend"
              value={formData.audience}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Event Organizer"
              id="organizer"
              name="organizer"
              type="text"
              placeholder="Vercel"
              value={formData.organizer}
              onChange={handleChange}
              required
            />

            <textarea
              id="agenda"
              rows={1}
              cols={1}
              className="block w-full appearance-none px-3 py-3 pr-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200 cursor-pointer"
              name="agenda"
              value={formData.agenda.join("\n")}
              placeholder="Mention TimeLine and use comma separted"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  agenda: e.target.value.split("\n"),
                }))
              }
              required
            />

            <FormInput
              label="Tags"
              id="tags"
              name="tags"
              type="text"
              value={formData.tags.join(", ")}
              placeholder="Add tags using comma separated"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tags: e.target.value.split(",").map((t) => t.trim()),
                }))
              }
              required
            />

            <div className="group relative">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Event Type
              </label>
              <div className="relative">
                {/* Custom arrow icon */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="block w-full appearance-none px-3 py-3 pr-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200 cursor-pointer"
                >
                  <option value="" disabled className="bg-gray-800 text-white">
                    Select event type
                  </option>
                  <option value="online" className="bg-gray-800 text-white">
                    Online
                  </option>
                  <option value="offline" className="bg-gray-800 text-white">
                    Offline
                  </option>
                  <option value="hybrid" className="bg-gray-800 text-white">
                    Hybrid
                  </option>
                </select>
              </div>
            </div>
            <div className="group relative lg:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Event Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="block w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-white/70 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="max-w-xs h-48 object-cover rounded-lg border-2 border-white/20"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-center">
              <button
                type="submit"
                className="bg-cyan-400 hover:bg-cyan-500 px-4 py-3 rounded cursor-pointer "
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
