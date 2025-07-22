"use client";

import Link from "next/link";

const Feedback = () => {
  return (
    <Link
      href="/feedback"
      className="fixed bottom-6 right-14 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition"
    >
      💬 Feedback
    </Link>
  );
};

export default Feedback;
