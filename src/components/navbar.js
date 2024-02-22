import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../index.css";
import React from "react";

function Navbarcomp() {
  const logOut = () => {
    localStorage.clear();
    window.location.reload()
  };
  let isLogin
  
  if (localStorage.getItem("token") !== null) {
    console.log("have token");
    let account = JSON.parse(localStorage.getItem("token"));
    const name = account.name.split(" ");
    isLogin = (
      <NavDropdown title={`Hello, ${name[0]}`} id="navbarScrollingDropdown">
        <NavDropdown.Item href="#action3">My Account</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={logOut}>Log out</NavDropdown.Item>
      </NavDropdown>
    );
  } else {
    console.log("don't have token");
    isLogin = (<Nav.Link href="/login">Log in</Nav.Link>);
  }
  // console.log(isLogin)

  return (
    <>
      <Navbar className="Nav-color" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/" style={{ color: "#337a2c" }}>
            SVOE
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/detail">Detail</Nav.Link>
          </Nav>
          <Nav>{isLogin}</Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarcomp;
