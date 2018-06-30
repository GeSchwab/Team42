import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Image,
  Button,
  DropdownButton,
} from 'react-bootstrap'
import {Redirect} from 'react-router'
import Auth from '../../providers/auth'
import './NavBar.css'


export default class NavBar extends React.Component {
    state={

        searchResults:[],
        isOffers:this.props.isOffers,
        firstDropDownSelected:"Offers",
        firstDropDownSecond:"Wants",
        secondDropDownSelected:"All"
    }

  constructor(props) {
    super(props);
    this.firstDropDown=this.firstDropDown(this);
    //this.setState({isOffers:this.props.isOffers});

  }

  handleInputChange=()=>{
        this.setState({
            query:this.search.value
        },this.props.setQuery(this.search.value))

  }
  barRightItems() {
    if(Auth.getInstance().isLoggedIn()) {
      return (this.props.user?(
          <NavItem>
            <Image className="Thumbnail" src="https://react-bootstrap.github.io/thumbnail.png" circle />
            <Link to="/me">{this.props.user.username}</Link>
            <Button className="NavButton" onClick={this.props.logout}> Logout</Button>
          </NavItem>
        ): null
      )
    } else {
      return (
        <Navbar.Text>
          Please <Navbar.Link className="Login" href="/login"> login</Navbar.Link> or <Navbar.Link className="Register" href="/register"> Register </Navbar.Link>
        </Navbar.Text>
      )
    }
  }



  firstDropD(){

return(
  <NavDropdown id="firstDropDownTitle" title={this.state.firstDropDownSelected} >
  <MenuItem eventKey={11} id="firstDropDownItem" >{this.state.firstDropDownSecond}</MenuItem>
      </NavDropdown>
  )
  }

    firstDropDown(evt,evtKey){
        console.log("NavbarOnSelect");




    }

    secondDropDown()
    {
        this.setState({SecondDropDownSecond:"All"});
    }



  /*getWoOItems() {
      return (
        <NavDropdown onClick={() => this.props.users?"":<Redirect to='/login'/>} eventKey={1} title="Wants" id="basic-nav-dropdown">
          <MenuItem eventKey={1.1} href="/offers">Offers</MenuItem>
          <MenuItem divider />
          <MenuItem id="firstTwo" eventKey={1.2} href="/wants" onclick={document.getElementById(firstTwo).innerHTML }> Wants </MenuItem>
        </NavDropdown>
      )
  }
  getOffersItem() {
      return (
        <NavDropdown onClick={() => this.props.users?"":<Redirect to='/login'/>} eventKey={2} title="Offers" id="basic-nav-dropdown">
          <MenuItem eventKey={2.1} href="/me/offers">Me</MenuItem>
          <MenuItem divider />
          <MenuItem disabled> You have no groups </MenuItem>
        </NavDropdown>
      )
  }*/

  handleNavbarSelect(evt, evtK)
  {
      console.log("onSelect");
      console.log(this.state.isOffers);
      if(evt==11)
      {
          if(!this.state.isOffers)
          {
              this.setState({
                  firstDropDownSelected:"Wants",
                  firstDropDownSecond:"Offers",
                  isOffers:true

              },this.props.setIsOffers(this.state.isOffers));

              console.log("!isOffers");



          }
          else {


              this.setState({
                firstDropDownSelected:"Offers",
                firstDropDownSecond:"Wants",
                isOffers:false
                },this.props.setIsOffers(this.state.isOffers))

              console.log("isOffers/else");

          }
      }


  }
  render() {
    return (
      <Navbar inverse collapseOnSelect onSelect={this.handleNavbarSelect.bind(this)} >
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/home">FindA</a>
          </Navbar.Brand>
          <Navbar.Toggle />
          <input
            placeholder="Search for:"
            ref={input=>this.search=input}
            onChange={this.handleInputChange}
            />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav >

            {this.firstDropD()}


                <NavDropdown id="secondDropDownTitle" title="Categories">
                    <MenuItem id="secondDropDownItem1" href="/categories/Things">Things</MenuItem>
                    <MenuItem id="secondDropDownItem2" href="/categories/Groups">Groups</MenuItem>
                    <MenuItem id="secondDropDownItem2" href="/categories/CourseSlots">Course Slots</MenuItem>
                    <MenuItem id="secondDropDownItem2" href="/categories/Jobs">Jobs</MenuItem>
                    <MenuItem id="secondDropDownItem2" href="/categories/People">People</MenuItem>
                </NavDropdown>
            <NavItem eventKey={3}> Categories</NavItem>
          </Nav>
          <Nav className="NavRight" pullRight>
            {this.barRightItems()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }


}
