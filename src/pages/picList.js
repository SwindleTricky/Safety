import "../App.css";
import { Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PicList = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    window.location.replace("/");
  }
  const api_service = process.env.REACT_APP_API_SERVICE;
  const [dataPic, setDataPic] = useState();
  const [loaded, setLoaded] = useState(false);

  const cardComp = [];

  useEffect(() => {
    async function fetchdata() {
      try {
        const getList = await axios.post(
          api_service + "/piclist",
          {
            id: token.id,
          },
          {
            headers: {
              Authorization: token.token,
            },
          }
        );
        setDataPic(getList.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoaded(true);
      }
    }
    fetchdata();
  }, [api_service]);
  if (!loaded) {
    return <div>return. ...</div>;
  }
  console.log(dataPic);
  //   console.log(dataPic);
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
  const reject = countByStatus[6];

  dataPic.map((e) => {
    let imgURL =
      "https://drive.google.com/thumbnail?id=" +
      parseURLParams(dataPic[0].IMG).id;
    cardComp.push(
      <>
        <Link to={"../form?req_id=" + dataPic[0].REQ_ID}>
          <div className="card mt-2 card-custom" key={dataPic[e.REQ_ID]}>
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
                        <h4>{dataPic[0].LOCATION_NAME}</h4>
                      </font>
                    </td>
                  </tr>
                  <tr>
                    <td className="tg-0lax">
                      <font color="#1d817e">
                        <h6>Detail: {dataPic[0].DETAIL}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>Type: {dataPic[0].TYPE}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>Risk level: {dataPic[0].RISK_LEVEL}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>requestor: {dataPic[0].EMP_CD}</h6>
                      </font>
                      <font color="#1d817e">
                        <h6>
                          status:{" "}
                          {dataPic[0].STATUS === 1
                            ? "Issued"
                            : dataPic[0].STATUS === 2
                            ? "Approved"
                            : dataPic[0].STATUS === 3
                            ? "PIC Confirm"
                            : dataPic[0].STATUS === 4
                            ? "Finish"
                            : dataPic[0].STATUS === 5
                            ? "Final approve"
                            : dataPic[0].STATUS === 6
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
              {cardComp}
            </div>
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
