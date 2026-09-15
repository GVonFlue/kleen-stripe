"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/**
 * The game is a canvas, five layout specs and a scoring pass. None of it is worth
 * anything until somebody scrolls to it, and all of it was previously in the
 * homepage's initial JavaScript, competing with the hero image for the exact
 * milliseconds LCP is measured in. Most of this site's traffic is a manager on a
 * phone in a parking lot, which is the worst case for that trade.
 *
 * So it mounts on approach. An IntersectionObserver with a full viewport of
 * rootMargin starts the dynamic import while the section is still a screen away,
 * which in practice means it is ready before it is reached, and a visitor who
 * never scrolls that far never downloads it at all.
 *
 * The placeholder holds the same height the canvas will, so arriving does not
 * shift the page underneath somebody mid-scroll. No IntersectionObserver, which
 * is rare, means it mounts immediately and behaves exactly as it did before.
 */
const StripeGame = dynamic(() => import("@/components/motion/StripeGame"), { ssr: false });

type Props = React.ComponentProps<typeof StripeGame>;

export default function StripeGameLazy(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver !== "function") {
      setShow(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {show ? <StripeGame {...props} /> : <div aria-hidden="true" className="h-[420px] sm:h-[500px]" />}
    </div>
  );
}
