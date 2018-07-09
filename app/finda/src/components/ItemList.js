"use strict";

import React from 'react';
import {Table} from 'react-bootstrap';
import ItemListRow from './ItemListRow';
import ItemListRowOffer from './ItemListRowOffer';

export default class ItemList extends React.Component{

    constructor(props){
        super(props);
    }





offers()
{
    if(this.props.offers)
    {
      return(  this.props.offers.map(function(offer){
                            return <ItemListRowOffer key={offer._id} offer={offer}></ItemListRowOffer>
                        })
      )
    }
    else
    {
        return ("");
    }

}


wants()
{
    if(this.props.wants)
        {
          return(  this.props.wants.map(function(want){
                                return <ItemListRow key={want._id} want={want}></ItemListRow>
                            })
          )
        }
        else
        {
            return ("");
        }

}






    render() {
    let style={
                overflowY:'auto',
    };

        return (
        <div >
        <div style={style}>

        <Table hover condensed={false}>
            <thead>
                <tr>
                    <th></th>
                    <th></th>



                </tr>
            </thead>
            <tbody>
            {this.props.isOffers?this.offers():this.wants()}


            </tbody>

        </Table>
        </div>
        </div>



        )
    }




}