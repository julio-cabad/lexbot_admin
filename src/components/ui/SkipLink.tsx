import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente SkipLink para mejorar la navegación por teclado
 * Permite a los usuarios saltar directamente al contenido principal
 */
export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      className={`skip-link sr-only-focusable ${className}`}
      onClick={(e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          (target as HTMLElement).focus();
          (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      {children}
    </a>
  );
};

/**
 * Componente que agrupa múltiples skip links
 */
interface SkipLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export const SkipLinks: React.FC<SkipLinksProps> = ({ 
  links, 
  className = '' 
}) => {
  return (
    <nav 
      className={`skip-links ${className}`}
      aria-label="Enlaces de navegación rápida"
    >
      {links.map((link, index) => (
        <SkipLink key={index} href={link.href}>
          {link.label}
        </SkipLink>
      ))}
    </nav>
  );
};