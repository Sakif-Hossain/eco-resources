"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface FeedbackForm {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  rating: number;
}

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackForm>({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const feedbackCategories = [
    {
      value: "bug",
      label: "🐛 Bug Report",
      description: "Report technical issues or errors",
    },
    {
      value: "feature",
      label: "💡 Feature Request",
      description: "Suggest new features or improvements",
    },
    {
      value: "resource",
      label: "📍 Resource Feedback",
      description: "Report incorrect or missing resource information",
    },
    {
      value: "usability",
      label: "🎯 Usability",
      description: "Share thoughts on user experience and design",
    },
    {
      value: "general",
      label: "💬 General Feedback",
      description: "Any other comments or suggestions",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const googleFeedbackURL =
        process.env.NEXT_PUBLIC_GOOGLE_SHEETS_FEEDBACK_URL;
      if (!googleFeedbackURL) {
        throw new Error(
          "Google Sheets Feedback URL is not defined in environment variables."
        );
      }

      const response = await fetch(googleFeedbackURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: [formData] }),
      });

      if (!response.ok) {
        const errorRes = await response.json();
        console.error("SheetDB error response:", errorRes);
        throw new Error("SheetDB responded with error");
      }

      console.log("Feedback submitted:", formData);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
        rating: 0,
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.category && formData.message.trim() && formData.email.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            We&apos;d Love Your Feedback
          </h1>
          <p className="text-lg text-gray-600">
            Help us improve by sharing your thoughts, reporting issues, or
            suggesting new features
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <div className="flex items-center space-x-3">
              <div className="text-green-500">✅</div>
              <div>
                <h3 className="font-medium text-green-800">
                  Thank you for your feedback!
                </h3>
                <p className="text-sm text-green-600 mt-1">
                  We&apos;ve received your message and will review it soon.
                </p>
              </div>
            </div>
          </Card>
        )}

        {submitStatus === "error" && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="flex items-center space-x-3">
              <div className="text-red-500">❌</div>
              <div>
                <h3 className="font-medium text-red-800">
                  Something went wrong
                </h3>
                <p className="text-sm text-red-600 mt-1">
                  Please try again later or contact us directly.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Feedback Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Feedback Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Feedback Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {feedbackCategories.map((cat) => (
                  <label
                    key={cat.value}
                    className={`cursor-pointer p-3 border rounded-lg transition-colors ${
                      formData.category === cat.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {cat.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      {cat.description}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject (Optional)
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Brief summary of your feedback"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Experience (Optional)
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`text-2xl transition-colors ${
                      star <= formData.rating
                        ? "text-yellow-400 hover:text-yellow-500"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  >
                    ⭐
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600 self-center">
                    {formData.rating}/5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                placeholder="Please share your feedback, suggestions, or describe any issues you've encountered..."
              />
              <div className="mt-1 text-xs text-gray-500">
                {formData.message.length}/1000 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  isFormValid && !isSubmitting
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Sending Feedback...</span>
                  </div>
                ) : (
                  "Send Feedback"
                )}
              </button>
            </div>
          </form>
        </Card>

        {/* Additional Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="font-medium text-blue-900 mb-2">
              Other Ways to Reach Us
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>📧 Email at: ssafwanhossain@wawanesa.com</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
