/**
 * 🏛️ ADMIN MAIN COMPONENT
 * Main content area with consistent padding, scroll management, and breadcrumbs
 * Adapts to sidebar state changes with smooth transitions
 */

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTexts } from "../../../../core/hooks";
import { RootState } from "../../../../core/store";
import { PageHeader } from "../ui/PageHeader";
import { AdminMainProps } from "../../types";

/**
 * 🎯 ADMIN MAIN COMPONENT
 * Complete main content area implementation
 */
export const AdminMain: React.FC<AdminMainProps> = ({
  children,
  className = "",
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  loading = false,
  scrollable = true,
  fullHeight = false,
  padding = true,
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { admin } = useTexts();

  // Redux state
  const {
    sidebar,
    responsive,
    // main: mainConfig, // No se utiliza por ahora
  } = useSelector((state: RootState) => state.admin.ui);

  /**
   * 🎯 Handle scroll restoration
   */
  useEffect(() => {
    const element = contentRef.current;
    if (!element || !scrollable) return;

    // Save scroll position before unmount
    const handleBeforeUnload = () => {
      sessionStorage.setItem("admin-main-scroll", element.scrollTop.toString());
    };

    // Restore scroll position on mount
    const savedScroll = sessionStorage.getItem("admin-main-scroll");
    if (savedScroll) {
      element.scrollTop = parseInt(savedScroll, 10);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [scrollable]);

  /**
   * 🎨 Generate main classes
   */
  const getMainClasses = (): string => {
    const classes = ["admin-main"];

    if (loading) classes.push("admin-main--loading");
    if (!scrollable) classes.push("admin-main--no-scroll");
    if (fullHeight) classes.push("admin-main--full-height");
    if (!padding) classes.push("admin-main--no-padding");
    if (sidebar.collapsed) classes.push("admin-main--sidebar-collapsed");
    if (responsive.isMobile) classes.push("admin-main--mobile");
    if (className) classes.push(className);

    return classes.join(" ");
  };

  /**
   * 🎨 Generate container classes
   */
  const getContainerClasses = (): string => {
    const classes = ["admin-main__container"];

    if (fullHeight) classes.push("admin-main__container--full-height");

    return classes.join(" ");
  };

  /**
   * 🎨 Generate content classes
   */
  const getContentClasses = (): string => {
    const classes = ["admin-main__content"];

    if (scrollable) classes.push("admin-main__content--scrollable");
    if (fullHeight) classes.push("admin-main__content--full-height");

    return classes.join(" ");
  };

  /**
   * 🌈 Render loading state
   */
  const renderLoading = (): React.ReactNode => (
    <div className="admin-main__loading">
      <div className="admin-main__loading-content">
        <div className="admin-main__spinner" />
        <span className="admin-main__loading-text">{admin.main.loading}</span>
      </div>
    </div>
  );

  /**
   * 🎨 Render empty state
   */
  const renderEmptyState = (): React.ReactNode => {
    if (children) return children;

    return (
      <div className="admin-main__empty">
        <div className="admin-main__empty-content">
          <div className="admin-main__empty-icon">📄</div>
          <h3 className="admin-main__empty-title">{admin.main.noContent}</h3>
          <p className="admin-main__empty-description">
            {admin.main.noContentDescription}
          </p>
        </div>
      </div>
    );
  };

  return (
    <main
      className={getMainClasses()}
      role="main"
      aria-label="Main content area"
      {...props}
    >
      <div className={getContainerClasses()}>
        {/* Page Header */}
        <PageHeader
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          actions={actions}
          showBreadcrumbs={breadcrumbs.length > 0}
        />

        {/* Content Area */}
        <div
          ref={contentRef}
          className={getContentClasses()}
          tabIndex={scrollable ? 0 : undefined}
          role={scrollable ? "region" : undefined}
          aria-label={scrollable ? "Scrollable content area" : undefined}
        >
          {loading ? renderLoading() : renderEmptyState()}
        </div>

        {/* Scroll to top button */}
        {scrollable && <ScrollToTopButton containerRef={contentRef} scrollToTopText={admin.main.scrollToTop} />}
      </div>
    </main>
  );
};

/**
 * 🔝 SCROLL TO TOP BUTTON COMPONENT
 * Shows when user scrolls down, allows quick return to top
 */
interface ScrollToTopButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollToTopText: string;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  containerRef,
  scrollToTopText,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsVisible(container.scrollTop > 300);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef]);

  const scrollToTop = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      className="admin-main__scroll-top"
      onClick={scrollToTop}
      aria-label={scrollToTopText}
      title={scrollToTopText}
    >
      ↑
    </button>
  );
};

export default AdminMain;
