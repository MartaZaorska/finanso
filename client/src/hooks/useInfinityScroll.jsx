import { useEffect, useLayoutEffect, useState } from "react";
import { debounce } from '../utils/helpers';

const useInfinityScroll = (amount, total, buttonRef = null) => {
  const [visible, setVisible] = useState(amount);

  useLayoutEffect(() => {
    if(buttonRef?.current) 
      buttonRef.current.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [buttonRef]);

  useEffect(() => {
    function infinityScroll(){
      if(window.scrollY >= document.body.scrollHeight - window.innerHeight - 100)
        setVisible(prev => Math.min(prev + amount, total));

      if(buttonRef?.current)
        buttonRef.current.classList.toggle("active", window.scrollY >= 500);
    }

    const onScrollHandler = debounce(() => infinityScroll(), 500);

    window.addEventListener("scroll", onScrollHandler);

    return () => window.removeEventListener("scroll", onScrollHandler);
  }, [total, amount]);
  
  return visible;
}

export default useInfinityScroll;