import React from 'react'
import Card from '../Card/Card'
import './RegisterLoginForm.css'
import {
  FieldGroup,
  FormGroup,
  Form,
  ControlLabel,
  FormControl,
  Checkbox,
  PageHeader,
  HelpBlock,
  Col,
  Row,
  Button,
  Radio,
  Alert,
} from 'react-bootstrap'
import DatePicker from 'react-date-picker'
import Auth from '../../providers/auth'
import MeTwo from '../../providers/me'
import Toaster from '../../providers/toaster'
import { Redirect } from 'react-router'
import FormElements from '../../utils/form'

export const registerTitle = "Register a new account"
export const loginTitle = "Login"
const commonFields = [
  {name: 'username',helptext: 'Username is required'}]
const registerFieldsConfig = [
  {name: "username",type: "text"},
  {name: "password",type: 'password'},
  {name: 'gender',type: 'radio',choices: ['M','F']},
  {name: 'dob',displayName: 'Date of Birth',type: "date"},
  {name: 'descriptions',type: "textarea"}
]
const loginFieldsConfig = [
  {name: "username",type: "text"},
  {name: "password",type: 'password'},
  {name: 'remember',type: 'checkbox',text: 'Remember me'}
]
const registerFields = registerFieldsConfig.map(field => field.name)
const loginFields = loginFieldsConfig.map(field => field.name)

export default class RegisterLoginForm extends React.Component {
  /*
    Expected props:
      onSubmit,
      isRegsiter
  */
  constructor(props) {
    super(props)
    this.config = this.props.isRegister?registerFieldsConfig:loginFieldsConfig
    let fields = this.props.isRegister?registerFields:loginFields
    this.fields = fields
    // flag for triggering redirection
    /*
      State structure:
      {
        formSubmitSuccessful: boolean,
        hasChanged: {
          field1: boolean,
          ...
        },
        field1: <value>,
        ...
      }

    */
    this.state = {
      shouldRedirectToMePage: false,
      formSubmitMessage: null,
      hasChanged: fields.map(field => ({[field]: false})),
      userProfileImage: "https://react-bootstrap.github.io/thumbnail.png"
    }
  }
  async submitForm(e) {
    e.preventDefault()
    let fields = this.props.isRegister?registerFields:loginFields
    let payload = {}
    for (let i in fields) {
      let field = fields[i]
      if(!Object.keys(this.state).indexOf(field)) {
        // trigger the invalidation of this field
        this.setState(Object.assign({},this.state,{hasChanged: {[fields]: true}}))
        return // stop the form from submitting
      }
      payload[field] = this.state[field]
    }
    payload["isPremium"] = false
    payload["picturePath"] = this.state.userProfileImage
    // register / login
    let authProvider = Auth.getInstance()

    let result = null

    // submit form according to registration / login
    if(this.props.isRegister) {
      result = await authProvider.register(payload)
    } else {
      result = await authProvider.login(payload)
    }

    // check the result
    let message = null
    if(!result) {
      if(this.props.isRegister) {
        message = 'registerFailed'
      } else {
        message = 'loginFailed'
      }
    } else {
      this.props.onSuccess()
      if(this.props.isRegister) {
        message = 'registerSuccess'
      } else {
        message = 'loginSuccess'
      }
    }
    // show a message instead of redirect
    this.setState(Object.assign({},this.state,{
      formSubmitMessage: message
    }))

  }
  updateValue(e,field) {
    this.setState(
      Object.assign({},this.state,{

        [field]: e.target.value,
        hasChanged: {
          [field]:true
        }
      })
    )
  }
  getValidationState(field) {
    if(this.state.hasChanged[field] && (!this.state[field] || this.state[field].length == 0)) return 'error'
    return null
  }

  getFormElement(input) {
    if(input.type == 'checkbox') return FormElements.checkboxElement(input,this.state,this.updateValue.bind(this))
    if(input.type == 'radio') return FormElements.radioElement(input,this.state,this.updateValue.bind(this))
    if(input.type == 'date') return FormElements.dateElement(input,this.state,this.updateValue.bind(this))
    if(input.type == 'textarea') return FormElements.textareaElement(input,this.state,this.updateValue.bind(this))
    return FormElements.textElement(input,this.state,this.getValidationState.bind(this),this.updateValue.bind(this))
  }

  formSubmitMessageElement() {
    let message = this.state.formSubmitMessage
    if(message == 'registerSuccess') {
      return (
        <Alert bsStyle="success">
          <h4>Registration Success!</h4>
          <p> Welcome to FindA! Now you can choose to</p>
          <p>
            <Button bsStyle="primary" onClick={() => <Redirect to='/home/offers'/>}> View peoples offers </Button>
              or
            <Button onClick={() => <Redirect to='/me'/>}> Go to your profile </Button>
          </p>
        </Alert>
      )
    }
    if(message == 'registerFailed') {
      return (
        <Alert bsStyle="danger">
          <strong> Registration Failed!</strong> Perhaps the username has been registered, or you simply have no Internet connection...
        </Alert>
      )
    }
    if(message == 'loginFailed') {
      return (
        <Alert bsStyle="danger">
          <strong> Login Failed! </strong> You gave an incorrect username or password, or both...
        </Alert>
      )
    }

    if(message == 'loginSuccess') {
      // <Redirect to="/me">
      // trigger the redirect after 3 seconds...
      // setTimeout(() => {
      //   this.shouldRedirectToMePage = true
      // },3000)
      return (
          <Redirect to="/me" />
      )
    }

  }

  resetForm() {
    this.setState(Object.assign({},this.state,
      ...this.fields.map(field => {field: null})
    ))
  }
  redirectToMe() {
    this.setState(Object.assign({},this.state,{shouldRedirectToMePage: true}))
  }
  addPageHeader(){
    return(
      <Row>
        <PageHeader>
          {this.props.isRegister?"Register a new account":"Login"}
        </PageHeader>
      </Row>
    )
  }

  addFileUpload() {
    if(this.props.isRegister) {
      return(
          <input type="file" onChange={(evt) => this.uploadUserImage(evt)} />
      )
    } else {
      return null
    }
  }

  async uploadUserImage(fileInput) {
    let file = fileInput.target.files[0];

    console.log(file);
    let meProvider = MeTwo.getInstance();
    let result = null;
    result = await meProvider.uploadUserImageTwo(file, this.state["username"] + ".png");
    result = result.replace('"', '');
    result = result.replace('"', '');
    this.setState(Object.assign({},this.state,{userProfileImage: 'http://localhost:3000/' + result}))
    console.log('Received file path...   ' + 'http://localhost:3000/' + result.replace('"', ''))
  }

  render() {
    // you dont need another registration / login when you have logged in
    if (Auth.getInstance().isLoggedIn()) {
      setTimeout(function(){this.redirectToMe()}.bind(this), 3000)
      return (
        <div>
          {this.shouldRedirectToMePage?<Redirect to="/me" />:null}
        <Redirect to="/me" />
        </div>
      )
    }
    return (
      <div>
        {this.addPageHeader()}
        {(this.state.formSubmitMessage)?(this.formSubmitMessageElement.bind(this)()):null}
        <Card className="FormContainer" bsSize="large">
          <Form horizontal>
            {this.config.map(this.getFormElement.bind(this))}
            {this.addFileUpload()}

            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button bsStyle="primary" type="submit" onClick={this.submitForm.bind(this)}>{this.props.isRegister?"Register":"Login"}</Button>
              </Col>
            </FormGroup>
          </Form>
        </Card>
      </div>
    )
  }
}
