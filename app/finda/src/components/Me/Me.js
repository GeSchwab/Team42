import React from 'react'
import {Redirect} from 'react-router'
import {
  Form,
  Col,
  Row,
  Image,
  Badge,
  PageHeader,
  Button,
  Tabs,
  Tab
} from 'react-bootstrap'
import Auth from '../../providers/auth'
import Card from '../Card/Card'
import ItemCard from '../ItemCard/ItemCard'
import BackgroundNotice from '../BackgroundNotice/BackgroundNotice'
import MeTwo from '../../providers/me'
import './Me.css'
export default class Me extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userProfileImage: "https://react-bootstrap.github.io/thumbnail.png"
    }
  }

  userName() {
    if(this.props.user) return this.props.user.username
    return ''
  }

  userDescriptions() {
    if(this.props.user && this.props.user.descriptions) {
      return <p>{this.props.user.descriptions}</p>
    } else {
      return <p className="NoDescription"> This user has no descriptions yet </p>
    }
  }

  userWants() {
    return this.props.user.wants
  }

  userOffers() {
    return this.props.user.offers
  }

  numUserWants() {
    if(!this.props.user.wants) {
      return null;
    }
    else {
      return this.props.user.wants.length
    }
  }

  numUserOffers() {
    if(!this.props.user.offers) {
      return null;
    }
    else {
     return this.props.user.offers.length
    }
  }

  editProfileButton() {
    if(this.props.isMe) {
      return (
        <Row>
          <Button block>Edit Profile</Button>
        </Row>
      )
    }
  }

  async submitPremium(e) {
    e.preventDefault()

    let result = null
    result = await MeTwo.getInstance().toPremium()
    window.location.reload();
  }

  toPremiumButton() {
    if(!this.props.user.isPremium) return (
      <Button bsStyle="success" onClick={this.submitPremium.bind(this)}> To Premium </Button>
    )
  }

  async uploadUserImage(fileInput) {
    let file = fileInput.target.files[0];

    console.log(file);
    let meProvider = MeTwo.getInstance();
    let result = null;
    result = await meProvider.uploadUserImage(file, this.userName() + ".png");
    result = result.replace('"', '');
    result = result.replace('"', '');
    //this.state.userProfileImage = 'http://localhost:3000/' + result
    this.props.user.picturePath = 'http://localhost:3000/' + result;
    console.log('Received file path...   ' + 'http://localhost:3000/' + result.replace('"', ''))
  }

  wantsSection() {
    return (
      <div>
        <Row>
          <Col>
            {()=>{ if(!this.props.user.wants)
                  {
                  <BackgroundNotice title="This user has no wants" />
                  }
      else {
          <div className="ItemContainer">
              {this.userWants().map(want => (
                  <ItemCard want={want} />
              ))}
              </div>
            }}}
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              {this.props.isMe?<Button block bsSize="large" bsStyle="primary" href="/me/wants"> To my wants</Button>:null}
            </div>
          </Col>
        </Row>
      </div>

    )
  }

  offersSection() {
    return (
      <div>
        <Row>
          <Col>
        {()=>{ if(!this.props.user.offers) {
          ""
      }
      else
            {(this.userOffers().length > 0)?(<div className="ItemContainer">
                {this.userOffers().map(want => (
                    <ItemCard want={want} />
                ))}
              </div>):(
                <BackgroundNotice title={`This user has no offers`} />
              )
            }}}
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              {this.props.isMe?<Button block bsSize="large" bsStyle="primary" href="/me/offers"> To my offers</Button>:null}
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  groupsSection() {
    return (
      <div>
        <Row>
          <Col>
        {()=>{ if(!this.props.user.groups) {
          ""
      }
      else
            {(this.userGroups().length > 0)?(<div className="ItemContainer">
                {this.userGroups().map(want => (
                    <ItemCard want={want} />
                ))}
              </div>):(
                <BackgroundNotice title={`This user has no groups`} />
              )
            } }}
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              {this.props.isMe?<Button block bsSize="large" bsStyle="primary" href="/me/groups"> To my groups</Button>:null}
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  addUserInformation() {
    return (
      <div>
        <Row>
          <Col className="ThumbnailCol" xs={12} md={4} sm={4} lg={4}>
            <Image className="BigThumbnail" src={this.props.user.picturePath} circle />
            <Form>
              <input type="file" onChange={(evt) => this.uploadUserImage(evt)} />
            </Form>
          </Col>

          <Col className="NameCol" xs={12} md={8} sm={8} lg={8}>
            <Row>
              <h2>{this.userName()} ({this.props.user.isPremium?"":"Not "}Premium)</h2>
              <Badge>{this.numUserWants()} wants</Badge>
              <Badge>{this.numUserOffers()} offers</Badge>
            </Row>
            <Row>
              {this.userDescriptions()}
            </Row>
            <Row>
              <Col sm={6}>
                {this.editProfileButton()}
              </Col>
              <Col sm={6}>
                {this.toPremiumButton()}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }

  addUserStatus() {
    return (
      <div className="SubpageContainer">
        <Tabs>
          <Tab eventKey={1} title="Wants">
            {this.wantsSection()}
          </Tab>
          <Tab eventKey={2} title="Offers">
            {this.offersSection()}
          </Tab>
          <Tab eventKey={3} title="Groups">
            {this.groupsSection()}
          </Tab>
        </Tabs>
      </div>
    )
  }

  render() {
    if(!Auth.getInstance().isLoggedIn()) {
      return <Redirect to='/login' />
    }
    // logged in but user not loaded
    else if(!this.props.user) {
      return null
    }
    else {
      console.log(this.props.user)
      return (
        <Col>
          {this.addUserInformation()}
          {this.addUserStatus()}
        </Col>
      )
    }
  }
}
