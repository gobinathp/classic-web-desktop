import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

/** Keep inline overlays inside the viewport and every clipping ancestor. No portal or runtime dependency. */
export function useFloating(open: boolean, anchor: RefObject<HTMLElement | null>, panel: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = anchor.current, element = panel.current;
    if (!open || !root || !element) return;
    const position = () => {
      const bounds = { left: 0, top: 0, right: document.documentElement.clientWidth, bottom: document.documentElement.clientHeight };
      for (let parent = root.parentElement; parent; parent = parent.parentElement) {
        const css = getComputedStyle(parent), rect = parent.getBoundingClientRect();
        if (/(auto|scroll|hidden|clip)/.test(css.overflowX)) { bounds.left = Math.max(bounds.left, rect.left + parent.clientLeft); bounds.right = Math.min(bounds.right, rect.left + parent.clientLeft + parent.clientWidth); }
        if (/(auto|scroll|hidden|clip)/.test(css.overflowY)) { bounds.top = Math.max(bounds.top, rect.top + parent.clientTop); bounds.bottom = Math.min(bounds.bottom, rect.top + parent.clientTop + parent.clientHeight); }
      }
      const rect = root.getBoundingClientRect(), gap = 4;
      element.style.minWidth = '0';
      element.style.width = 'max-content';
      element.style.maxWidth = `min(var(--cwd-floating-max-width, 280px), ${Math.max(1, bounds.right - bounds.left - gap * 2)}px)`;
      const size = element.getBoundingClientRect();
      const below = Math.max(0, bounds.bottom - rect.bottom - gap), above = Math.max(0, rect.top - bounds.top - gap);
      const naturalHeight = element.scrollHeight + element.offsetHeight - element.clientHeight;
      const down = below >= naturalHeight || below >= above;
      const height = Math.min(naturalHeight, down ? below : above);
      const x = Math.max(bounds.left + gap, Math.min(rect.left, bounds.right - size.width - gap));
      element.style.left = `${x - rect.left}px`;
      element.style.right = 'auto'; element.style.bottom = 'auto';
      element.style.top = `${down ? rect.height + gap : -height - gap}px`;
      element.style.maxHeight = `${height}px`;
      element.style.overflow = 'auto';
    };
    position();
    window.addEventListener('resize', position);
    document.addEventListener('scroll', position, true);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(position);
    observer?.observe(root);
    // Moving/resizing a desktop window changes the available clipping rectangle.
    const windowElement = root.closest('.cwd-window');
    const mutation = windowElement ? new MutationObserver(position) : null;
    if (windowElement) mutation?.observe(windowElement, { attributes: true, attributeFilter: ['style'] });
    return () => { window.removeEventListener('resize', position); document.removeEventListener('scroll', position, true); observer?.disconnect(); mutation?.disconnect(); };
  }, [open, anchor, panel]);
}
