import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getCookie, setCookie } from "../function/cookies"; 

function Login() {
  const navigate = useNavigate();
  if (localStorage.getItem("token")) {
    window.location.replace("/");
  }
  const api_service = process.env.REACT_APP_API_SERVICE;
  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const authen = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(api_service + "/login", formData, {
          headers: "Authorization",
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            localStorage.setItem(
              "initEx",
              JSON.stringify({
                initial: Date.now(),
                expiresOn: Date.now() + 1000 * 60 * 60 * 1, // 12 hours in ms 1000 ms * 60 s * 60 m * 24 hr
              })
            );
            localStorage.setItem("token", JSON.stringify(res.data))
            MySwal.fire({
              title: "Successfully!",
              text: "Loged in",
              icon: "success",
              timer: "1500",
              timerProgressBar: true
            }).then((result) => {
              if (result.isConfirmed || result.dismiss) {
                window.location.replace(localStorage.getItem("prev"));
                // navigate('/', { state: { key: "value" } })
              }
            });
          }
        })
        .catch((error) => {
          console.log(error.response);
          MySwal.fire({
            title: "ERROR " + error.response.status,
            text:
              error.response.status === 401
                ? "Username or password incorrect"
                : error.response.statusText,
            icon: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="content" className="account-pages pt-2 pt-sm-4 pb-5 pb-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-4 col-lg-5">
            <div className="card animate glow delay-2">
              <div className="card-body p-4">
                <div className="text-center w-75 m-auto">
                  <h4 className="text-dark-50 text-center pb-0 fw-bold">
                    Sign In
                  </h4>
                </div>
                <form onSubmit={authen}>
                  <div className="mb-3">
                    <label for="username" className="form-label">
                      Username
                    </label>
                    <input
                      id="username"
                      name="user"
                      className="form-control"
                      type="text"
                      maxLength="5"
                      placeholder="รหัสพนักงาน 5 หลัก"
                      value={formData.name}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label for="password" className="form-label">
                      Password
                    </label>
                    <div className="input-group input-group-merge">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="ปีคศ เดือน วันเกิด เช่น 19990414"
                        value={formData.name}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="mb-3 mb-0 text-center">
                    <button type="submit" className="btn btn-success">
                      Log In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
