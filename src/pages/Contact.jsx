import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_fpaz6gp", // Replace with your EmailJS service ID
        "template_kp1t1eg", // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "KeW42aOgmbF8viCoc" // Replace with your EmailJS public key
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          alert("Thank you! Your message has been sent.");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("Email sending failed:", error);
          alert("Failed to send message. Please try again.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mt-[34px] items-center py-10 px-4 sm:px-8 lg:px-16">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-red-500 mb-6">
          Contact & Suggestions
        </h1>
        <p className="text-gray-700 text-center text-lg mb-4">
          We value your input! At <span className="font-semibold">McGulma's Pharmaceutical Dictionary</span>, 
          we strive to provide a comprehensive and up-to-date reference for pharmaceutical terms.
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Suggestion</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter your suggestion or feedback"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit Suggestion"}
          </button>
        </form>

        <p className="text-gray-700 text-center text-lg mt-6">
          Thank you for being a part of <span className="font-semibold">McGulma's Pharmaceutical Dictionary</span>!
        </p>
      </div>
    </div>
  );
};

export default Contact;
