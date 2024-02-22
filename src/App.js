import "./App.css";
import { Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import pe_image from "./images/PE.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";

function App() {
  const api_service = process.env.REACT_APP_API_SERVICE;

  const [data, setData] = useState();
  const [data_length, setData_length] = useState(null);
  const [Load, setLoad] = useState(true);
  useEffect(() => {
    async function fetchdata() {
      try {
        // await axios.get("http://localhost:300/svoe_list").then((response) => {
        await axios.get(api_service + "/sovereq").then((response) => {
          // console.log(response.data);
          setData(response.data);
          setData_length(response.data.length);

          // console.log(response.data.length)
        });
      } catch (err) {
        console.log(err);
        // throw err;
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
  var page = parseURLParams(window.location.href);
  if (page) {
    // console.log(page.page[0]);
    page = page.page[0];
  } else {
    page = 1;
  }
  // console.log(page);

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

  // let issue = 0,
  //   approve = 0,
  //   picConfirm = 0,
  //   finish = 0,
  //   finalApprove = 0,
  //   reject = 0;
  // data.map((e) => {
  //   if (e.STATUS === 1) {
  //     issue += 1;
  //   } else if (e.STATUS === 2) {
  //     approve += 1;
  //   } else if (e.STATUS === 3) {
  //     picConfirm += 1;
  //   } else if (e.STATUS === 4) {
  //     finish += 1;
  //   } else if (e.STATUS === 5) {
  //     finalApprove += 1;
  //   } else if (e.STATUS === 6) {
  //     reject += 1;
  //   }
  // });

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
  const reject = countByStatus[6];

  for (let i = stPage; i < allPage; i++) {
    if (i < data_length) {
      if (data[i].IMG) {
        imgID = parseURLParams(data[i].IMG);
        imgURL = "https://drive.google.com/thumbnail?id=" + imgID.id;
        // imgURL = "https://drive.google.com/uc?export=view&id="+imgID.id
      }
      dataPerPage.push(
        <Link to={"./form?req_id=" + data[i].REQ_ID}>
          <div className="card mt-2 card-custom" key={data[i.REQ_ID]}>
            <div
              className="card-body card-body-custom"
              style={{ color: "white" }}
            >
              <table className="tg">
                <thead>
                  <tr>
                    <td className="tg-baqh" rowSpan="2" width="25%">
                      <Col>
                        <img
                          style={{ width: "10rem" }}
                          // src={data[i].IMG ? data[i].IMG : pe_image}
                          src={imgURL ? imgURL : pe_image}
                          alt="test_image"
                          rounded="True"
                        />
                      </Col>
                    </td>
                    <td className="tg-0lax">
                      <font color="#1d6167">
                        <h4>{data[i].LOCATION_NAME}</h4>
                      </font>
                    </td>
                  </tr>
                  <tr>
                    <td className="tg-0lax">
                      <font color="#1d817e">
                        <h6>Detail: {data[i].DETAIL}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>Type: {data[i].TYPE}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>Risk level: {data[i].RISK_LEVEL}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>requestor: {data[i].EMP_CD}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>
                          status:{" "}
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
                        </h6>
                      </font>
                    </td>
                  </tr>
                </thead>
              </table>
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
                <p>Issue: {issue}</p>
                <p>Approve: {approve}</p>
                <p>PIC confirm: {picConfirm}</p>
                <p>Finish: {finish}</p>
                <p>Final Approve: {finalApprove}</p>
                <p>Reject: {reject}</p>
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
