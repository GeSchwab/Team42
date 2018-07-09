import React from 'react'
import { Redirect } from 'react-router'
import {
  Col,
  Row,
  Image,
  Badge,
  PageHeader,
  Button,
  Form,
  FormGroup,
} from 'react-bootstrap'
import ItemCard from '../ItemCard/ItemCard'
import BackgroundNotice from '../BackgroundNotice/BackgroundNotice'
import Card from '../Card/Card'
import FormElements from '../../utils/form'
import Me from '../../providers/me'
import Auth from '../../providers/auth'
export default class ItemListPage extends React.Component {
  /*
    Expected props are as follows...
    -  isForWant: true/false,
    -  isMe: true / false,
    -  user: user object
  */
  constructor(props) {
    super(props)
    // this.questions = props.isForWant?this.wantQuestions:this.offerQuestions
    this.state = {
      hasChanged: this.getQuestions().map(field => ({[field]:false})),
      filePath: null,
      errorMsg: null
    }
  }

  getFormElement(input) {
    if(input.type == 'checkbox') return FormElements.checkboxElement(input,this.state,this.updateValue.bind(this))
    if(input.type == 'select') return FormElements.selectElement(input,this.state,this.updateValue.bind(this))
    if(input.type == 'radio') return FormElements.radioElement(input,this.state,this.updateValue.bind(this))
    if(input.type == 'date') return FormElements.dateElement(input,this.state,this.updateValue.bind(this))
    if(input.type == 'textarea') return FormElements.textareaElement(input,this.state,this.updateValue.bind(this),"Description of the item")
    return FormElements.textElement(input,this.state,this.getValidationState.bind(this),this.updateValue.bind(this))
  }
  getFormElement(input) {
    if(input.type == 'checkbox') {
      return FormElements.checkboxElement(input,this.state,this.updateValue.bind(this))
    }
    if(input.type == 'radio') {
      return FormElements.radioElement(input,this.state,this.updateValue.bind(this))
    }
    if(input.type == 'select') {
      return FormElements.selectElement(input,this.state,this.updateValue.bind(this))
    }
    if(input.type == 'date') {
      return FormElements.dateElement(input,this.state,this.updateValue.bind(this))
    }
    if(input.type == 'textarea') {
      return FormElements.textareaElement(input,this.state,this.updateValue.bind(this),"Description of the item")
    }
    return FormElements.textElement(input,this.state,this.getValidationState.bind(this),this.updateValue.bind(this))
  }

  getUserWants() {
    if(!this.props.user.wants){
      return [];
    }
    else{
        return this.props.user.wants
    }

  }
  getUserOffers() {
    if(!this.props.user.wants){
      return [];
    }
    else{
        return this.props.user.offers
    }
  }
  getUserGroups() {
    if(!this.props.user.groups){
      return [];
    }
    else{
        return this.props.user.groups
    }
  }






  getNrUserWants() {
    return this.userWants().length
  }
  getNrUserOffers() {
    return this.userOffers().length
  }
  getNrUserGroups() {
    return this.userGroups().length
  }
  getItemList() {
    return this.props.isForGroup?this.getUserGroups():(this.props.isForWant?this.getUserWants():this.getUserOffers())
  }




  getInputFieldValue(inputField) {
    return this.state[inputField]
  }
  getFieldToBoolean(field) {
    return (field=="Yes")?true:false
  }
  getPayload(inputFields) {
    let output = {}
    for (let inputFieldNr in inputFields) {
      let inputFieldName = inputFields[inputFieldNr]
      let field = this.getInputFieldValue(inputFieldName)
      if(!Object.keys(this.state).indexOf(field)) {
        // trigger the invalidation of this field
        this.setState(Object.assign({},this.state,{hasChanged: {[inputFields]: true}}))
        return // stop the form from submitting
      }
      output[inputFieldName] = field
    }

    //REMEMBER AIDAN
    if(!this.props.isForGroup && !this.props.isForWant) {
      output['images'] = this.state.filePath
    }
    return output
  }

