import { Outlet, useNavigate, useParams } from "react-router-dom";
import Platform from "../../pages/Platform";
import { useEffect } from "react";


const PlatformGuard = () => {
  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    if (!id) {
      navigate('/projetos');
      return;
    }
  }, []);

  return (
    <Platform>
      <Outlet />
    </Platform>
  )
};

export default PlatformGuard;
