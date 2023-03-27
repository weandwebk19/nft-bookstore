import { NextComponentType } from "next";
import { useSession } from "next-auth/react";

import { UnauthenticatedMessage } from "../shared/UnauthenticatedMessage";

function withAuth<T>(Component: NextComponentType<T>) {
  const Auth = (props: any) => {
    const { status } = useSession();

    if (status === "unauthenticated") {
      return <UnauthenticatedMessage />;
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuth;
