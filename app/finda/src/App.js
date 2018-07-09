import React from 'react';
import { Router, Route, Link,BrowserRouter} from 'react-router-dom'
import { Redirect } from 'react-router'
import NavBar from './components/NavBar/NavBar'
import Ads from './components/Ads/Ads'
import RegisterLoginForm from './components/RegisterLoginForm/RegisterLoginForm'
import ItemsListPage from './components/ItemsListPage/ItemsListPage'
import logo from './logo.svg';
import './App.css';
import ContentRoutes from "./routes"
import {apiURL} from "./config"
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap'
import { ToastContainer } from "react-toastr";
import Toaster from './providers/toaster';
import Auth from './providers/auth';
import Me from './providers/me';
import MeComponent from './components/Me/Me';
import Http from './providers/http';
import ItemList from "./components/ItemList";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.auth = Auth.getInstance();
    this.me = Me.getInstance();
    this.state = {
      user: null,
        wants:[],
        offers:[],
        query:'',
        isOffers:true,
        category:'',
    };

      this.getWants();
      this.getOffers();

    this.setQuery=this.setQuery.bind(this);
    this.setIsOffers=this.setIsOffers.bind(this);
    this.setCategory=this.setCategory.bind(this);


    this.routeParams = {
      "/login": {
        onSuccess: this.updateUser.bind(this)
      },
      "/register": {
        onSuccess: this.updateUser.bind(this)
      },
      "/me/wants": {
        user: this.state.user
      },
      "/me/offers": {
        user: this.state.user
      },"/listtest":{
      user:this.state.user,
            wants:this.state.wants,
            query:this.state.query,
            test:"testList:",
            isOffers:this.state.isOffers
    }
    };
    this.logout = this.logout.bind(this);
    // get user info first
    this.updateUser();
  };


  setQuery(q){

      if(this.state.isOffers)
      {
          this.setState({
              query:q,

          },this.getOffers);
      }else {
          this.setState({
              query:q,

          },this.getWants);
      }


  }


    setCategory(c){

        if(this.state.isOffers)
        {
            this.setState({
                category:c,

            },this.getOffers);
        }else {
            this.setState({
                category:c,

            },this.getWants);
        }


    }


  setIsOffers(o){
    this.setState((state)=>({
    isOffers:o,
    }))
      console.log("o: "+o);
    console.log("App.state.isOffers: "+ this.state.isOffers)
  }



    componentWillMount(){
        this.getWants();
        this.getOffers();

        //this.getOffers();
    };

   getWants()
   {
       this.getWantsP().then((data) => {
           this.setState({
               wants: [...data],
           });


       }).catch((e) => {
           console.error(e);
       });
   };


    getOffers()
    {
        this.getOffersP().then((data) => {
            this.setState({
                offers: [...data],
            });


        }).catch((e) => {
            console.error(e);
        });
    };


    getWantsP() {

       return new Promise((res,rej)=>{
          Http.get2(`${apiURL}/wants/?search=${this.state.query}&category=${this.state.category}`,function(data){
              res(data);
          })

       })

    };



    getOffersP() {

        // console.log(`${apiURL}/wats/?search=${this.state.query}`);
        return new Promise((res,rej)=>{
            Http.get2(`${apiURL}/offers/?search=${this.state.query}&category=${this.state.category}`,function(data){
                res(data);
            })

        })

    };

    componentDidMount(){
        this.getWants();
        this.getOffers();

    };





  logout() {
    // remove token
    this.auth.logout()
    // remove user object
    this.setState(Object.assign({},this.state,{user: null}))
    return <Redirect to='/home' />
  }
  updateUser() {
    this.me.getUser()
      .then(user => {
        this.setState(Object.assign({},this.state,{user}))
      })
  }


  render() {
    return (
      <BrowserRouter>
        <div className="App">
            <ToastContainer
              ref={ref => Toaster.getInstance().setRef(ref)}
              className="toast-top-right"
            />

            <NavBar
              user={this.state.user}
              logout={this.logout}
              data={this.state.wants}
              setQuery = {this.setQuery}
              isOffers={this.state.isOffers}
              setIsOffers={this.setIsOffers}
              setCategory={this.setCategory}
              category={this.state.category}
            />



            <Grid className="Section">
              <Row>
                  <Ads aImage="http://localhost:3000/uploads/2018-07-05T09:56:34.914Zads11.jpg"></Ads>

                <Col md={6} lg={6}>
                  <Row style={{height:"100vh",marginBottom:8}}>
                    <Route
                      path="/login"
                      exact={true}
                      render={() => <RegisterLoginForm isRegister={false} onSuccess={this.updateUser.bind(this)} />}
                    />
                    <Route
                      path="/register"
                      exact={true}
                      render={() => <RegisterLoginForm isRegister={true} onSuccess={this.updateUser.bind(this)} />}
                    />
                    <Route
                      path="/me"
                      exact={true}
                      render={() => <MeComponent isMe={true} user={this.state.user} />}
                    />
                    <Route
                      path="/me/wants"
                      exact={true}
                      render={() => <ItemsListPage isMe={true} isForWant={true} isForGroup={false} user={this.state.user} />}
                    />
                    <Route
                      path="/me/offers"
                      exact={true}
                      render={() => <ItemsListPage isMe={true} isForWant={false} isForGroup={false} user={this.state.user} />}
                    />
                    <Route
                      path="/me/groups"
                      exact={true}
                      render={() => <ItemsListPage isMe={true} isForWant={false} isForGroup={true} user={this.state.user} />}
                    />
                    <Route
                     path="/home"
                     render={()=><ItemList  user={this.state.user} wants={this.state.wants} query={this.state.query} isOffers={this.state.isOffers} offers={this.state.offers} test="test" category={this.state.category}/>}
                    />
                        <Route
                        exact path="/"
                        render={()=><Redirect to="/home"/>}
                        />






      </Row>
      </Col>

      <Ads aImage="http://localhost:3000/uploads/2018-07-05T09:57:38.303Zads2.jpg"/>
      </Row>
      </Grid>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
