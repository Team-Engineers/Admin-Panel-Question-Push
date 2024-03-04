import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/images/logo.png";
import CuetLoader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USERAPI } from "../../utils/constant";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [showError, setShowError] = useState(false);
  const Navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (disableButton || !emailValid) return;
    setShowError(false);
    setIsLoading(true);
    setDisableButton(true);

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${USERAPI}/auth/signin`, userData);
      if (response.status === 200) {
        const user = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        const tokenExpiry = new Date().getTime() + 5 * 24 * 60 * 60 * 1000; // 5 days
        const tokenData = {
          token: user.accessToken,
          expiry: tokenExpiry,
        };
        localStorage.setItem("accessToken", JSON.stringify(tokenData));
        Navigate("/");
      } else {
        setIsLoading(false);
        setShowError(true);
      }
    } catch (error) {
      if (error.response) {
        setShowError(true);
      }
    } finally {
      setIsLoading(false);
      setDisableButton(false);
    }
  };
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    const isValid = isEmailValid(enteredEmail);
    setEmailValid(isValid);
    setEmail(enteredEmail);
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form>
                      <div className="d-flex justify-content-center gap-2 align-items-center mb-3 pb-1">
                        {/* <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{color: "#ff6219"}}
                        ></i> */}
                        <img
                          src={logo}
                          alt="testknock-logo"
                          style={{ height: "40px" }}
                        />
                        <span className="h1 fw-bold mb-0">Testknock</span>
                      </div>

                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Sign into your account
                      </h5>

                      <div className="form-outline mb-4">
                        <label className="form-label" for="form2Example17">
                          Email address
                        </label>
                        <input
                          type="email"
                          placeholder="Email"
                          onChange={(e) => handleEmailChange(e)}
                          className="form-control form-control-lg"
                        />

                        {!emailValid && (
                          <h6 className="text-danger">
                            Please enter a valid email address.
                          </h6>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" for="form2Example27">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          id="form2Example27"
                          className="form-control form-control-lg"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSignIn(e);
                            }
                          }}
                        />
                      </div>
                      {showError ? (
                        <h6 className="text-danger">
                          The username or password you specified are not
                          correct.
                        </h6>
                      ) : (
                        ""
                      )}

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="button"
                          onClick={() => handleSignIn()}
                          
                        >
                          Login
                        </button>
                        {isLoading && <CuetLoader />}
                      </div>

                      {/* <a className="small text-muted" href="#!">
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{color: "#393f81"}}>
                        Don't have an account?{" "}
                        <a href="#!" style={{color: "#393f81"}}>
                          Register here
                        </a>
                      </p>
                      <a href="#!" className="small text-muted">
                        Terms of use.
                      </a>
                      <a href="#!" className="small text-muted">
                        Privacy policy
                      </a> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
