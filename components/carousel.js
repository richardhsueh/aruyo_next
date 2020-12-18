import React, { useState, useEffect } from "react";
import { animated, useTransition, useSpring } from "react-spring";
import { easeCubicOut } from "d3-ease";
import styles from "./carousel.module.css";

export const CarouselContext = React.createContext({});

export const CarouselContent = ({
  children,
  activeIndex,
  prevIndex,
  direction,
}) => {
  const transitions = useTransition(
    activeIndex < 0 ? activeIndex * -1 : activeIndex,
    (p) => p,
    {
      initial: {
        opacity: 1,
      },
      from: {
        opacity: 0,
      },
      enter: {
        opacity: 1,
      },
      leave: {
        opacity: 0,
        pointerEvents: "none",
      },
      config: { duration: 250, easing: easeCubicOut },
    }
  );
  return (
    <div style={{ position: "relative" }}>
      {transitions.map(({ item, props, key }) => (
        <animated.div
          key={key}
          style={{ ...props, position: "absolute", width: "100%" }}
        >
          {children[item]}
        </animated.div>
      ))}
    </div>
  );
};

const HeightTransition = ({ children }) => {
  const props = useSpring({ from: { height: "auto" }, to: { height: "auto" } });
  return (
    <animated.div style={{ ...props, width: "100%" }}>{children}</animated.div>
  );
};

const FadeInOutCarousel = ({
  children,
  prevCtrl,
  nextCtrl,
  autoScroll,
  breadcrumbComponent,
  speed = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);
  const [direction, setDirection] = useState("");

  const getItemProps = React.useCallback(
    (itemProps = {}) => ({
      ...itemProps,
    }),
    []
  );

  const prevSlide = React.useCallback(() => {
    setPrevIndex(activeIndex);
    setActiveIndex((activeIndex - 1) % children.length);
    setDirection("left");
  }, [activeIndex, children.length]);

  const nextSlide = React.useCallback(() => {
    setPrevIndex(activeIndex);
    setActiveIndex((activeIndex + 1) % children.length);
    setDirection("right");
  }, [activeIndex, children.length]);

  useEffect(() => {
    if (autoScroll) {
      const interval = setInterval(() => {
        setPrevIndex(activeIndex);
        setActiveIndex((activeIndex + 1) % children.length);
        setDirection("right");
      }, speed);
      return () => {
        clearInterval(interval);
      };
    }
  }, [prevSlide, autoScroll, activeIndex, children.length, speed]);

  return (
    <div className={styles.carousel}>
      <CarouselContext.Provider
        value={{
          getItemProps,
          activeIndex,
          prevIndex,
          prevSlide,
          nextSlide,
          direction,
        }}
      >
        <CarouselContext.Consumer>
          {(props) => (
            <>
              <HeightTransition>
                <CarouselContent
                  activeIndex={activeIndex}
                  prevIndex={prevIndex}
                  direction={direction}
                >
                  {children.map((item) => React.cloneElement(item, [props]))}
                </CarouselContent>
              </HeightTransition>
              <button type="button" className={styles.prev} onClick={prevSlide}>
                <img src={Arrow} alt="prev" />
              </button>
              <button type="button" className={styles.next} onClick={nextSlide}>
                <img src={Arrow} alt="next" />
              </button>
              {breadcrumbComponent && breadcrumbComponent({ ...props })}
            </>
          )}
        </CarouselContext.Consumer>
      </CarouselContext.Provider>
    </div>
  );
};

export default FadeInOutCarousel;
