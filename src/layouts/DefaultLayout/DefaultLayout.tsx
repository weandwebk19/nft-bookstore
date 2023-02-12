import { useRef } from "react";
import { SwitchTransition, Transition } from "react-transition-group";

import { Box, Container } from "@mui/material";

import gsap from "gsap";
import { useRouter } from "next/router";

import { Footer, NavBar } from "../components";

interface DefaultLayoutProps {
  children: React.ReactNode;
  onThemeChange: (theme: string) => void;
}

const DefaultLayout = ({ children, onThemeChange }: DefaultLayoutProps) => {
  const router = useRouter();
  const nodeRef = useRef(null);

  const onPageEnter = (element: any) => {
    gsap.fromTo(
      element,
      {
        y: 50,
        autoAlpha: 0,
        ease: "power3.out"
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out"
      }
    );
  };

  const onPageExit = (element: any) => {
    gsap.fromTo(
      element,
      {
        y: 0,
        autoAlpha: 1,
        ease: "power3.out"
      },
      {
        y: -50,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power3.inOut"
      }
    );
  };

  return (
    <>
      <NavBar onThemeChange={onThemeChange} />
      <SwitchTransition>
        <Transition
          key={router.pathname}
          // nodeRef={nodeRef}
          timeout={500}
          in={true}
          onEnter={onPageEnter}
          onExit={onPageExit}
          mountOnEnter
          unmountOnExit
        >
          <Box ref={nodeRef} sx={{ minHeight: "100vh" }}>
            <Container maxWidth="xl">
              <Box className="content">{children}</Box>
            </Container>
          </Box>
        </Transition>
      </SwitchTransition>

      <Footer />
    </>
  );
};

export default DefaultLayout;
