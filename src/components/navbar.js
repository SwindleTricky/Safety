import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../index.css";
import React, { useEffect, useState } from "react";

function Navbarcomp() {
  const [account, setAccount] = useState();
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  const urlParams = new URLSearchParams(window.location.search);
  const cap = urlParams.get("cap") ? urlParams.get("cap") : 0;
  useEffect(() => {
    async function getToken() {
      console.log("useEffect");
      const token = localStorage.getItem("token");
      if (token !== null) {
        console.log("have token");
        setAccount(JSON.parse(localStorage.getItem("token")));
      } else {
        console.log("don't have token");
      }
    }
    getToken();
  }, []);

  // console.log(isLogin)
  let isLogin;
  if (account !== undefined) {
    const name = account.name.split(" ");
    isLogin = (
      <NavDropdown title={`Hello, ${name[0]}`} id="navbarScrollingDropdown">
        <NavDropdown.Item href={`/?uid=${account.id}`}>
          My Task
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={logOut}>Log out</NavDropdown.Item>
      </NavDropdown>
    );
  } else {
    isLogin = (
      <Nav.Link
        onClick={() => {
          localStorage.setItem("prev", window.location.href);
          window.location.replace("/login");
        }}
      >
        Log in
      </Nav.Link>
    );
  }
  return (
    <>
      {parseInt(cap) === 1 ? (
        ""
      ) : (
        <Navbar data-bs-theme="light" style={{ backgroundColor: "#abd8ae" }} >
          <Container>
            <Navbar.Brand href="/" style={{ color: "rgb(27 43 26)" }}>
              <b>SVOE</b>
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="https://forms.gle/z5YBHqWoJQQ83bgQ6">Request Form</Nav.Link>
              <Nav.Link href="https://app.powerbi.com/reportEmbed?reportId=42a7e0b0-cd59-44eb-985f-7787cb53fdb5&autoAuth=true&ctid=afff1096-7fd8-4cdd-879a-7db50a47287a">Dashboard</Nav.Link>
            </Nav>
            <Nav>{isLogin}</Nav>
          </Container>
        </Navbar>
      )}
    </>
  );
}

export default Navbarcomp;
