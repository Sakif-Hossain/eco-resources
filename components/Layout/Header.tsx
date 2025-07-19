import React from "react";
import { Leaf } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">
              Sustainable Resources
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Map
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Resources
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
