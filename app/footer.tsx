const Footer = () => {
  return (
    <div className="flex flex-col max-w-4xl mx-auto">
      <footer className="pb-4 w-full mt-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2 md:mb-0">
            © 2025 <a href="https://www.javanmiller.com" className="text-blue-600 dark:text-blue-400">Javan Miller</a>
          </p>
          <div className="text-gray-600 dark:text-gray-400">
            <a href="https://www.javanmiller.com/blog/ScriptureScope" className="text-blue-600 dark:text-blue-400">Learn More</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;