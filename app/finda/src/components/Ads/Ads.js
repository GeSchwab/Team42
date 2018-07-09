"use strict";
import React, { Component } from 'react';
import {Col} from 'react-bootstrap'

export default class Ads extends React.Component {

    constructor(props){
        super(props);

    }
    render(){

  return (
    <Col xsHidden smHidden md={3} lg={3}>

    <img style={{height:"100vh"}} src={this.props.aImage}/>

    </Col>

  )

}}
