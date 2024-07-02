import React, { useState, useEffect } from "react";
import "../css/index.css";
import slogan from "../images/slogan_m.png";
import loading from "../images/loading1.gif";
import axios from "axios";
import Select from "react-dropdown-select";
import "../css/pbar.css";
import { Col, Form, FormLabel, FormControl, Image } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Resizer from "react-image-file-resizer";
import img_404 from "../images/404_img.png";
import { riskMode } from "../function/riskMode";

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
  const [picture, setPicture] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [picList, setPicList] = useState();
  const [pICFullName, setPICFullName] = useState({
    0: { EMP_CD: "", EMP_NAME: "", SECTION: "" },
  });
  const [image_after, setImage_after] = useState();
  const [inpDetail, setInpDetail] = useState();
  const [checkedValues, setCheckedValues] = useState([]);
  const [findedOther, setFindedOther] = useState([]);
  const [initRisk, setInitRisk] = useState([]);
  const [atwork, setAtwork] = useState(0);

  const CHECKBOX_OPTIONS = [
    { value: "หนีบ", label: "หนีบ" },
    { value: "กระเด็น", label: "กระเด็น" },
    { value: "กระแทก", label: "กระแทก" },
    { value: "ความร้อน", label: "ความร้อน" },
    { value: "ตัด/บาด", label: "ตัด/บาด" },
    { value: "ลื่น/ล้ม", label: "ลื่น/ล้ม" },
    { value: "ไฟไหม้", label: "ไฟไหม้" },
    { value: "สารเคมี หก/รั่วไหล", label: "สารเคมี หก/รั่วไหล" },
    {
      value: "อุบัติเหตุทาง รถยนต์/จักรยานยนต์",
      label: "อุบัติเหตุทาง รถยนต์/จักรยานยนต์",
    },
  ];

  const MySwal = withReactContent(Swal);

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
        await setData(apiServiceRes.data);
        setInpDetail(apiServiceRes.data[0].DETAIL);
        const [empInfoRes, picInfoRes] = await Promise.all([
          axios.get(api_emp + "/emp-info/" + apiServiceRes.data[0].EMP_CD),
          axios.get(
            api_emp + "/emp-info/" + (apiServiceRes.data[0].ACTION_PIC || "")
          ), // Include null check for ACTION_PIC
        ]);
        setEmp(empInfoRes.data);
        setPICFullName(picInfoRes.data);
        setCheckedValues(riskMode(apiServiceRes.data[0].TYPE));
        setInitRisk(apiServiceRes.data[0].RISK_LEVEL);

        const picListRes = await axios.post(api_service + "/ul", {
          location_name: apiServiceRes.data[0].LOCATION_NAME,
        });

        setPicList(picListRes.data);
        const base64String = btoa(
          String.fromCharCode(
            ...new Uint8Array(apiServiceRes.data[0].IMG_DETAIL.data)
          )
        );
        setImage_after(base64String);
        setInpDetail(data[0]?.DETAIL);
      } catch (err) {
        if (err.response?.status === 500) {
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
        setLoad(true);
        setLoadEmp(true);
        setLoadPic(true);
      }
    }

    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    for (let i in checkedValues) {
      let missData = 0;
      for (let j in CHECKBOX_OPTIONS) {
        if (checkedValues[i] !== CHECKBOX_OPTIONS[j].value) {
          missData = missData + 1;
        }
      }
      if (missData === 9) {
        setFindedOther(checkedValues[i]);
        setCheckedValues(checkedValues.filter((v) => v !== checkedValues[i]));
        console.log(findedOther);
        break;
      }
    }
    // eslint-disable-next-line
  }, [checkedValues]);

  if (!Load || !LoadEmp || !LoadPic) {
    console.log("LOADING..");
    return (
      <>
        <div
          style={{
            margin: "40px",
            display: "flex", // Use flexbox
            justifyContent: "center", // Center content horizontally
            alignItems: "center", // Center content vertically
            height: "70vh", // Set the height of the div to be full viewport height or any desired value
          }}
        >
          <div>
            <img width={100} height={100} src={loading} alt="Loading..."></img>
          </div>
        </div>
      </>
    );
  }

  let empDetail = "";
  if (LoadEmp) {
    empDetail = empData[0]?.EMP_NAME ? empData[0]?.EMP_NAME : "";
  }
  console.log(data[0].IMG);

  // let imgID = "";
  // let imgURL = "/img/" + req_id.req_id + ".png";
  let imgURL = "http://163.50.57.177:4040/img/" + req_id.req_id;
  // let imgURL = "";
  // if (data[0].IMG) {
  //   imgID = parseURLParams(data[0].IMG);
  //   imgURL = "https://lh3.google.com/u/0/d/" + imgID.id;
  // }
  let status = parseInt(data[0].STATUS);

  let riskImageComp = [];
  let imgCount = data[0].IMG.split(", ");
  if (imgCount.length === 1) {
    riskImageComp.push(
      <div>
        <Image
          style={{ width: "10rem", height: "10rem" }}
          src={imgURL + ".png" ? imgURL + ".png" : img_404}
          alt="test_image"
          rounded="True"
          onClick={() => {
            Swal.fire({
              imageUrl: imgURL + ".png" ? imgURL + ".png" : img_404,
              showConfirmButton: false, // Disable OK button
              showCancelButton: false, // Optionally disable cancel button for a cleaner experience
              backdrop: true, // Enable background click to close
              allowEscapeKey: true, // Allow Escape key to close
              showCloseButton: true,
              background: "",
            });
          }}
        />
      </div>
    );
  } else {
    for (let i = 0; i < imgCount.length; i++) {
      riskImageComp.push(
        <Image
          style={{ width: "10rem", height: "10rem" }}
          src={imgURL + "_" + i + ".png" ? imgURL + "_" + i + ".png" : img_404}
          alt="test_image"
          rounded="True"
          onClick={() => {
            Swal.fire({
              imageUrl:
                imgURL + "_" + i + ".png" ? imgURL + "_" + i + ".png" : img_404,
              showConfirmButton: false, // Disable OK button
              showCancelButton: false, // Optionally disable cancel button for a cleaner experience
              backdrop: true, // Enable background click to close
              allowEscapeKey: true, // Allow Escape key to close
              showCloseButton: true,
              background: "",
            });
          }}
        />
      );
    }
  }

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
    <>
      <div className="d-flex align-items-center justify-content-center">
        <label className="reject-card">REJECT</label>
      </div>
      <div className="d-flex align-items-center justify-content-center nice-form-group">
        <label>Remark: {data[0]?.REMARK_REJECT}</label>
      </div>
    </>
  );
  const postAtwork = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setAtwork(1);
    } else {
      setAtwork(0);
    }
  };

  let status1_label =
    token?.role === "ADMIN" ? (
      <div className="nice-form-group">
        <label id="guideForm">Selection PIC :</label>
        <div className="row">
          <div className="col-6">
            <Select
              id={"selected_pic"}
              onChange={handleChange}
              placeholder="Select PIC"
              style={{ width: "100%" }}
              options={options}
            />
          </div>
          <div className="col-6">
            <input
              type="checkbox"
              onChange={postAtwork}
              className="custom-checkbox"
            />
            <label className="custom-label">&nbsp; Post to @Work</label>
          </div>
        </div>
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
        {status === 2 && token ? (
          <>
            <label id="guideForm">Counter measure :</label>
            <textarea id="action"></textarea>
          </>
        ) : (
          <>
            <label id="guideForm">Counter measure :</label>
            <textarea id="action" disabled>
              {data[0].ACTION}
            </textarea>
          </>
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
          <textarea id="remark" disabled>
            {data[0].REMARK_DETAIL}
          </textarea>
        </div>
      )}

      <div className="row">
        <div className="col-6 mt-3">
          {status >= 2 && status < 6 && token ? (
            <>
              <Form.Group controlId="date_picker">
                <FormLabel>Pick your expected due date:</FormLabel>
                <FormControl
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]} // Use ISOString for REST API
                  onChange={handleDateChange}
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group controlId="date_picker">
              <FormLabel>Due date:</FormLabel>
              <FormControl
                value={data[0].F_DUE} // Use ISOString for REST API
                onChange={handleDateChange}
                disabled
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
  } else if (status >= 2 && status < 6) {
    showLabel = status2_label;
  }

  let button_comp = (
    <details>
      <summary>
        <div className="row">
          <div className="col-6 d-flex align-items-start justify-content-start">
            {status === 1 || status === 2 ? (
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

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    const value = e.target.value;

    if (value === "อื่นๆ") {
      const otherValue = document.getElementById("inpOther").value;
      setCheckedValues((prevValues) => {
        if (isChecked) {
          if (!prevValues.includes(otherValue)) {
            return [...prevValues, otherValue];
          }
        } else {
          return prevValues.filter((v) => v !== otherValue);
        }
      });
    } else {
      setCheckedValues((prevValues) => {
        if (isChecked) {
          if (!prevValues.includes(value)) {
            return [...prevValues, value];
          }
        } else {
          return prevValues.filter((v) => v !== value);
        }
      });
    }
    console.log(checkedValues);
  };

  const handleLabelClick = (e) => {
    const input = e.target.previousSibling;
    if (input.type === "checkbox") {
      input.click();
    }
  };

  let risk_mode = (
    <>
      <div className="nice-form-group">
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {CHECKBOX_OPTIONS.slice(0, 5).map((option, index) => (
            <small>
              <div key={option.value} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checkedValues.includes(option.value)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.value} onClick={handleLabelClick}>
                  &nbsp; {option.label} &nbsp;
                </label>
              </div>
            </small>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {CHECKBOX_OPTIONS.slice(5, 9).map((option, index) => (
            <small>
              <div key={option.value} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checkedValues.includes(option.value)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={option.value} onClick={handleLabelClick}>
                  &nbsp; {option.label} &nbsp;
                </label>
              </div>
            </small>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {CHECKBOX_OPTIONS.slice(9).map((option, index) => (
            <div key={option.value} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                value={option.value}
                checked={checkedValues.includes(option.value)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={option.value} onClick={handleLabelClick}>
                &nbsp;{option.label} &nbsp;
              </label>
            </div>
          ))}
        </div>
        <small>
          <div>
            อื่นๆ &nbsp;
            <input
              autocomplete="off"
              onChange={(e) => {
                setFindedOther(e.target.value);
                console.log(findedOther);
              }}
              id="inpOther"
              placeholder="โปรดระบุ"
              value={findedOther}
            />
          </div>
        </small>
      </div>
    </>
  );
  console.log(data[0]);
  return (
    <div className="container">
      <div className="demo-page" style={{ color: "#000000" }}>
        <main className="demo-page-content">
          <section>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ padding: "0px 0px 20px 0px" }}
            >
              <img src={slogan} alt="slogan_m" style={{ width: "10rem" }} />
            </div>
            <div className="href-target" id="structure"></div>
            {status === 6 ? reject_bar : progress_bar}
            <div style={{ padding: "0px 55px 0px 55px" }}>
              <h1 style={{ padding: "15px 0px 15px 0px" }}>
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
                <b style={{ color: "" }}>
                  {" "}
                  Risk Location :{" "}
                  {data[0] ? data[0].LOCATION_NAME : "Undefinded"}
                </b>
              </h1>
              <div>
                <div className="nice-form-group">
                  <label id="formID">Request ID :</label>
                  <small>{req_id ? req_id.req_id : "Undefinded"}</small>
                </div>
                <div className="nice-form-group">
                  <label id="timeForm">Request Time :</label>
                  <small>{data ? data[0].F_DATETIME : "Undefinded"}</small>
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
                  <textarea
                    autocomplete="off"
                    id="inp_detail"
                    style={{ width: "80%" }}
                    value={inpDetail}
                    onChange={(e) => setInpDetail(e.target.value)}
                    disabled={
                      status === 1 && token?.role === "ADMIN" ? false : true
                    }
                  />
                </div>
                <div className="nice-form-group">
                  <label id="modeForm">Mode of risk : </label>
                  {/* <small>{data ? data[0].TYPE : "Undefinded"}</small> */}
                  {status === 1 && token?.role === "ADMIN" ? (
                    risk_mode
                  ) : (
                    <small>{data ? data[0].TYPE : "Undefinded"}</small>
                  )}
                </div>
                <div className="nice-form-group">
                  <label id="rankForm">Rank of risk : </label>
                  <div className="nice-form-group">
                    {status === 1 && token?.role === "ADMIN" ? (
                      <Select
                        id={"risk_level"}
                        onChange={(e) => {
                          setInitRisk(e[0].label);
                          console.log(initRisk);
                        }}
                        placeholder="Risk level"
                        style={{ width: "80%" }}
                        values={[
                          {
                            label: initRisk,
                          },
                        ]}
                        options={[
                          {
                            value: 1,
                            label:
                              "ระดับ 1 (ต่ำ) : สามารถปฐมพยาบาลได้ ไม่จำเป็นต้องได้รับการรักษาโดยแพทย์",
                          },
                          {
                            value: 2,
                            label:
                              "ระดับ 2 (กลาง) : จำเป็นต้องได้รับการรักษาโดยแพทย์ ที่โรงพยาบาล",
                          },
                          {
                            value: 3,
                            label:
                              "ระดับ 3 (สูง) : อาจได้รับบาดเจ็บถึงขึ้นเสียชีวิต พิการ หรือทุพลภาพ",
                          },
                        ]}
                      />
                    ) : (
                      <small>{data ? data[0].RISK_LEVEL : "Undefinded"}</small>
                    )}
                  </div>
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
                          <div className="nice-form-group">
                            <label>Image of risk : </label>
                          </div>
                        </th>
                        <th>
                          {status >= 4 && status < 6 ? (
                            <div className="nice-form-group">
                              <label id="rankForm">Image after : </label>
                            </div>
                          ) : (
                            ""
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="pe-5">
                          <Col>{riskImageComp}</Col>
                        </td>
                        <td>
                          {/* <img src={`data:image/png;base64,${image_after}`} alt="after"/> */}
                          <Col>
                            {status >= 4 && status < 6 ? (
                              <Image
                                style={{ width: "10rem", height: "10rem" }}
                                src={
                                  `data:image/png;base64,${image_after}` ===
                                  undefined
                                    ? `data:image/png;base64,${image_after}`
                                    : img_404
                                }
                                alt="test_image"
                                rounded="True"
                                onClick={() => {
                                  Swal.fire({
                                    imageUrl:
                                      `data:image/png;base64,${image_after}` ===
                                      undefined
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
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                detail: inpDetail,
                type: checkedValues.concat(findedOther),
                risk_level: initRisk,
                atwork: atwork,
                location: data[0].LOCATION_NAME,
                EMP_CD: data[0].EMP_CD,
                RISK_GUIDE: data[0]?.REMARK,
                IMG: data[0].IMG,
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
        axios
          .post(
            api_service + "/cfrm/2",
            {
              idReq: req_id.req_id[0],
              remark_reject: remark,
              status: tempStatus,
              cfrm_id: token.id,
              type: data[0].TYPE,
              detail: inpDetail,
              risk_level: initRisk,
            },
            {
              headers: {
                Authorization: token.token,
              },
            }
          )
          .then((res) => {
            // console.log(res)
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
              type: data[0].TYPE,
              detail: inpDetail,
              risk_level: initRisk,
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
      if (picture && document.getElementById("remark").value) {
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
                type: data[0].TYPE,
                detail: inpDetail,
                risk_level: initRisk,
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
      } else {
        MySwal.fire({
          title: "PIC",
          text: "Please insert remark and image",
          icon: "error",
        });
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
              type: data[0].TYPE,
              detail: inpDetail,
              risk_level: initRisk,
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
