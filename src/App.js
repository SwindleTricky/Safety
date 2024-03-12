import "./App.css";
import "./index.css";
import { Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import pe_image from "./images/PE.png";
import img_404 from "./images/404_img.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function App() {
  let urlParm = parseURLParams(window.location.href);
  const token = JSON.parse(localStorage.getItem("token"));
  const api_service = process.env.REACT_APP_API_SERVICE;
  const [data, setData] = useState();
  const [data_length, setData_length] = useState(null);
  const [Load, setLoad] = useState(true);
  const [inputsearch, setInputSearch] = useState("");
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    async function fetchdata() {
      try {
        if (urlParm?.uid) {
          await axios
            .post(
              api_service + "/piclist",
              {
                id: urlParm.uid[0],
              },
              {
                headers: {
                  Authorization: token.token,
                },
              }
            )
            .catch((error) => {
              MySwal.fire({
                title: "ERROR " + error.response.status,
                text:
                  error.response.status === 401
                    ? "Session expired"
                    : error.response.statusText,
                icon: "error",
              }).then((result) => {
                if (result.isConfirmed || result.dismiss) {
                  localStorage.clear();
                  window.location.href("/");
                }
              });
            })
            .then((res) => {
              setData(res.data);
              setData_length(res.data.length);
            });
        } else {
          await axios.get(api_service + "/sovereq").then((response) => {
            setData(response.data);
            setData_length(response.data.length);
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchdata();
  }, [api_service]);
  useEffect(() => {
    if (data !== undefined) {
      setLoad(false);
    }
  }, [data]);

  if (Load) {
    console.log("LOADING..");
    return <div>Load.... . .. . . </div>;
  }
  // let data_svoe = data.svoe
  let page;
  
  if (urlParm?.page) {
    // console.log(page.page[0]);
    page = urlParm?.page[0];
  } else {
    page = 1;
  }

  let active = parseInt(page);
  let items = [];
  for (let number = 1; number <= Math.ceil(data_length / 5); number++) {
    let pages = "?page=" + number;
    items.push(
      <Pagination.Item key={number} href={pages} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }
  let allPage = page * 5;
  let stPage = allPage - 5;

  let dataPerPage = [];
  let imgID;
  let imgURL;

  const countByStatus = {
    1: 0, // Issue
    2: 0, // Approve
    3: 0, // Pic Confirm
    4: 0, // Finish
    5: 0, // Final Approve
    6: 0, // Reject
  };

  data.forEach((e) => {
    countByStatus[e.STATUS] += 1;
  });

  const issue = countByStatus[1];
  const approve = countByStatus[2];
  const picConfirm = countByStatus[3];
  const finish = countByStatus[4];
  const finalApprove = countByStatus[5];
  // const reject = countByStatus[6];

  let searchHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    console.log(lowerCase);
    setInputSearch(lowerCase);
  };

  for (let i = stPage; i < allPage; i++) {
    if (i < data_length) {
      if (data[i].IMG) {
        imgID = parseURLParams(data[i].IMG);
        imgURL = "https://drive.google.com/thumbnail?id=" + imgID.id;
      }
      dataPerPage.push(
        <Link to={"./form?req_id=" + data[i].REQ_ID}>
          <div className="card mt-2 card-custom" key={data[i.REQ_ID]}>
            <div
              className="card-body card-body-custom"
              style={{ color: "white" }}
            >
              <div className="row">
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img
                    src={imgURL ? imgURL : img_404}
                    alt="pe"
                    style={{ width: "10rem", height: "10rem" }}
                  />
                </div>
                <div className="col-9">
                  <div className="row">
                    <div className="col-6">
                      <h4>{data[i].LOCATION_NAME}</h4>
                    </div>
                    <div className="col-6 d-flex align-items-end justify-content-end"></div>
                  </div>
                  <div className="nice-form-group">
                    <label id="timeForm">Detail: {data[i].DETAIL}</label>
                    <label id="timeForm">Type: {data[i].TYPE}</label>
                    <label id="timeForm">
                      Risk level: {data[i].RISK_LEVEL}
                    </label>
                    <label id="timeForm">requestor: {data[i].EMP_CD}</label>
                    <div className="d-flex align-items-end justify-content-end">
                      <label
                        className={`status-${
                          data[i].STATUS === 1
                            ? "issue"
                            : data[i].STATUS === 2
                            ? "approve"
                            : data[i].STATUS === 3
                            ? "confirm"
                            : data[i].STATUS === 4
                            ? "finish"
                            : data[i].STATUS === 5
                            ? "fapprove"
                            : data[i].STATUS === 6
                            ? "reject"
                            : "Unknown data"
                        }`}
                        id="timeForm"
                      >
                        {data[i].STATUS === 1
                          ? "Issued"
                          : data[i].STATUS === 2
                          ? "Approved"
                          : data[i].STATUS === 3
                          ? "PIC Confirm"
                          : data[i].STATUS === 4
                          ? "Finish"
                          : data[i].STATUS === 5
                          ? "Final approve"
                          : data[i].STATUS === 6
                          ? "Reject"
                          : "Unknown data"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    }
  }

  const paginationBasic = (
    <div className="d-flex align-items-center justify-content-center mt-3">
      <Pagination size="sm">{items}</Pagination>
    </div>
  );

  return (
    <div className="background-custom">
      <div className="container">
        <div className="row mt-2">
          <div className="col-xl-3">
            <div className="card text-left">
              <div
                id="status_card"
                style={{ color: "white" }}
                className="card-body card-body-custom"
              >
                <p
                  onClick={() => {
                    window.location.replace("?issue");
                  }}
                >
                  Issue: {issue}
                </p>
                <p>Approve: {approve}</p>
                <p>PIC confirm: {picConfirm}</p>
                <p>Finish: {finish}</p>
                <p>Final Approve: {finalApprove}</p>
                {/* <p>Reject: {reject}</p> */}
              </div>
            </div>
          </div>
          <div className="col-xl-9">
            <div className="card text-center">
              <div className="card-body card-body-custom">
                <div>
                  <div className="row">
                    <div className="col-10">
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Control
                          className="input-custom"
                          type="email"
                          placeholder="Input keyword for search"
                          onChange={searchHandler}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-2">
                      <Button
                        className="button-custom"
                        variant="warning"
                        style={{ width: "100%" }}
                      >
                        {" "}
                        Search{" "}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {dataPerPage}
          </div>
        </div>
        {paginationBasic}
      </div>
    </div>
  );
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
}

export default App;
