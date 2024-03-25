import { render } from "preact";
import { Main, Footer, Header, LoginModal } from "./components";
import { isAuthorized, getToken } from "./services/api";
import "./styles/app.scss";
import { useEffect } from "preact/hooks";

const App = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      getToken(code);
    }
  }, [getToken]);

  return isAuthorized() ? (
    <>
      <Header></Header>
      <Main></Main>
      <Footer></Footer>
    </>
  ) : (
    <LoginModal></LoginModal>
  );
};

render(<App />, document.getElementById("app")!);
