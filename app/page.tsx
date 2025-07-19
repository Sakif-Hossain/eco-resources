import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Sustainable Resources Near You
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover eco-friendly businesses, recycling centers, sustainable
            markets, and green initiatives in your community.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <span className="mr-2">🗺️</span>
            Explore the Map
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">♻️</div>
            <h3 className="text-xl text-green-600 font-semibold mb-2">
              Recycling Centers
            </h3>
            <p className="text-gray-600">
              Find nearby recycling facilities for all types of materials
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">🌱</div>
            <h3 className="text-xl text-green-600 font-semibold mb-2">
              Sustainable Markets
            </h3>
            <p className="text-gray-600">
              Discover local farmers markets and eco-friendly stores
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl text-green-600 font-semibold mb-2">
              Green Energy
            </h3>
            <p className="text-gray-600">
              Locate renewable energy installations and charging stations
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ready to Go Green?
          </h2>
          <div className="flex justify-center space-x-4">
            <Link
              href="/map"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Exploring
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
