import React, { useState, useEffect } from "react";
import "../css/index.css";
import slogan from "../images/slogan_m.png";
import ModalImage from "react-modal-image";
import axios from "axios";
import Select from "react-dropdown-select";
import "../css/pbar.css";
import { Form, FormLabel, FormControl } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

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
  let req_id = parseURLParams(window.location.href);

  useEffect(() => {
    async function getData() {
      try {
        await axios
          .post(
            api_service + "/sovereqid",
            {
              idReq: req_id.req_id[0],
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            setData(res.data);
          });
      } catch (err) {
        // throw err
        console.log(err);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setLoad(true);
    }
  }, [data]);

  useEffect(() => {
    async function getEmpDetail() {
      try {
        const actionPic = data[0].ACTION_PIC ? data[0].ACTION_PIC : "" 
        const [res1, res2] = await Promise.all([
          axios.get(api_emp + "/emp-info/" + data[0].EMP_CD),
          axios.get(api_emp + "/emp-info/" + actionPic),
        ]);
        setEmp(res1.data);
        setPICFullName(res2.data);
      } catch (err) {
        console.log(err);
      }
    }
    getEmpDetail();
  }, [data]);

  useEffect(() => {
    async function getList() {
      try {
        axios.get(api_service + "/ul").then((res) => {
          setPicList(res.data);
        });
      } catch (err) {
        // throw err
        console.log(err);
      }
    }
    getList();
  }, [data]);

  useEffect(() => {
    if (empData !== undefined) {
      setLoadEmp(true);
    }
  }, [empData]);

  useEffect(() => {
    if (picList !== undefined) {
      setLoadPic(true);
    }
  }, [picList]);

  if (!Load || !LoadEmp || !LoadPic) {
    console.log("LOADING..");
    return <div>Load.... . .. . . </div>;
  }

  let empDetail = "";
  if (LoadEmp) {
    empDetail = empData[0].EMP_NAME;
  }

  let imgID = parseURLParams(data[0].IMG);
  let imgURL = "https://lh3.google.com/u/0/d/" + imgID.id;
  let imgURL_small = "https://drive.google.com/thumbnail?id=" + imgID.id;
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
  const handleFileChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
    console.log(selectedDate);
  };

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
  let status1_label = (
    <div className="nice-form-group">
      <label id="guideForm">Selection PIC :</label>
      <Select
        onChange={handleChange}
        placeholder="Select PIC"
        style={{ width: "50%" }}
        options={options}
      />
    </div>
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
        {status === 2 ?  <textarea id="action"></textarea> : <small></small>}
      </div>
      {status === 3 ? (
        <div className="nice-form-group">
          <label id="guideForm">Remark :</label>
          <textarea id="remark"></textarea>
        </div>
      ) : (
        ""
      )}

      <div className="row">
        <div className="col-6">
          <Form.Group controlId="date_picker">
            <FormLabel>Pick your expected due date:</FormLabel>
            <FormControl
              type="date"
              value={selectedDate.toISOString().split("T")[0]} // Use ISOString for REST API
              onChange={handleDateChange}
            />
          </Form.Group>
        </div>
        {status === 3 ? (
          <div className="col-6">
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
  let showLabel;
  if (status === 1) {
    showLabel = status1_label;
  } else if (status >= 2) {
    showLabel = status2_label;
  }

  return (
    <div className="container">
      <div className="demo-page" style={{ color: "#000000" }}>
        <main className="demo-page-content">
          <section>
            <div className="d-flex align-items-center justify-content-center">
              <img src={slogan} alt="slogan_m" style={{ width: "10rem" }} />
            </div>
            <div className="href-target" id="structure"></div>
            {progress_bar}

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
                <small>{data ? data[0].DATE_TIME : "Undefinded"}</small>
              </div>
              <div className="nice-form-group">
                <label id="requistorForm">Requestor : </label>
                <small>
                  {data ? data[0].EMP_CD : "Undefinded"} {empDetail}
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
                <small>{data ? data[0].REMARK : "Undefinded"}</small>
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
                        {/* <label id="rankForm">Image after : </label> */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pe-5">
                        <ModalImage
                          crossOrigin="anonymous"
                          className="className"
                          style={{ width: "10rem" }}
                          small={imgURL_small}
                          large={imgURL}
                        />
                      </td>
                      <td>
                        {/* <ModalImage
                          crossOrigin="anonymous"
                          className="className"
                          style={{ width: "10rem" }}
                          small={imgURL_small}
                          large={imgURL}
                        /> */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* <img src="https://drive.google.com/thumbnail?id=1SXTwEz4_yVzVgnCII4KuHkA0VtHHga8g" /> */}
            </div>
            {/* Other form groups go here */}

            {/* Button */}
            {token ? (
              <details>
                <summary>
                  <div className="row">
                    <div className="col-6 d-flex align-items-start justify-content-start">
                      {status === 3 ? (
                        <button
                          className="btn btn-success"
                          onClick={() => update_form(status)}
                        >
                          {" "}
                          Save
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-6 d-flex align-items-end justify-content-end">
                      <button
                        className="btn btn-success"
                        onClick={() => update_form(status)}
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
                        {status === 3
                          ? "Finish"
                          : status === 4
                          ? "Approve"
                          : "Issue"}
                      </button>
                    </div>
                  </div>
                </summary>
              </details>
            ) : (
              ""
            )}
          </section>
        </main>
      </div>
    </div>
  );

  function update_form(tempStatus) {
    if (tempStatus === 1) {
      try {
        axios
          .post(
            api_service + "/cfrm/2",
            {
              id: req_id.req_id[0],
              pic: picName,
              status: status + 1,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            window.location.href = "./form?req_id=" + req_id.req_id[0];
          });
      } catch (err) {
        console.log(err);
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
                "Authorization": token.token
              },
            }
          )
          .then(() => {
            window.location.href = "./form?req_id=" + req_id.req_id[0];
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
