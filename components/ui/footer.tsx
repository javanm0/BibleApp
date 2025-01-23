import React, { useState, MouseEvent } from "react";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto">
      <footer className="pb-4 w-full mt-12">
        <div className="w-full px-4 flex flex-col items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
             <a href="#" onClick={handleLinkClick} className="text-blue-600 dark:text-blue-400">© 2025 Javan Miller</a>
          </p>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Copyright Information</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All rights reserved. Unauthorized use and/or duplication of this material without express and written permission from this site’s author and/or owner is strictly prohibited.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible.
            </p>
            <a
              href="https://www.javanmiller.com/blog/ScriptureScope"
              className="text-blue-600 dark:text-blue-400 mb-4 block"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