  wantQuestions() {
    return [
      {name: "name",type: "text",},
      {name: "descriptions",type: "textarea"},
      {name: "category",type: "radio",choices: ["Things","People","Groups","Courses"]},

    ]
  }
  offerQuestions() {
    return [
      {name: "name",type: "text",},
      {name: "descriptions",type: "textarea",},
      {name: "category",type: "radio",choices: ["Things","People","Groups","Courses"]},
      {name: "price",type: "text"},
      {name: "amount",type: "text"},
      {name: "isInfinite",choices: ["true", "false"],type: "radio"}
    ]
  }
  groupQuestions() {
    return [
      {name: "groupname",type: "text",},
      {name: "descriptions",type: "textarea",}
    ]
  }
  getQuestions() {
    let questions = this.props.isForGroup?this.groupQuestions():(this.props.isForWant?this.wantQuestions():this.offerQuestions())
    return questions
  }

  getValidationState(field) {
    if(this.state.hasChanged[field] && (!this.state[field] || this.state[field].length == 0)) {
      return 'error'
    }
    return null
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

  //const config = this.props.isForWant?this.wantQuestions():this.offerQuestions()


  async addWantsOffers(payload) {
    let meProvider = Me.getInstance()
    let providerAnswer = null
    if(this.props.isForGroup) {
      providerAnswer = await meProvider.addGroups(payload)
    }
    else {
      if(this.props.isForWant) {
        providerAnswer = await meProvider.addWants(payload)
      }
      else {
        providerAnswer = await meProvider.addOffers(payload)
      }
    }
    return providerAnswer

  }
  // REMEMBER MARKUS
  async deleteWantsOffers(payload) {
    let meProvider = Me.getInstance()
    let providerAnswer = null
    if(this.props.isForWant) {
      providerAnswer = (await meProvider.deleteWants(payload))
    }
    else {
      providerAnswer = (await meProvider.deleteOffers(payload))
    }
    return providerAnswer
  }


  async submitAddForm(e) {
    e.preventDefault()

    let questions = this.getQuestions()
    let questionNames = questions.map(q => q.name)

    let payload = {}
    payload = this.getPayload(questionNames)

    let result = null
    result = await this.addWantsOffers(payload)

    if (this.props.isForGroup){
      console.log('Add Item')
      console.log('Name: ' + payload.groupname)
      console.log('Description: ' + payload.descriptions)
    }
    else {
      console.log('Add Item')
      console.log('Name: ' + payload.name)
      console.log('Description: ' + payload.descriptions)
      console.log('Category: ' + payload.category)
      console.log('Image: ' + payload.images)
      if(!this.props.isForWant) {
        console.log('Price: ' + payload.price)
        console.log('Amount: ' + payload.amount)
        console.log('Is Infinite: ' + payload.isInfinite)
      }
    }
      window.location.reload();
  }

  // REMEMBER MARKUS
  async submitDeleteForm(e,item) {
    e.preventDefault()

    let result = null
    result = await this.deleteWantsOffers(item)

    console.log('Delete Item')
    console.log('Name: ' + item.name)
    console.log('Description: ' + item.descriptions)
    console.log('Category: ' + item.category)
    console.log('Image: ' + item.images)
    if(!this.props.isForWant) {
      console.log('Price: ' + item.price)
      console.log('Amount: ' + item.amount)
      console.log('Is Infinite: ' + item.isInfinite)
    }
  }

  async validateForm(e) {
    e.preventDefault()
    this.setState({errorMsg : ""})
    let questions = this.getQuestions()
    let questionNames = questions.map(q => q.name)

    let errorMessage = ""

    for (let inputField in questionNames) {
      let inputFieldName = questionNames[inputField]
      console.log('inputField: ' + inputField + ':' + questionNames[inputField] + ":" + this.getInputFieldValue(inputFieldName))
      if(this.getInputFieldValue(inputFieldName) == undefined) {
        if(this.state.errorMsg == "") {
          this.setState({errorMsg : "Please fill out the following fields: "})
        }
        errorMessage += " " + questionNames[inputField] + " "
      } else {
        console.log('something here...')
      }
    }

    if(errorMessage == "") {
      this.submitAddForm(e)
    } else {
      this.setState({errorMsg : "Please fill out the following fields: " + errorMessage})
    }
  }

  showFileForm() {
    return (
      <Form>
        <input type="file" onChange={(evt) => this.readFile(evt)} />
      </Form>
    )
  }

  showNothing() {
    return (
      <div>
      </div>
    )
  }

  async readFile(fileInput) {
    let file = fileInput.target.files[0];
    console.log(file);
    //console.log(fileInput.target.value);
    //const file = fileInput.target.value;
    //const file = fileInput.files[0];
    let meProvider = Me.getInstance()
    let result = null
    result = await meProvider.uploadImage(file)
    result = result.replace('"', '')
    result = result.replace('"', '')
    this.state.filePath = 'http://localhost:3000/' + result
    console.log('Received file path...   ' + 'http://localhost:3000/' + result.replace('"', ''))
  }

  getMeTitleString(){
    let titleString = this.props.isForGroup?"Your groups":(this.props.isForWant?"Your wants":"Your offers")
    return titleString
  }
  getUserTitleString(){
    let titleString = this.props.isForGroup?`${this.props.user.username}'s groups`:(this.props.isForWant?`${this.props.user.username}'s wants`:`${this.props.user.username}'s offers`)
    return titleString
  }

  addPageHeader(){
    return(
      <Row>
        <PageHeader>
          {this.props.isMe?this.getMeTitleString():this.getUserTitleString()}
        </PageHeader>
      </Row>
    )
  }
  addItemForm() {
    if(!this.props.isMe) {
      return null
    }
    return (
      <Row>
        <Card>
          <h4>
          Add new {this.props.isForGroup?"group":(this.props.isForWant?"want":"offer")}
          </h4>
          <Form horizontal>
            {this.getQuestions().map(this.getFormElement.bind(this))}
            {(!this.props.isForWant && !this.props.isForGroup)?this.showFileForm():this.showNothing()}
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button bsStyle="primary" type="submit" onClick={this.validateForm.bind(this)}>Add Item</Button>
              </Col>
            </FormGroup>
          </Form>
        </Card>
      </Row>
    )
  }
  addItemElement(item) {
    console.log("addElemetnItems:")
    console.log(item)
    let optionalElements = null
    if(!this.props.isForGroup && !this.props.isForWant){
      optionalElements = (
        <div>
          Price: {item.price}
          <br />
          Amount: {item.amount}
          <br />
        </div>
      )
    }
    return (
      <Row>
        <Card>
          Name: {this.isForGroup?item.groupname:item.name}
          <br />
          Description: {item.descriptions}
          <br />
          Category: {item.category}
          <br />
          {optionalElements}
          <Button bsStyle="primary" type="submit" onClick={e => this.submitDeleteForm.bind(this)(e,item)}>Delete Item</Button>
        </Card>
      </Row>
    )
  }
  addNoItemElement() {
    let username = 'You have'
    let wantOrOffer = this.props.isForGroup?'groups':(this.props.isForWant?'wants':'offers')
    let title = `${username} no ${wantOrOffer}`
    return <BackgroundNotice title={title} />
  }


  render() {
    if(!Auth.getInstance().isLoggedIn()) {
      return <Redirect to='/login' />
    }
    if(!this.props.user) {
      return null
    }
    let items = []
    items = this.getItemList()
    return (
      <div id="formDiv">
        <p id='paraID'>{this.state.errorMsg}</p>
        {this.addPageHeader()}
        {this.addItemForm()}
        {items.length > 0?(items.map(this.addItemElement.bind(this))):this.addNoItemElement()}

      </div>
    )
  }
}
