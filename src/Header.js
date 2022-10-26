import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("user-info");
    navigate("/login");
  };

  return (
    <div>
      <Navbar className="color-nav">
        <Container>
          <Navbar.Brand href="/">SapiNotes</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/profile">My Profile</Nav.Link>
            <Nav.Link href="/notes">My Notes</Nav.Link>
            <Nav.Link href="/addnote">Add A Note</Nav.Link>
          </Nav>

          <Button variant="secondary" onClick={handleLogoutClick}>
            Logout
          </Button>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
