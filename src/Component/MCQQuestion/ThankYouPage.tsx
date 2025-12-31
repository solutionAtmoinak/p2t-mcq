import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      navigate('/', { replace: true });
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [navigate]);

  return <div>Thank you for submitting</div>;
};

export default ThankYouPage;
