import "../App.css";
import "../index.css";
import { Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import pe_image from "../images/PE.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";

const Newcard = () => {
  return (
    // <div className="container">
    //   <div className="card mt-2 card-custom" key={data[i.REQ_ID]}>
    //     <div className="card-body card-body-custom" style={{ color: "white" }}>
    //       <div className="row border">
    //         <div className="col-3 border d-flex align-items-center justify-content-center">
    //           <img src={imgURL ? imgURL : pe_image} alt="pe" style={{ width: "10rem" }} />
    //         </div>
    //         <div className="col-9 border">
    //           <h1>{data[i].LOCATION_NAME}</h1>
    //           <div className="nice-form-group">
    //             <label id="timeForm">Detail: {data[i].DETAIL}</label>
    //             <label id="timeForm">Type: {data[i].TYPE}</label>
    //             <label id="timeForm">Risk level: {data[i].RISK_LEVEL}</label>
    //             <label id="timeForm">requestor: {data[i].EMP_CD}</label>
    //             <label id="timeForm">
    //               status:{" "}
    //               {data[i].STATUS === 1
    //                 ? "Issued"
    //                 : data[i].STATUS === 2
    //                 ? "Approved"
    //                 : data[i].STATUS === 3
    //                 ? "PIC Confirm"
    //                 : data[i].STATUS === 4
    //                 ? "Finish"
    //                 : data[i].STATUS === 5
    //                 ? "Final approve"
    //                 : data[i].STATUS === 6
    //                 ? "Reject"
    //                 : "Unknown data"}
    //             </label>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

      <div className="card mt-2 card-custom">
        <div className="card-body card-body-custom" style={{ color: "white" }}>
          <table className="tg">
            <thead>
              <tr>
                <td className="tg-baqh" rowSpan="2" width="25%">
                  <Col>
                    <img
                      style={{ width: "10rem" }}
                      // src={data[i].IMG ? data[i].IMG : pe_image}
                      src={pe_image}
                      alt="test_image"
                      rounded="True"
                    />
                  </Col>
                </td>
                <td className="tg-0lax">
                  <font color="#1d6167">
                    <h4>Location name</h4>
                  </font>
                </td>
              </tr>
              <tr>
                <td className="tg-0lax">
                  <font color="#1d817e">
                    <h6>Detail: detail</h6>
                  </font>
                  <font color="#1d817e">
                    <h6>Type: ประเภท</h6>
                  </font>
                  <font color="#1d817e">
                    <h6>Risk level: ระดับความเสี่ยง</h6>
                  </font>
                  <font color="#1d817e">
                    <h6>requestor: 99999</h6>
                  </font>
                  <font color="#1d817e">
                    <h6>status: </h6>
                  </font>
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    // </div>
  );
};

export default Newcard;
