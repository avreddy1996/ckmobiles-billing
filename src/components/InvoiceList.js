import React, {useEffect, useState} from "react";
import db from "../firebase";
import {List, Button, message} from "antd";
import Styled from "styled-components";
import Invoice from "./Invoice";
import moment from "moment";

const Wrapper = Styled.div`
margin: 40px;
display: flex;
align-items: flex-start;
`;
const ListWrapper = Styled.div`
flex-grow: 1;
margin-right: 40px;
padding: 12px 0;
background: #fff;
`;
const InvoiceWrapper = Styled.div`
@media screen{
width: 794px;
height: 1123px;
border-radius: 4px;
}
`;
const Section = Styled.div`
flex: 1 1 25%;
:not(:last-child){
border-right: 1px solid #e5e5e5;
margin-right: 10px;
}
`;
const Text1 = Styled.div`
font-size: 16px;
font-weight: 600;
text-transform: capitalize;
`;
const Text2 = Styled.div`
font-size: 12px;
font-weight: 500;
color: #4c4c4c;
`;
const ListItem = Styled.div`
padding: 12px;
margin: 0 12px;
border-bottom: 1px solid #f1f1f1;
cursor: pointer;
display: flex;
box-shadow: ${props => props.selected?'0 0 5px 0 rgba(0,0,0,0.1)':''};
background-color: ${props => props.selected?'#d2f7f7':''};
:hover{
box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
}
`;
function InvoiceList(){
  const [invoices, setInvoices] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(undefined);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const dataFetchLimit = 10;

  useEffect(()=>{
    window.matchMedia("print").addListener(function(e) {console.log(e)});
    db.collection('invoices').orderBy("number", "desc").limit(dataFetchLimit).get()
        .then((snapshot)=>{
          setLastInvoice(snapshot.docs[snapshot.docs.length-1]);
          const data = snapshot.docs.map(doc => doc.data());
          setInvoices(data);
          setInitLoading(false);
        })
        .catch(error=>{
          console.log(error);
          message.error('Invoices loading failed');
          setLoading(false);
        })
  },[]);

  const getData = () => {
    setLoading(true);
    if(lastInvoice){
      db.collection('invoices').orderBy("number", "desc").limit(dataFetchLimit).startAfter(lastInvoice).get()
          .then(snapshot => {
            setLastInvoice(snapshot.docs[snapshot.docs.length-1]);
            const data = snapshot.docs.map(doc => doc.data());
            setInvoices([
              ...invoices,
              ...data
            ]);
            setLoading(false)
          })
          .catch(err => {
            console.log(err);
            message.error('Invoices loading failed');
            setLoading(false);
          })
    }
  };

  const handleSelectInvocie = (index) => {
    if(selectedInvoices.indexOf(invoices[index]) === -1){
      setSelectedInvoices([...selectedInvoices,invoices[index]]);
    }else{
      selectedInvoices.splice(selectedInvoices.indexOf(invoices[index]),1);
      setSelectedInvoices([...selectedInvoices])
    }
  };

  const loadMore = !initLoading ? (
      <div style={{padding: '16px',textAlign: 'center'}}><Button type={"primary"} onClick={getData} loading={loading}>Load More</Button> </div>
  ):'';

  return(<Wrapper>
    <ListWrapper>
    <List
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={invoices}
        renderItem={(item, index)=>(
            <ListItem selected={selectedInvoices.indexOf(item) !== -1} onClick={()=>handleSelectInvocie(index)}>
              <Section>
                <Text2>Invoice No.</Text2>
                <Text1>{item.number}</Text1>
              </Section>
              <Section>
                <Text1>{item.buyer_name}</Text1>
                <Text2>{moment(item.invoice_date.toDate()).format('DD-MM-YYYY')}</Text2>
              </Section>
              <Section>
                <Text2>Invoice Amount</Text2>
                <Text1>&#8377;{item.final_amount}</Text1>
              </Section>

            </ListItem>
        )}
    />
    </ListWrapper>
    {
      selectedInvoices.length>0 &&
      <InvoiceWrapper id={'printarea'}>
        {
          selectedInvoices.map(invoice=>(
              <Invoice invoiceData={invoice} />
          ))
        }
      </InvoiceWrapper>
    }
  </Wrapper>)
}

export default InvoiceList;