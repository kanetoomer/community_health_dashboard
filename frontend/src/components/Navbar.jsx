import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Community Health Dashboard</h1>
      <ul className="flex space-x-6">
        <li className="hover:text-gray-300 cursor-pointer">Upload</li>
        <li className="hover:text-gray-300 cursor-pointer">Data Table</li>
        <li className="hover:text-gray-300 cursor-pointer">Charts</li>
        <li className="hover:text-gray-300 cursor-pointer">Reports</li>
      </ul>
    </nav>
  );
};

export default Navbar;
