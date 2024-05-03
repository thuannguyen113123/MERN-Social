import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//Khi link đi đâu sẽ lên đầu trang
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
