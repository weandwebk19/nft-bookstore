import { NextComponentType } from "next";

import { useUserInfo } from "../hooks/api/useUserInfo";
import { UnauthorizedMessage } from "../shared/UnauthorizedMessage";

function withAuthor<T>(Component: NextComponentType<T>) {
  const Auth = (props: any) => {
    const { data } = useUserInfo();

    if (data?.isAuthor === undefined) {
      return <UnauthorizedMessage />;
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuthor;
