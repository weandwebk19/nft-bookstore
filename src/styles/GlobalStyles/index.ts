import "./GlobalStyles.scss";

interface Props {
  children: JSX.Element;
}

const GlobalStyles = ({ children }: Props): JSX.Element => {
  return children;
};

export default GlobalStyles;
