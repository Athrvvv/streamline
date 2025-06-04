import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

export default function Navbar({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "features", isScroll: true },
    { name: "About", path: "/about" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white border-b shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <RouterLink to="/" className="text-xl font-bold text-blue-600">
          UnlistedShares
        </RouterLink>

        {/* Desktop Nav */}
        <div className="space-x-6 hidden md:flex">
          {navItems.map((item, index) => (
            item.isScroll ? (
              <ScrollLink
                key={index}
                to={item.path}
                smooth={true}
                duration={600}
                offset={-64}
                className="cursor-pointer text-gray-700 hover:text-blue-600"
              >
                {item.name}
              </ScrollLink>
            ) : (
              <RouterLink
                key={index}
                to={item.path}
                className="text-gray-700 hover:text-blue-600"
              >
                {item.name}
              </RouterLink>
            )
          ))}
          <button
            onClick={onLoginClick}
            className="text-gray-700 hover:text-blue-600"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden relative">
          <button
            className="text-2xl text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoClose /> : <BsThreeDotsVertical />}
          </button>

          {/* Mobile Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-44 bg-white border rounded shadow-md transition-all duration-200 ease-in-out origin-top-right z-50 ${
              isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {navItems.map((item, index) => (
              item.isScroll ? (
                <ScrollLink
                  key={index}
                  to={item.path}
                  smooth={true}
                  duration={600}
                  offset={-64}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {item.name}
                </ScrollLink>
              ) : (
                <RouterLink
                  key={index}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {item.name}
                </RouterLink>
              )
            ))}
            <button
              onClick={() => {
                onLoginClick();
                setIsOpen(false);
              }}
              className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100 w-full"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}