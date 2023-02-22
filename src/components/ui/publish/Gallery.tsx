import { useEffect, useRef, useState } from "react";

import styles from "@styles/Gallery.module.scss";
import gsap from "gsap";
import MotionPathPlugin from "gsap/dist/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const Gallery = () => {
  const [opened, setOpened] = useState(0);

  const [inPlace, setInPlace] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const images = [
    {
      title: "Mini canine",
      url: "https://images.unsplash.com/photo-1583551536442-0fc55ac443f6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
    },
    {
      title: "Wheely tent",
      url: "https://images.unsplash.com/photo-1583797227225-4233106c5a2a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
    },
    {
      title: "Red food things",
      url: "https://images.unsplash.com/photo-1561626450-730502dba332?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
    },
    {
      title: "Sand boat",
      url: "https://images.unsplash.com/photo-1585221454166-ce690e60465f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
    },
    {
      title: "Screen thing",
      url: "https://images.unsplash.com/photo-1585427795543-33cf23ea2853?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
    },
    {
      title: "Horse tornado",
      url: "https://images.unsplash.com/photo-1507160874687-6fe86a78b22e?ixlib?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
    }
  ];

  const onClick = (index: number) => {
    if (!disabled) setOpened(index);
  };
  const onInPlace = (index: number) => setInPlace(index);

  const next = () => {
    let nextIndex = opened + 1;
    if (nextIndex >= images.length) nextIndex = 0;
    onClick(nextIndex);
  };

  useEffect(() => setDisabled(true), [opened]);
  useEffect(() => setDisabled(false), [inPlace]);
  // useEffect(() => {
  // 	if(CodePen && CodePen.isThumbnail)
  // 	{
  // 		setTimeout(() => next(), 100)
  // 	}
  // }, [])

  return (
    <>
      <div className={`${styles.container} ${styles.shadow}`}>
        {images.map((image, i) => (
          <div
            key={image.url}
            className={styles.image}
            style={{ zIndex: inPlace === i ? i : images.length + 1 }}
          >
            <Image
              total={images.length}
              id={i}
              url={image.url}
              title={image.title}
              open={opened === i}
              inPlace={inPlace === i}
              onInPlace={onInPlace}
              alt={image.title}
            />
          </div>
        ))}
        <div className={styles.tabs}>
          <Tabs className={styles.tabs} images={images} onSelect={onClick} />
        </div>
      </div>

      <button
        className={`${styles.button} ${styles.next} ${styles.shadow}`}
        onClick={next}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          {" "}
          <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />{" "}
        </svg>
      </button>
    </>
  );
};

const Image = ({ url, title, open, inPlace, id, onInPlace, total }: any) => {
  const [firstLoad, loaded] = useState(true);
  const clip = useRef(null);
  const border = useRef(null);

  const gap = 10;
  const circle = 7;
  const defaults = { transformOrigin: "center center" };
  const duration = 0.4;
  const width = 400;
  const height = 400;
  const scale = 700;

  let bigSize = circle * scale;
  let overlap = 0;

  const getPosSmall = () => ({
    x:
      width / 2 -
      (total * (circle * 2 + gap) - gap) / 2 +
      id * (circle * 2 + gap),
    y: height - 30,
    scale: 1
  });
  const getPosSmallAbove = () => ({
    x:
      width / 2 -
      (total * (circle * 2 + gap) - gap) / 2 +
      id * (circle * 2 + gap),
    y: height / 2,
    scale: 1
  });
  const getPosSmallBelow = () => ({ x: width * 0.5, y: height - 30, scale: 1 });
  const getPosCenter = () => ({ x: width / 2, y: height / 2, scale: 7 });
  const getPosEnd = () => ({
    x: width / 2 - bigSize + overlap,
    y: height / 2,
    scale: scale
  });
  const getPosStart = () => ({
    x: width / 2 + bigSize - overlap,
    y: height / 2,
    scale: scale
  });

  const onStateChange = () => {
    loaded(false);
    if (border.current) {
      gsap.set(border.current, { ...defaults, ...getPosSmall() });
      console.log(border.current);
    }
    if (clip.current) {
      let flipDuration = firstLoad ? 0 : duration;
      let upDuration = firstLoad ? 0 : 0.2;
      let bounceDuration = firstLoad ? 0.01 : 1;
      let delay = firstLoad ? 0 : flipDuration + upDuration;

      if (open) {
        // gsap.fromTo(
        // 	`.letters_${id}`,
        // 	{rotation: 'random(-180, 180)', x: `random(${width * 0.7}, ${width * 0.9})`, y: `random(${height * 0.4}, ${height * 0.6})`, opacity: 1},
        // 	{ease: 'power3.Out', delay: `random(${upDuration + 0.2}, ${upDuration + 0.6})`, duration: flipDuration * 1.5, opacity: 1, rotation: 0, motionPath:[{x: width * 0.1, y: height * 0.5}, {x: 40, y: 60}]}
        // );

        gsap
          .timeline()
          .set(clip.current, { ...defaults, ...getPosSmall() })
          .to(clip.current, {
            ...defaults,
            ...getPosCenter(),
            duration: upDuration,
            ease: "power3.inOut"
          })
          .to(clip.current, {
            ...defaults,
            ...getPosEnd(),
            duration: flipDuration,
            ease: "power4.in",
            onComplete: () => onInPlace(id)
          });
      } else {
        gsap.timeline();
        //.fromTo(`.letters_${id}`, {x: 40, y: 60, rotation: 0}, {delay: 0.7, duration: duration * 2, x: `random(${width * 0.24}, ${width - 100})`, y: `random(${20}, ${height/2})`, opacity: 0.75, rotation: 'random(-90, 90)', ease: 'Power3.Out'})
        // .to(`.letters_${id}`, {duration: 0.3, ease: 'power2.in', opacity: 0, x: width / 2, y: height / 2})

        gsap
          .timeline({ overwrite: true })
          .set(clip.current, { ...defaults, ...getPosStart() })
          .to(clip.current, {
            ...defaults,
            ...getPosCenter(),
            delay: delay,
            duration: flipDuration,
            ease: "power4.out"
          })
          .to(clip.current, {
            ...defaults,
            motionPath: [getPosSmallAbove(), getPosSmall()],
            duration: bounceDuration,
            ease: "bounce.out"
          });
      }
    }
  };

  useEffect(onStateChange, [open, clip]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <clipPath id={id + "_circleClip"}>
          <circle
            className={styles.clip}
            cx="0"
            cy="0"
            r={circle}
            ref={clip}
          ></circle>
        </clipPath>
        <clipPath id={id + "_squareClip"}>
          <rect className={styles.clip} width={width} height={height}></rect>
        </clipPath>
      </defs>
      <g clipPath={`url(#${id + (inPlace ? "_squareClip" : "_circleClip")})`}>
        <image width={width} height={height} xlinkHref={url}></image>
      </g>
    </svg>
  );
};

const Tabs = ({ images, onSelect }: any) => {
  const gap = 10;
  const circle = 7;
  const defaults = { transformOrigin: "center center" };
  const width = 400;
  const height = 400;

  const getPosX = (i: number) =>
    width / 2 -
    (images.length * (circle * 2 + gap) - gap) / 2 +
    i * (circle * 2 + gap);
  const getPosY = (i: number) => height - 30;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {(!images ? [] : images).map((_: any, i: number) => (
        <circle
          key={i}
          onClick={() => onSelect(i)}
          className={styles.border}
          cx={getPosX(i)}
          cy={getPosY(i)}
          r={circle + 2}
        ></circle>
      ))}
    </svg>
  );
};

export default Gallery;
