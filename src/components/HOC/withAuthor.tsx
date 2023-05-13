import { NextComponentType } from "next";
import { BaseContext } from "next/dist/shared/lib/utils";

import { useUserInfo } from "../hooks/api/useUserInfo";
import { UnauthorizedMessage } from "../shared/UnauthorizedMessage";

function withAuthor<T extends BaseContext>(Component: NextComponentType<T>) {
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
