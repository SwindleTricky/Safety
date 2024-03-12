import "../App.css";
import { Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const PicList = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    window.location.replace("/");
  }
  const MySwal = withReactContent(Swal);
  const api_service = process.env.REACT_APP_API_SERVICE;
  const [dataPic, setDataPic] = useState();
  const [loaded, setLoaded] = useState(false);

  const cardComp = [];

  useEffect(() => {
    async function fetchdata() {
      try {
        const getList = await axios
          .post(
            api_service + "/piclist",
            {
              id: token.id,
            },
            {
              headers: {
                Authorization: token.token,
              },
            }
          )
          .catch((error) => {
            console.log(error.response);
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
                window.location.replace("/login");
              }
            });
          });
        setDataPic(getList.data);
        setLoaded(true);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchdata();
  }, [api_service]);
  if (!loaded) {
    return <div>load. ...</div>;
  }

  const countByStatus = {
    1: 0, // Issue
    2: 0, // Approve
    3: 0, // Pic Confirm
    4: 0, // Finish
    5: 0, // Final Approve
    6: 0, // Reject
  };

  dataPic.forEach((e) => {
    countByStatus[e.STATUS] += 1;
  });
  const issue = countByStatus[1];
  const approve = countByStatus[2];
  const picConfirm = countByStatus[3];
  const finish = countByStatus[4];
  const finalApprove = countByStatus[5];
  // const reject = countByStatus[6];

  dataPic.map((e) => {
    let imgURL =
      "https://drive.google.com/thumbnail?id=" +
      parseURLParams(e.IMG).id;
    cardComp.push(
      <>
        <Link to={"../form?req_id=" + e.REQ_ID}>
          <div className="card mt-2 card-custom" key={e.REQ_ID}>
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
                          src={imgURL}
                          alt="test_image"
                          rounded="True"
                        />
                      </Col>
                    </td>
                    <td className="tg-0lax">
                      <font color="#1d6167">
                        <h4>{e.LOCATION_NAME}</h4>
                      </font>
                    </td>
                  </tr>
                  <tr>
                    <td className="tg-0lax">
                      <font color="#1d817e">
                        <h6>Detail: {e.DETAIL}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>Type: {e.TYPE}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>Risk level: {e.RISK_LEVEL}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>requestor: {e.EMP_CD}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>
                          status:{" "}
                          {e.STATUS === 1
                            ? "Issued"
                            : e.STATUS === 2
                            ? "Approved"
                            : e.STATUS === 3
                            ? "PIC Confirm"
                            : e.STATUS === 4
                            ? "Finish"
                            : e.STATUS === 5
                            ? "Final approve"
                            : e.STATUS === 6
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
      </>
    );
  });
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
            {cardComp}
          </div>
        </div>
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
};

export default PicList;
