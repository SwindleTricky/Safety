import React, { useState, useEffect } from "react";
import "../css/index.css";
import slogan from "../images/slogan_m.png";
import ModalImage from "react-modal-image";
import axios from "axios";
import Select from "react-dropdown-select";
import "../css/pbar.css";
import { Col, Form, FormLabel, FormControl, Image } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Resizer from "react-image-file-resizer";
import img_404 from "../images/404_img.png";

const FormDetail = () => {
  const api_service = process.env.REACT_APP_API_SERVICE;
  const api_emp = process.env.REACT_APP_400_API;
  let token;
  if (localStorage.getItem("token")) {
    token = JSON.parse(localStorage.getItem("token"));
  }
  const [data, setData] = useState();
  const [picName, setPicname] = useState();
  const [empData, setEmp] = useState();
  const [Load, setLoad] = useState(false);
  const [LoadEmp, setLoadEmp] = useState(false);
  const [LoadPic, setLoadPic] = useState(false);
  const MySwal = withReactContent(Swal);
  const [picture, setPicture] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [picList, setPicList] = useState();
  const [pICFullName, setPICFullName] = useState({
    0: { EMP_CD: "", EMP_NAME: "", SECTION: "" },
  });
  const [image_after, setImage_after] = useState();
  let req_id;
  if (window.location.href) {
    req_id = parseURLParams(window.location.href);
  } else {
    req_id = "";
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const apiServiceRes = await axios.post(api_service + "/soveres", {
          idReq: req_id?.req_id[0],
        });
        setData(apiServiceRes.data);
        // console.log("apiservice"+ apiServiceRes.data)
        const [empInfoRes, picInfoRes] = await Promise.all([
          axios.get(api_emp + "/emp-info/" + apiServiceRes.data[0].EMP_CD),
          axios.get(
            api_emp + "/emp-info/" + (apiServiceRes.data[0].ACTION_PIC || "")
          ), // Include null check for ACTION_PIC
        ]);
        setEmp(empInfoRes.data);
        setPICFullName(picInfoRes.data);

        const picListRes = await axios.get(api_service + "/ul");

        setPicList(picListRes.data);
        const base64String = btoa(
          String.fromCharCode(
            ...new Uint8Array(apiServiceRes.data[0].IMG_DETAIL.data)
          )
        );
        setImage_after(base64String);
      } catch (err) {
        if (err.response.status === 500) {
          MySwal.fire({
            title: "Wrong req ID!",
            text: "Not have this id anymore",
            icon: "error",
            timer: "3000",
            timerProgressBar: true,
          }).then((result) => {
            if (result.isConfirmed || result.dismiss) {
              window.location.replace("/");
            }
          });
        } 
      } finally {
        // if (
        //   data !== undefined &&
        //   empData !== undefined &&
        //   pICFullName !== undefined
        // ) {

        // }
        setLoad(true);
        setLoadEmp(true);
        setLoadPic(true);
      }
    }

    fetchData();
  }, []);
  if (!Load || !LoadEmp || !LoadPic) {
    console.log("LOADING..");
    return <div>Load.... . .. . . </div>;
  }
  let empDetail = "";
  if (LoadEmp) {
    empDetail = empData[0]?.EMP_NAME ? empData[0]?.EMP_NAME : "";
  }

  let imgID = "";
  let imgURL = "";
  if (data[0].IMG) {
    imgID = parseURLParams(data[0].IMG);
    imgURL = "https://lh3.google.com/u/0/d/" + imgID.id;
  }
  let status = parseInt(data[0].STATUS);

  let options = [];
  if (status === 1 && LoadPic) {
    options = picList.map((e, i) => ({
      value: i,
      empCode: e.EMP_CD,
      empName: e.EMP_NAME,
      label: `${e.EMP_CD} ${e.EMP_NAME} ${e.SECTION}`, // Use template literal for cleaner string concatenation
    }));
  }

  const handleChange = (event) => {
    try {
      setPicname(event[0].empCode);
    } catch (err) {
      console.log(err);
    }
  };
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob"
      );
    });
  const handleFileChange = async (event) => {
    console.log(event.target.size);
    setPicture(await resizeFile(event.target.files[0]));
  };

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
    console.log(selectedDate);
  };

  // let img_after = URL.createObjectURL(file)

  // console.log(data[0].IMG_DETAIL)
  let progress_bar = (
    <div className="stepper-wrapper">
      <div
        id="step_1"
        className={`stepper-item ${status === 1 ? "completed" : "completed"}`}
      >
        <div className="step-counter">1</div>
        <div className="step-name">Issue</div>
      </div>
      <div
        id="step_2"
        className={`stepper-item ${
          status === 1 ? "active" : status >= 2 ? "completed" : ""
        }`}
      >
        <div className="step-counter">2</div>
        <div className="step-name">Approve</div>
      </div>
      <div
        id="step_3"
        className={`stepper-item ${
          status >= 3 ? "completed" : status === 2 ? "active" : ""
        }`}
      >
        <div className="step-counter">3</div>
        <div className="step-name">PIC confirm</div>
      </div>
      <div
        id="step_4"
        className={`stepper-item ${
          status === 3 ? "active" : status >= 4 ? "completed" : ""
        }`}
      >
        <div className="step-counter">4</div>
        <div className="step-name">
          {status === 3 ? "On progress" : "Finish"}
        </div>
      </div>
      <div
        id="step_5"
        className={`stepper-item ${
          status === 4 ? "active" : status === 5 ? "completed" : ""
        }`}
      >
        <div className="step-counter">5</div>
        <div className="step-name">Final approve</div>
      </div>
    </div>
  );

  let reject_bar = (
    <div className="d-flex align-items-center justify-content-center">
      <label className="reject-card">REJECT</label>
    </div>
  );

  let status1_label =
    token?.role === "ADMIN" ? (
      <div className="nice-form-group">
        <label id="guideForm">Selection PIC :</label>
        <Select
          id={"selected_pic"}
          onChange={handleChange}
          placeholder="Select PIC"
          style={{ width: "50%" }}
          options={options}
        />
      </div>
    ) : (
      ""
    );

  let status2_label = (
    <>
      <div className="nice-form-group">
        <label id="guideForm">PIC name :</label>
        <small>
          {pICFullName[0].EMP_CD +
            " " +
            pICFullName[0].EMP_NAME +
            " " +
            pICFullName[0].SECTION}
        </small>
      </div>
      <div className="nice-form-group">
        <label id="guideForm">Counter measure :</label>
        {status === 2 ? (
          <textarea id="action"></textarea>
        ) : (
          <small id="action">{data[0].ACTION}</small>
        )}
      </div>
      {status === 3 ? (
        <div className="nice-form-group">
          <label id="guideForm">Remark :</label>
          <textarea id="remark"></textarea>
        </div>
      ) : (
        <div className="nice-form-group">
          <label id="guideForm">Remark :</label>
          <small id="remark">{data[0].REMARK_DETAIL}</small>
        </div>
      )}

      <div className="row">
        <div className="col-6 mt-3">
          {status > 2 && status < 6 ? (
            <>
              <Form.Group controlId="date_picker">
                <FormLabel>Due date:</FormLabel>
                <FormControl
                  type="date"
                  value={data[0].DUE_DATE.split("T")[0]} // Use ISOString for REST API
                  onChange={handleDateChange}
                  disabled
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group controlId="date_picker">
              <FormLabel>Pick your expected due date:</FormLabel>
              <FormControl
                type="date"
                value={selectedDate.toISOString().split("T")[0]} // Use ISOString for REST API
                onChange={handleDateChange}
              />
            </Form.Group>
          )}
        </div>
        {status === 3 ? (
          <div className="col-6 mt-3">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Insert your image :</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
  let showLabel = "";
  if (status === 1) {
    showLabel = status1_label;
  } else if (status >= 2 && status < 6 && token) {
    showLabel = status2_label;
  }

  let button_comp = (
    <details>
      <summary>
        <div className="row">
          <div className="col-6 d-flex align-items-start justify-content-start">
            {status === 1 ? (
              <button
                className="btn btn-danger"
                onClick={() =>
                  MySwal.fire({
                    title: "Please input reason for reject",
                    inputAttributes: {
                      autocapitalize: "off",
                    },
                    input: "text",
                    showCancelButton: true,
                    preConfirm: async (remark_reject) => {
                      update_form(6, remark_reject);
                    },
                  })
                }
              >
                {" "}
                Reject
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="col-6 d-flex align-items-end justify-content-end">
            <button
              className="btn btn-success"
              onClick={() => update_form(status, 0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-code"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>{" "}
              {status === 3 ? "Finish" : status === 4 ? "Approve" : "Issue"}
            </button>
          </div>
        </div>
      </summary>
    </details>
  );

  return (
    <div className="container">
      <div className="demo-page" style={{ color: "#000000" }}>
        <main className="demo-page-content">
          <section>
            <div className="d-flex align-items-center justify-content-center">
              <img src={slogan} alt="slogan_m" style={{ width: "10rem" }} />
            </div>
            <div className="href-target" id="structure"></div>
            {status === 6 ? reject_bar : progress_bar}

            <h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-layers"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              {data[0] ? data[0].LOCATION_NAME : "Undefinded"}
            </h1>
            <div>
              <div className="nice-form-group">
                <label id="formID">
                  Request ID : {req_id ? req_id.req_id : "Undefinded"}
                </label>
              </div>
              <div className="nice-form-group">
                <label id="timeForm">Request Time :</label>
                <small>
                  {data
                    ? data[0].DATE_TIME.split("T")[0] +
                      " " +
                      data[0].DATE_TIME.split("T")[1].split(".")[0]
                    : "Undefinded"}
                </small>
              </div>
              <div className="nice-form-group">
                <label id="requistorForm">Requestor : </label>
                <small>
                  {data[0].EMP_CD ? data[0].EMP_CD : "Undefinded"}{" "}
                  {empDetail ? empDetail : ""}
                </small>
              </div>
              <div className="nice-form-group">
                <label id="positionForm">Detail :</label>
                <small>{data ? data[0].DETAIL : "Undefinded"}</small>
              </div>
              <div className="nice-form-group">
                <label id="modeForm">Mode of risk : </label>
                <small>{data ? data[0].TYPE : "Undefinded"}</small>
              </div>
              <div className="nice-form-group">
                <label id="rankForm">Rank of risk : </label>
                <small>{data ? data[0].RISK_LEVEL : "Undefinded"}</small>
              </div>
              <div className="nice-form-group">
                <label id="guideForm">Suggestion :</label>
                <small>{data ? data[0]?.REMARK : "Undefinded"}</small>
              </div>
              {showLabel}
              {/* {status1_label}
              {status2_label} */}

              <div className="nice-form-group d-flex align-items-center justify-content-center">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <label id="rankForm">Image of risk : </label>
                      </th>
                      <th>
                        {status >= 4 && status < 6 ? (
                          <label id="rankForm">Image after : </label>
                        ) : (
                          ""
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pe-5">
                        <Col>
                          <Image
                            style={{ width: "15rem", height: "15rem" }}
                            src={imgURL ? imgURL : img_404}
                            alt="test_image"
                            rounded="True"
                            onClick={() => {
                              Swal.fire({
                                imageUrl: imgURL ? imgURL : img_404,
                                showConfirmButton: false, // Disable OK button
                                showCancelButton: false, // Optionally disable cancel button for a cleaner experience
                                backdrop: true, // Enable background click to close
                                allowEscapeKey: true, // Allow Escape key to close
                                showCloseButton: true,
                                background: "",
                              });
                            }}
                          />
                        </Col>
                      </td>
                      <td>
                        {/* <img src={`data:image/png;base64,${image_after}`} alt="after"/> */}
                        <Col>
                          {status >= 4 && status < 6 ? (
                            <Image
                              style={{ width: "15rem", height: "15rem" }}
                              src={
                                `data:image/png;base64,${image_after}`
                                  ? `data:image/png;base64,${image_after}`
                                  : img_404
                              }
                              alt="test_image"
                              rounded="True"
                              onClick={() => {
                                Swal.fire({
                                  imageUrl:
                                    `data:image/png;base64,${image_after}`
                                      ? `data:image/png;base64,${image_after}`
                                      : img_404,
                                  showConfirmButton: false, // Disable OK button
                                  showCancelButton: false, // Optionally disable cancel button for a cleaner experience
                                  backdrop: true, // Enable background click to close
                                  allowEscapeKey: true, // Allow Escape key to close
                                  showCloseButton: true,
                                  background: "",
                                });
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </Col>
                        {/* <ModalImage
                          crossOrigin="anonymous"
                          className="className"
                          style={{ width: "10rem" }}
                          small={`data:image/png;base64,${image_after}`}
                          large={imgURL}
                        /> */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Other form groups go here */}

            {/* Button */}
            {token?.role === "ADMIN" && (status === 1 || status === 4)
              ? button_comp
              : token &&
                status !== 1 &&
                status !== 4 &&
                status !== 5 &&
                status !== 6
              ? button_comp
              : ""}
          </section>
        </main>
      </div>
    </div>
  );

  async function update_form(tempStatus, remark) {
    if (tempStatus === 1) {
      if (picName) {
        try {
          axios
            .post(
              api_service + "/cfrm/2",
              {
                idReq: req_id.req_id[0],
                pic: picName,
                status: status + 1,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token.token,
                },
              }
            )
            .then(() => {
              window.location.reload();
            })
            .catch(function (error) {
              if (error.response.status === 401) {
                const message = "Unauthorized: Please log in."; // Extract error message if available
                MySwal.fire({
                  title: "Authentication Error: 401",
                  text: message,
                  icon: "error",
                }).then(() => {
                  localStorage.clear();
                  window.location.replace("/login"); // Redirect to login page on confirmation
                });
              } else {
                console.error(
                  `Unexpected response status: ${error.response.status}`
                ); // Handle other errors
              }
            });
        } catch (err) {
          console.log(err);
        }
      } else {
        MySwal.fire({
          title: "PIC",
          text: "Please select PIC",
          icon: "error",
        });
      }
    } else if (tempStatus === 6) {
      try {
        // console.log(remarkReject);
        axios
          .post(
            api_service + "/cfrm/2",
            {
              idReq: req_id.req_id[0],
              remark_reject: remark,
              status: tempStatus,
              cfrm_id: token.id,
            },
            {
              headers: {
                Authorization: token.token,
              },
            }
          )
          .then(() => {
            window.location.reload();
          })
          .catch(function (error) {
            if (error.response.status === 401) {
              const message = "Unauthorized: Please log in."; // Extract error message if available
              MySwal.fire({
                title: "Authentication Error: 401",
                text: message,
                icon: "error",
              }).then(() => {
                localStorage.clear();
                window.location.replace("/login"); // Redirect to login page on confirmation
              });
            } else {
              console.error(
                `Unexpected response status: ${error.response.status}`
              ); // Handle other errors
            }
          });
      } catch (error) {
        console.error(`Unexpected response status: ${error.response.status}`); // Handle other errors
      }
    } else if (tempStatus === 2) {
      try {
        axios
          .post(
            api_service + "/cfrm/3",
            {
              idReq: req_id.req_id[0],
              pic: data[0].ACTION_PIC,
              status: status + 1,
              action: document.getElementById("action").value,
              dueDate: selectedDate,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token.token,
              },
            }
          )
          .then(() => {
            window.location.reload();
          })
          .catch(function (error) {
            if (error.response.status === 401) {
              const message = "Unauthorized: Please log in."; // Extract error message if available
              MySwal.fire({
                title: "Authentication Error: 401",
                text: message,
                icon: "error",
              }).then(() => {
                localStorage.clear();
                window.location.replace("/login"); // Redirect to login page on confirmation
              });
            } else {
              console.error(
                `Unexpected response status: ${error.response.status}`
              ); // Handle other errors
            }
          });
      } catch (err) {
        console.log(err);
      }
    } else if (tempStatus === 3) {
      try {
        axios
          .post(
            api_service + "/cfrm/4",
            {
              idReq: req_id.req_id[0],
              pic: data[0].ACTION_PIC,
              status: status + 1,
              action: document.getElementById("action").value,
              dueDate: selectedDate,
              remark: document.getElementById("remark").value,
              img: picture,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token.token,
              },
            }
          )
          .then(() => {
            window.location.reload();
          })
          .catch(function (error) {
            if (error.response.status === 401) {
              const message = "Unauthorized: Please log in."; // Extract error message if available
              MySwal.fire({
                title: "Authentication Error: 401",
                text: message,
                icon: "error",
              }).then(() => {
                localStorage.clear();
                window.location.replace("/login"); // Redirect to login page on confirmation
              });
            } else {
              console.error(
                `Unexpected response status: ${error.response.status}`
              ); // Handle other errors
            }
          });
      } catch (err) {
        console.log(err);
      }
    } else if (tempStatus === 4) {
      try {
        axios
          .post(
            api_service + "/cfrm/5",
            {
              idReq: req_id.req_id[0],
              pic: data[0].ACTION_PIC,
              status: status + 1,
              cfrm_id: token.id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token.token,
              },
            }
          )
          .then(() => {
            window.location.reload();
          })
          .catch(function (error) {
            if (error.response.status === 401) {
              const message = "Unauthorized: Please log in."; // Extract error message if available
              MySwal.fire({
                title: "Authentication Error: 401",
                text: message,
                icon: "error",
              }).then(() => {
                localStorage.clear();
                window.location.replace("/login"); // Redirect to login page on confirmation
              });
            } else {
              console.error(
                `Unexpected response status: ${error.response.status}`
              ); // Handle other errors
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
      queryEnd = url.indexOf("#") + 1 || url.length + 1,
      query = url.slice(queryStart, queryEnd - 1),
      pairs = query.replace(/\+/g, " ").split("&"),
      parms = {},
      i,
      n,
      v,
      nv;
    if (query === url || query === "") return;
    for (i = 0; i < pairs.length; i++) {
      nv = pairs[i].split("=", 2);
      n = decodeURIComponent(nv[0]);
      v = decodeURIComponent(nv[1]);
      if (!parms.hasOwnProperty(n)) parms[n] = [];
      parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
  }
};

export default FormDetail;
