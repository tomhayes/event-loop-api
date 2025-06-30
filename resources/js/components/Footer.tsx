import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Find Events', href: '/events' },
        { name: 'Submit Event', href: '/submit' },
        { name: 'API Documentation', href: '/api' },
        { name: 'Mobile App', href: '/mobile' }
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Discord', href: 'https://discord.gg/eventloop', external: true },
        { name: 'GitHub', href: 'https://github.com/eventloop', external: true },
        { name: 'Twitter', href: 'https://twitter.com/eventloop', external: true },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Event Guidelines', href: '/guidelines' },
        { name: 'Community Rules', href: '/community-rules' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Careers', href: '/careers' }
      ]
    }
  ];

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          {footerSections.map((section) => (
            <div key={section.title} className="footer-section">
              <h4>{section.title}</h4>
              <ul className="footer-links">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <button
                        onClick={() => navigate(link.href)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: '14px',
                          transition: 'color 0.2s ease',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          padding: 0,
                          textAlign: 'left'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = 'var(--accent-primary)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 eventLoop. Built for developers, by developers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;