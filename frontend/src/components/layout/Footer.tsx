import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Learning',
      links: [
        { name: 'Math Games', path: '/games?subject=math' },
        { name: 'Science Fun', path: '/games?subject=science' },
        { name: 'Language Arts', path: '/games?subject=language' },
        { name: 'Creative Play', path: '/games?subject=creativity' },
      ],
    },
    {
      title: 'Parents',
      links: [
        { name: 'Parent Dashboard', path: '/dashboard' },
        { name: 'Progress Reports', path: '/progress' },
        { name: 'Safety & Privacy', path: '/safety' },
        { name: 'Help Center', path: '/help' },
      ],
    },
    {
      title: 'Teachers',
      links: [
        { name: 'Teacher Portal', path: '/teacher' },
        { name: 'Classroom Tools', path: '/classroom' },
        { name: 'Curriculum', path: '/curriculum' },
        { name: 'Resources', path: '/resources' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Careers', path: '/careers' },
        { name: 'Blog', path: '/blog' },
      ],
    },
  ];

  return (
    <footer className="bg-primary-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🎓</span>
              <span className="text-2xl font-bold font-kid-header">EduPlay</span>
            </div>
            <p className="text-blue-100 font-kid-body mb-4">
              Transforming education into engaging adventures for children aged 6-12.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <span className="text-2xl">📘</span>
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <span className="text-2xl">🐦</span>
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <span className="text-2xl">📷</span>
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <span className="text-2xl">📺</span>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold font-kid-header mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-blue-100 hover:text-white transition-colors font-kid-body"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Awards and Certifications */}
        <div className="mt-12 pt-8 border-t border-blue-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="text-center">
                <span className="text-2xl">🏆</span>
                <p className="text-xs text-blue-100 mt-1">Award Winner</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🛡️</span>
                <p className="text-xs text-blue-100 mt-1">COPPA Safe</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🔒</span>
                <p className="text-xs text-blue-100 mt-1">Secure</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">👨‍🏫</span>
                <p className="text-xs text-blue-100 mt-1">Teacher Approved</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-blue-100">
                Made with ❤️ for young learners everywhere
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-blue-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-100">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} EduPlay. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors font-kid-body"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-white transition-colors font-kid-body"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-white transition-colors font-kid-body"
              >
                Cookie Policy
              </Link>
              <Link
                to="/accessibility"
                className="hover:text-white transition-colors font-kid-body"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;