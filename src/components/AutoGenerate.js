import React, {useEffect, useState} from 'react';
import Styled from "styled-components";
import {Input, DatePicker, Button, message, List} from "antd";
import db from "../firebase";
import firebase from "firebase";
import moment from "moment";
import {HashRouter as Router, Redirect} from "react-router-dom";

const Wrapper = Styled.div`
margin: 40px;
display: flex;
align-items: stretch;
justify-content: stretch;
flex-direction: column;
`;
const ButtonWrapper = Styled.div`
margin: 20px 0;
display: flex;
align-items: center;
justify-content: center;
`;
const ListWrapper = Styled.div`
flex-grow: 1;
padding: 12px 0;
background: #fff;
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
const SaveButtonWrapper = Styled.div`
width: 100%;
background: #fff;
position: sticky;
bottom: 0;
padding: 10px;
text-align: center;
`;
function AutoGenerate({match}) {
  const [formData,setFormData] = useState({invoice_count: 0,from_date: new Date(), to_date: new Date()});
  const [lastInvoice, setLastInvoice] = useState(null);
  const [initLoading, setInitLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [data, setData] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savingCount, setSavingCount] = useState(0);

  const handleKeyChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  };
  useEffect(()=>{
    // db.collection('invoices').orderBy("number", "desc").where("org", "==", match.params.id).limit(10).get()
    //     .then((snapshot)=>{
    //       snapshot.forEach(function(doc) {
    //         doc.ref.delete();
    //         console.log('deleted')
    //       });
    //     });
    db.collection('invoices').orderBy("number", "desc").where("org", "==", match.params.id).limit(1).get()
        .then((snapshot)=>{
          setLastInvoice(snapshot.docs[snapshot.docs.length-1]);
          const data = snapshot.docs.map(doc => doc.data());
          setLastInvoice(data[data.length-1]);
          setInitLoading(false);
          setInvoices(data);
        })
        .catch(error=>{
          console.log(error);
          message.error('Invoices loading failed');
          setInitLoading(false);
        });
  },[]);

  const handleGenerate = ()=>{
    let daysLeft = days_between(formData.from_date,formData.to_date) + 1;
    let invoicesLeft = formData.invoice_count;
    setInitLoading(true);
    db.collection('invoices').orderBy("number", "asc").where("org", "==", match.params.id).limit(formData.invoice_count).get()
        .then((snapshot)=>{
          let data = snapshot.docs.map(doc => doc.data());
          let date = new Date(formData.from_date);
          let counter = 0;
          console.log(data);
          let validator = Math.floor(invoicesLeft/daysLeft);
          let changeValidator = true;
          if(data[0]){
            let invoice_number = lastInvoice.number;
            data = data.map(item => {
              invoice_number++;
              if(counter === validator){
                counter = 0;
                date.setDate(date.getDate()+1);
                daysLeft = days_between(date, formData.to_date)+1;
                if (daysLeft === 1){
                  validator = invoicesLeft
                }else{
                  validator = changeValidator ? Math.ceil(invoicesLeft/daysLeft) : Math.floor(invoicesLeft/daysLeft);
                }
                changeValidator = !changeValidator;
              }
              counter++;
              invoicesLeft--;
              console.log(counter,validator,daysLeft,invoicesLeft);
              return {
                buyer_name: item.buyer_name,
                created_at: firebase.firestore.Timestamp.fromDate(new Date()),
                cgst: 9,
                sgst: 9,
                final_amount: 15000,
                item: 'JIO ETOP',
                amount: 12711.86,
                invoice_date: firebase.firestore.Timestamp.fromDate(new Date(date)),
                gst: '',
                address_line_1: item.address_line_1,
                address_line_2: item.address_line_2,
                number: invoice_number,
                org: match.params.id
              }
            });
          }
          setInvoices([
              lastInvoice,
              ...data
          ]);
          setData([...data]);
          setInitLoading(false);
          console.log(data)
        })
  };
  const days_between = (date1, date2) => {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  };

  const handleSave = () => {
    if(data.length > 0){
      setSaving(true);
      console.log(data);
      let count = 0;
      data.forEach(dataItem => {
        db.collection('invoices').add(dataItem).then(doc => {
          count ++;
          setSavingCount(count);
        });
      })
    }
  };
  if(savingCount > 0 && savingCount === data.length){
    return <Router><Redirect to={`/${match.params.id}/list`} /></Router>
  }
  return(
      <Wrapper>
        <ButtonWrapper>
          <Input type={'number'} name={'invoice_count'} placeholder={'Invoice Count'} onChange={(e)=>handleKeyChange('invoice_count', Number(e.target.value))} />
          <DatePicker format={'DD-MM-YYYY'} onChange={(date)=>handleKeyChange('from_date', date)} defaultvalue={formData.invoice_date} />
          <DatePicker format={'DD-MM-YYYY'} onChange={(date)=>handleKeyChange('to_date', date)} defaultvalue={formData.to_date} />
          <Button type={'primary'} onClick={handleGenerate}>Preview</Button>
        </ButtonWrapper>
        <ListWrapper>
          <List
              loading={initLoading}
              itemLayout="horizontal"
              dataSource={invoices}
              renderItem={(item, index)=>(
                  <ListItem >
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
          {
            data.length > 0 &&
            <SaveButtonWrapper>
              <Button type={'primary'} loading={saving} onClick={handleSave}>{saving?`${savingCount}/${data.length}`:'Save'}</Button>
            </SaveButtonWrapper>
          }
        </ListWrapper>
      </Wrapper>
  )
}
export default AutoGenerate;