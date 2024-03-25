import { authorize } from "../services/api";

const LoginModal = () => {
  return (
    <div>
      <button onClick={authorize}>Login with spotify</button>
    </div>
  );
};

export default LoginModal;
