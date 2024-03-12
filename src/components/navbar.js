import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../index.css";
import React, { useEffect, useState } from "react";

function Navbarcomp() {
  const [isLogin, setIsLogin] = useState();
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  }
  useEffect(()=>{
    let account;
    if (localStorage.getItem("token") !== null) {
    console.log("have token");
    account = JSON.parse(localStorage.getItem("token"));
    const name = account.name.split(" ");
    setIsLogin(
      <NavDropdown title={`Hello, ${name[0]}`} id="navbarScrollingDropdown">
        <NavDropdown.Item href={`/?uid=${account.id}`}>
          My Task
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={logOut}>Log out</NavDropdown.Item>
      </NavDropdown>
    );
  } else {
    console.log("don't have token");
    setIsLogin(<Nav.Link href="/login">Log in</Nav.Link>)
  }
  },[window.location.href])
  
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
            <Nav.Link href="/">Detail</Nav.Link>
          </Nav>
          <Nav>{isLogin}</Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarcomp;
